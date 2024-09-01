<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emojis Talk</title>
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
        <textarea name="prompt" id="prompt" rows="4" cols="50">Introduce yourself</textarea>
        <br><br>
        <input type="submit" value="Send">

    </form>


    <script>
        const emojiButtons = document.querySelectorAll('.emoji-button');
        const selectedEmojiInput = document.getElementById('selectedEmoji');

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
        document.getElementById('emojiForm').addEventListener('submit', function(event) {
            if (!selectedEmojiInput.value) {
                alert("Please select an emoji!");
                event.preventDefault();
            }
        });
    </script>

    <hr>
    <h2>Response:</h2>
    <pre id="response"></pre>

    <script>
        const form = document.querySelector('form');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            const response = await fetch('process.php', {
                method: 'POST',
                body: formData
            });
            const text = await response.text();
            document.getElementById('response').textContent = text;
        });
    </script>
</body>
</html>