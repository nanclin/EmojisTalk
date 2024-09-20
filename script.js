// JavaScript to handle emoji selection and form submission
const emojiButtons = document.querySelectorAll('.emoji-button');
const selectedEmojiInput = document.getElementById('selectedEmoji');
const form = document.querySelector('form');
const loadingSpinner = document.getElementById('loadingSpinner');
const selectedEmojiDisplay = document.getElementById('selectedEmojiDisplay');

// Add event listeners to all emoji buttons
emojiButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove 'selected' class from all buttons
        emojiButtons.forEach(btn => btn.classList.remove('selected'));

        // Add 'selected' class to the clicked button
        this.classList.add('selected');

        // Update the hidden input value with the selected emoji
        selectedEmojiInput.value = this.dataset.emoji;

        // Update the display div with the selected emoji
        selectedEmojiDisplay.textContent = this.dataset.emoji;
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
    for (const [key, value] of formData.entries()) {
        console.log(`form data: ${key}: ${value}`);
    }

    const xhr = new XMLHttpRequest();

    // Open a connection to the PHP script
    xhr.open('POST', 'process.php', true);

    // Set up the response stream handling
    xhr.onprogress = function() {
        // Update the webpage with each chunk of data as it's received
        document.getElementById('response').value = xhr.responseText;
        loadingSpinner.classList.add('d-none'); // Hide spinner
        console.log("on progress... " + loadingSpinner);
    };

    xhr.onload = function(){
        console.log("DONE!");
        // document.getElementById('resultDiv').innerHTML += "DONE: "+xhr.responseText;
    }

    console.log("formData['prompt']: " + formData.get('prompt'));


    // Send the request
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        "model": "llama3.1",
        "messages": [{ "role": "user", "content": formData.get('prompt') }],
        "prompt": formData.get('prompt'),
        "character": formData.get('character'),
        "stream": true,
    }));
});

// JavaScript to handle form submission on Enter key press in the text input
document.getElementById('prompt').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default Enter key behavior
        form.querySelector('input[type="submit"]').click(); // Trigger form submission programmatically
    }
});