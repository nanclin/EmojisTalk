<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emojis Talk</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="style.css"> <!-- Ensure this path is correct -->
</head>
<body>
    <h1>Emojis Talk 😁</h1>
    <form action="process.php" method="POST">
        <label for="character">Select Character:</label>

        <div id="emojiButtons">
            <button type="button" class="emoji-button" data-emoji="🐸">🐸</button>
            <button type="button" class="emoji-button" data-emoji="🐄">🐄</button>
            <button type="button" class="emoji-button" data-emoji="🍉">🍉</button>
            <button type="button" class="emoji-button selected" data-emoji="🎥">🎥</button>
            <button type="button" class="emoji-button" data-emoji="💩">💩</button>
            <button type="button" class="emoji-button" data-emoji="👶">👶</button>
            <button type="button" class="emoji-button" data-emoji="🧦">🧦</button>
            <button type="button" class="emoji-button" data-emoji="⚽">⚽</button>
        </div>

        <!-- Hidden input to store selected emoji value -->
        <input type="hidden" name="character" id="selectedEmoji" value="🎥">

        <br><br>
        <label for="prompt">Enter Prompt:</label>
        <input type="text" name="prompt" id="prompt" rows="4" cols="50" value="Introduce yourself"></input>
        <input class="confirm-button" type="submit" value="Send">

    </form>

    <!-- Bootstrap JS and dependencies -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

    <hr>
    <h2>Response:</h2>
    <pre id="response"></pre>

    <!-- Bootstrap Spinner -->
    <div id="loadingSpinner" class="d-none">
        <div class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    </div>

    <script>
        // JavaScript to handle emoji selection and form submission
        const emojiButtons = document.querySelectorAll('.emoji-button');
        const selectedEmojiInput = document.getElementById('selectedEmoji');
        const form = document.querySelector('form');
        const loadingSpinner = document.getElementById('loadingSpinner');

        // Add event listeners to all emoji buttons
        emojiButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove 'selected' class from all buttons
                emojiButtons.forEach(btn => btn.classList.remove('selected'));

                // Add 'selected' class to the clicked button
                this.classList.add('selected');

                // Update the hidden input value with the selected emoji
                selectedEmojiInput.value = this.dataset.emoji;
            });
        });

        // Ensure a default selection is sent if no button is clicked
        form.addEventListener('submit', function(event) {
            if (!selectedEmojiInput.value) {
                alert("Please select an emoji!");
                event.preventDefault(); // Prevent form submission if no emoji selected
            }
        });

        // Handle form submission with spinner
        form.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the default form submission behavior
            loadingSpinner.classList.remove('d-none'); // Show spinner

            const formData = new FormData(form);
            try {
                const response = await fetch('process.php', {
                    method: 'POST',
                    body: formData
                });
                const text = await response.text();
                document.getElementById('response').textContent = text;
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('response').textContent = 'An error occurred.';
            } finally {
                loadingSpinner.classList.add('d-none'); // Hide spinner
            }
        });

        // JavaScript to handle form submission on Enter key press in the text input
        document.getElementById('prompt').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent the default Enter key behavior
                form.querySelector('input[type="submit"]').click(); // Trigger form submission programmatically
            }
        });

    </script>

</body>
</html>