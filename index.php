<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emojis Talk</title>
</head>
<body>
    <h1>Emojis Talk 😁</h1>
    <form action="process.php" method="POST">
        <label for="character">Select Character:</label>
        <select name="character" id="character">
            <!-- <option value="generic">Generic</option> -->
            <option value="🐸">🐸</option>
            <option value="🐄">🐄</option>
            <option value="🍉">🍉</option>
            <option value="🎥">🎥</option>
            <option value="💩">💩</option>
            <option value="👶">👶</option>
            <option value="🧦">🧦</option>
            <option value="⚽">⚽</option>
        </select>
        <br><br>
        <label for="prompt">Enter Prompt:</label>
        <textarea name="prompt" id="prompt" rows="4" cols="50"></textarea>
        <br><br>
        <input type="submit" value="Send">
    </form>
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