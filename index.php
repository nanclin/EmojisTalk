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

    <!-- Bootstrap JS and dependencies -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <!-- Link to your external JavaScript file -->
    <script src="script.js"></script>

</body>
</html>