<?php

function chat($messages) {
    $model = "llama3.1";
    $apiUrl = "http://0.0.0.0:11434/api/chat";

    $postData = json_encode([
        "model" => $model,
        "messages" => $messages,
        "stream" => true
    ]);

    $ch = curl_init($apiUrl);

    // settings
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);

    $output = "";
    curl_setopt($ch, CURLOPT_WRITEFUNCTION, function ($ch, $data) use (&$output) {

        // debug_to_console($data);
        $lines = explode("\n", $data);
        foreach ($lines as $line) {
            if (trim($line)) {
                $body = json_decode(trim($line), true);

                // data contains error
                if (isset($body['error'])) {
                    throw new Exception($body['error']);
                }

                // data contains info that message is not done yet
                if (isset($body['done']) && $body['done'] === false) {
                    $message = $body['message'] ?? [];
                    $content = $message['content'] ?? '';
                    $output .= $content;
                    echo $content;
                    ob_flush();
                    flush();
                }

                // data contains info that message is DONE
                if (isset($body['done']) && $body['done'] === true) {
                    $message['content'] = $output;
                    curl_close($ch);
                    return $message;
                }
            }
        }
        return strlen($data);
    });

    $response = curl_exec($ch);
    if (curl_errno($ch)) {
        throw new Exception(curl_error($ch));
    }
    curl_close($ch);

    return json_decode($response, true);
}

function processPromptGeneric($character, $prompt) {
    // Path to your configuration file
    $configFile = 'character.prompt';

    // Read the content of the configuration file
    $template = file_get_contents($configFile);

    // Replace placeholders with actual character
    $newPrompt = str_replace('{{character}}', $character, $template);

    // Append the user prompt
    $newPrompt = "[[" . $newPrompt . "]]" . " " . $prompt;

    return $newPrompt;
}

// Main processing based on form input
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $character = $_POST['character'] ?? 'generic';
    $prompt = $_POST['prompt'] ?? '';

    $formattedPrompt = processPromptGeneric($character, $prompt);
    
    $messages = [
        ["role" => "user", "content" => $formattedPrompt]
    ];

    $response = chat($messages);
    echo $response['content'] ?? 'No response from server';
}

?>

