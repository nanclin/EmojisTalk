<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Emojis Talk</title>
        <!-- Bootstrap CSS -->
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
                            localStorage.clear();
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

        <!-- scroll back to button -->
        <button id="scrollTopButton" onclick="scrollToTop()">↑</button>

        <!-- title -->
        <div class="container-fluid p-0">
            <div class="row">
                <div class="col">
                    <h1 class="text-center shadow bg-white display-4">EmojiGPT 🤖</h1>
                </div>
            </div>
        </div>


        <!-- Modal -->
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Choose Your Emoji</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              
              <div class="modal-body">
                <div class="container m-0">
                    <div class="row">
                        <emoji-picker class="text-center light" style="padding: 0"></emoji-picker>
                    </div>
                </div>
              </div>
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
                            <button type="button" class="emoji-button m-1 p-1 btn btn-primary shadow-sm d-inline-flex align-items-center justify-content-center" data-bs-toggle="modal" data-bs-target="#exampleModal" >
                                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0px; width: 32; height: 32; font-size: 11px;">
                                    <!-- Add emojis in each div below -->
                                    <div>😊</div>
                                    <div>❤️</div>
                                    <div>👽</div>
                                    <div>🇬🇧</div>
                                    <div>🥷</div>
                                    <div>🌲</div>
                                    <div>🧊</div>
                                    <div>💯</div>
                                    <div>🙄</div>
                                    <!-- Continue adding more divs with emojis up to 81 (9x9 grid) -->
                                </div>
                            </button>
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
        <div id="chat" class="container container-small">

            <!-- TODO: Find a way to remove form from here, and move it to the bottom of messages -->
            <form action="process.php" method="POST" id="emojiForm">
                <div class="row bg-white fixed-bottom p-3 align-items-center justify-content-center">
                    <div class="col g-3">
                        <textarea
                            placeholder="Type your message..."
                            name="prompt"
                            id="prompt"
                            type="text"
                            rows="2"
                            value="SAY"
                            class="form-control bg-white form-text rounded-1 p-3 m-0 shadow-lg"
                            style="resize: none;"></textarea>
                    </div>
                    <div class="col-auto g-3">
                        <button id="submit-btn" type="submit" class="form-control rounded-5 p-3 m-0 btn btn-primary shadow-lg" style="width: 70px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16">
                                <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </form>
        </div>

        <!-- TODO: scale this dynamically based on prompt textarea height, so that the messages are pushed up, so you can see whole convo -->
        <div id="bottom-space" class="container" style="height: 100px;">
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
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Link to your external JavaScript file -->
    <script src="script.js"></script>
    <!-- other -->
    <script type="module" src="https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js"></script>

    </body>
</html>