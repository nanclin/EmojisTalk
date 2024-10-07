<?php

// // Enable error reporting for debugging purposes
// error_reporting(E_ALL);
// ini_set('display_errors', 1);

session_start();


if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Set content type header for JSON
    header('Content-Type: application/json');

    // Switch based on the requested function
    switch ($_POST['function']) {
        case 'debug session content':
            echo json_encode($_SESSION, JSON_PRETTY_PRINT);
            exit(); // Stop any further output

        case 'clear session':
            // Clear the session
            $_SESSION = []; // Empty the session array

            // Optionally, destroy the session completely
            // session_destroy(); // Uncomment if you want to destroy the session entirely
            echo json_encode(["message" => "Session cleared!"]);
            exit();

        // default:
        //     $_SESSION['debug'][] = ["dbg" => "No function by the name " . htmlspecialchars($_POST['function'])];
        //     exit();
    }
}

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
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

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
                    $_SESSION['messages'][] = ['role' => 'bot', 'content' => $output];
                    return $output; // Return the full output
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

    // Read and decode the incoming JSON payload
    $data = json_decode(file_get_contents('php://input'), true);
    
    $character = !empty($data['character']) ? $data['character'] : 'unknown character never to be revealed';
    $_SESSION['debug'][] = ["dbg" => $data];
    
    // reset if new character
    // this does not work
    if ($character !== $_SESSION['character']) {
        $_SESSION['debug'][] = ["dbg" => "new character: " . $character];
        $_SESSION['character'] = $character;
        $_SESSION['call_count'] = "";
        unset($_SESSION['messages']);
    }

    // Initialize messages array in session if it doesn't exist
    if (!isset($_SESSION['messages'])) {
        $formattedPrompt = processPromptGeneric($character, "");
        $_SESSION['messages'] = [
            ["role" => "system", "content" => $formattedPrompt]
        ];
    }

    // Initialize or increment the counter
    if (!isset($_SESSION['call_count'])) {
        $_SESSION['call_count'] = 0;
    }

    $_SESSION['call_count']++;

    // remove all system messages
    // except first
    $firstSystemMessageFound = false;
    $_SESSION['messages'] = array_values(array_filter($_SESSION['messages'], function($message) use (&$firstSystemMessageFound) {
        if ($message['role'] === 'system') {
            if ($firstSystemMessageFound) {
                return false; // Skip subsequent system messages
            } 
            $firstSystemMessageFound = true; // Allow the first system message
        }
        return true; // Keep non-system messages
    }));

    $prompt = !empty($data['prompt']) ? $data['prompt'] : 'introduce yourself';
    $_SESSION['messages'][] = ['role' => 'user', 'content' => $prompt];

    $response = chat($_SESSION['messages']);

    echo $response['content'] ?? 'No response from server';
}

?>

