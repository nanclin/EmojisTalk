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

    <!-- title -->

    <div class="container-fluid">
        <div class="row">
            <div class="col-sm">
                <h1 class="text-center mb-4">Emojis Talk 😁</h1>
            </div>
        </div>
    </div>

    <form action="process.php" method="POST" id="emojiForm">

      <!-- character selection -->

        <div class="container">
            <div class="row">
                <div class="col-sm">
                    <h5>1) Select Emoji:</h5>
                </div>
            </div>
        </div>

        <div class="container-fluid">
            <div class="row">
                <div class="col-sm">
                    <div class="form-group">
                        <div id="emojiButtons" class="text-center">
                            <button type="button" class="emoji-button btn btn-light" data-emoji="🐸">🐸</button>
                            <button type="button" class="emoji-button btn btn-light" data-emoji="🐄">🐄</button>
                            <button type="button" class="emoji-button btn btn-light" data-emoji="🍉">🍉</button>
                            <button type="button" class="emoji-button btn btn-light selected" data-emoji="🎥">🎥</button>
                            <button type="button" class="emoji-button btn btn-light" data-emoji="💩">💩</button>
                            <button type="button" class="emoji-button btn btn-light" data-emoji="👶">👶</button>
                            <button type="button" class="emoji-button btn btn-light" data-emoji="🧦">🧦</button>
                            <button type="button" class="emoji-button btn btn-light" data-emoji="⚽">⚽</button>
                        </div>
                        <input type="hidden" name="character" id="selectedEmoji" value="🎥">
                    </div>
                </div>
            </div>
        </div>

        
        <hr>


        <!-- text input -->
        <div class="container">

          <div class="row">
            <div class="col">
              <!-- 💬 -->
              <h5>2) Talk to Emoji:</h5>
            </div>
          </div>

        <div class="row">
            <div class="col-9">

                <div class="input-group input-group-lg mb-3">
                  <textarea type="text" name="prompt" id="prompt" class="form-control"></textarea>
                  <div class="input-group-append">
                    <!-- <span class="input-group-text">.00</span> -->
                    <input type="submit" value="SAY" class="btn btn-primary">
                  </div>
                </div>
            </div>

            <div class="col">
            </div>
        </div>
        </div>

    </form>

        <!-- <hr> -->

        <!-- response -->
        <div class="container">
            <div class="row">
                <div class="col">
                </div>
                <div class="col-9">

                    <div class="input-group input-group-lg">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="selectedEmojiDisplay" style="font-size: 30px;">🎥</span>
                        </div>
                        <textarea id="response" type="text" class="form-control readonly"></textarea>
                    </div>

                </div>
            </div>

        </div>


    <!-- Bootstrap Spinner -->
    <div id="loadingSpinner" class="d-none">
        <div class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
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