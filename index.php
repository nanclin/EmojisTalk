<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Emojis Talk</title>
        <!-- Bootstrap CSS -->
        <!-- <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"> -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="style.css"> <!-- Ensure this path is correct -->
    </head>
    <body>

        <script>

            const urlParams = new URLSearchParams(window.location.search);
            const debugButtonsOn = urlParams.has('debug') && urlParams.get('debug') === '1';

            if (debugButtonsOn){
                // Define the array of PHP function names
                const phpFunctions = [];
                phpFunctions.push('debug session content');
                phpFunctions.push('clear session');

                // Dynamically create buttons for each PHP function
                phpFunctions.forEach(functionName => {
                    const button = document.createElement('button');
                    button.textContent = functionName;
                    button.addEventListener('click', function () {
                        callPhpFunction(functionName); // Call the generic function
                    });
                    document.body.appendChild(button); // Append the button to the body
                });

                // Generic function to call the specified PHP function via AJAX
                function callPhpFunction(functionName) {

                    switch(functionName){
                        case 'clear session':
                            localStorage.removeItem('character');
                            break;
                    }

                    fetch('process.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: `function=${encodeURIComponent(functionName)}`
                    })
                    .then(response => {
                        // First, try to read the response as JSON
                        return response.json().then(data => {
                            // Successfully parsed as JSON
                            return data;
                        }).catch(err => {
                            // If JSON parsing fails, read it as plain text
                            return response; // Return the plain text response
                        });
                    })
                    .then(data => {
                        // Display the response from PHP in the <pre> element
                        document.getElementById('output').innerText = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
                    })
                    .catch(error => console.error('Error:', error));
                }
            }
        </script>

        <!-- Area to display the PHP output -->
        <pre id="output"></pre>


        <!-- title -->
        <div class="container-fluid p-0">
            <div class="row">
                <div class="col">
                    <h1 class="text-center shadow bg-white display-4">Emojis Talk AI 🤖</h1>
                </div>
            </div>
        </div>

        <!-- character selection -->
        <div class="container">
            <div class="row">
                <div class="col-sm">
                    <h4 class="text-center"><span style="font-size:30px">1</span>   Select Emoji</h4>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-sm">
                    <div class="form-group">
                        <div id="emojiButtons" class="text-center">
                            <button type="button" class="emoji-button btn btn-light shadow-sm" data-emoji="🐸">🐸</button>
                            <button type="button" class="emoji-button btn btn-light shadow-sm" data-emoji="🐄">🐄</button>
                            <button type="button" class="emoji-button btn btn-light shadow-sm" data-emoji="🍉">🍉</button>
                            <button type="button" class="emoji-button btn btn-light shadow-sm selected" data-emoji="🎥">🎥</button>
                            <button type="button" class="emoji-button btn btn-light shadow-sm" data-emoji="💩">💩</button>
                            <button type="button" class="emoji-button btn btn-light shadow-sm" data-emoji="👶">👶</button>
                            <button type="button" class="emoji-button btn btn-light shadow-sm" data-emoji="🧦">🧦</button>
                            <button type="button" class="emoji-button btn btn-light shadow-sm" data-emoji="⚽">⚽</button>
                        </div>
                        <input type="hidden" name="character" id="selectedEmoji" value="🎥">
                    </div>
                </div>
            </div>
        </div>

        <hr>

        <!-- chat -->

        <div class="container">
            <div class="row">
                <div class="col">
                    <!-- 💬 -->
                    <h4 class="text-center"><span style="font-size:30px">2</span>   Talk to Emoji</h4>
                </div>
            </div>
        </div>

        <!-- text input -->
        <div id="chat" class="container">

            <!-- TODO: Find a way to remove form from here, and move it to the bottom of messages -->
            <form action="process.php" method="POST" id="emojiForm">
                <div class="row bg-white fixed-bottom p-3 align-items-center justify-content-center">
                    <div class="col-6 g-3">
                        <textarea name="prompt" id="prompt" type="text" rows="1" value="SAY" class="form-control bg-white form-text rounded-1 p-3 m-0 shadow-lg" style="resize: none;"></textarea>
                    </div>
                    <div class="col-1 g-3">
                        <input type="submit" value="SAY" class="form-control rounded-5 p-3 m-0 btn btn-primary shadow-lg">
                    </div>
                </div>
            </form>
        </div>

        <!-- TODO: scale this dynamically based on prompt textarea height, so that the messages are pushed up, so you can see whole convo -->
        <div class="container" style="height: 100px;">
        </div>

        <!-- Bootstrap Spinner -->
        <div id="loadingSpinner" class="d-none">
            <div class="d-flex justify-content-center">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>

    </div>
    </div>

    <!-- Bootstrap JS and dependencies -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <!-- Link to your external JavaScript file -->
    <script src="script.js"></script>
    </body>
</html>