// JavaScript to handle emoji selection and form submission
const emojiButtons = document.querySelectorAll('.emoji-button');
const selectedEmojiInput = document.getElementById('selectedEmoji');
const form = document.querySelector('form');
const loadingSpinner = document.getElementById('loadingSpinner');
let selectedEmojiDisplay = document.getElementById('selectedEmojiDisplay');
const promptBox = document.getElementById('prompt');
let botMessageBoxReference = null;
let selectedEmoji;

document.addEventListener('DOMContentLoaded', function() {

    // Check if a character is stored in localStorage
    const storedCharacter = localStorage.getItem('character');

    if (storedCharacter) {
        // If a character is found, load the page accordingly
        loadPageForCharacter(storedCharacter);
    } else {
        // If no character is found, you can set a default behavior
        loadDefaultPage();
    }
});

// Function to load page based on the selected character
function loadPageForCharacter(character) {
    console.log(`Loading page for character: ${character}`);
    // Add your code to modify the page for the specific character here
    // For example, you could set the character in a form or display character-specific content

    selectedEmoji = character;
    selectedEmojiInput.value = character;

    emojiButtons.forEach(button => {
        if (button.innerHTML == character){
            button.classList.add('selected'); // Use 'button' instead of 'this'
        } else {
            button.classList.remove('selected'); // Remove 'selected' class from others
        }
    });
}

// Function for default page load behavior
function loadDefaultPage() {
    console.log('No character found, loading default page.');
    // Add your code for the default behavior here
}

function clearAllChatBubbles() {
    const chatContainer = document.getElementById('chat'); // Get the container element
    const rows = chatContainer.querySelectorAll('.chatBubble');   // Select all elements with class 'chatBubble'

    // Loop through the rows and remove each one from the parent container
    rows.forEach(row => {
        row.remove();
    });
    console.log("all chat bubbles cleared");
}

promptBox.addEventListener('input', function() {
    this.style.height = 'auto'; // Reset the height
    this.style.height = (this.scrollHeight) + 'px'; // Set it based on content
});

// Add event listeners to all emoji buttons
emojiButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove 'selected' class from all buttons
        emojiButtons.forEach(btn => btn.classList.remove('selected'));

        // Add 'selected' class to the clicked button
        this.classList.add('selected');

        // Update the hidden input value with the selected emoji
        selectedEmoji = this.dataset.emoji;
        selectedEmojiInput.value = selectedEmoji;

        // Set a localStorage variable
        localStorage.setItem('character', selectedEmoji);

        console.log("new character selected: " + selectedEmoji);

        // Call the function to clear all rows
        clearAllChatBubbles();
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

    // Prevent the default form submission behavior
    event.preventDefault();

    // Show spinner
    loadingSpinner.classList.remove('d-none');

    const formData = new FormData(form);

    // Add the character (selected emoji) value to the form data
    selectedEmoji = document.getElementById('selectedEmoji').value;
    formData.append('character', selectedEmoji);  // Add emoji as "character"
    
    for (const [key, value] of formData.entries()) {
        console.log(`form data: ${key}: ${value}`);
    }

    // create new user message from input message

    var userContainer = document.createElement('div');
    userContainer.className = 'row chatBubble text-end justify-content-end';
    userContainer.innerHTML = `
        <div class="col-9 align-items-end">
            <span id="userLabel" class="badge p-2 mb-1 bg-primary rounded-pill shadow-sm">User:</span>
            <p class="bg-white p-3 rounded-5 shadow-sm">${formData.get('prompt')}</p>
        </div>
    `;

    // Remove the id right away if needed
    if (botMessageBoxReference != null){
        botMessageBoxReference.removeAttribute('id');
    }else{
        console.log("no botMessageBoxReference, is null");
    }

    // create new box
    // and wait for response stream
    var botContainer = document.createElement('div');
    botContainer.className = 'row chatBubble';
    botContainer.innerHTML = `
        <div class="col-9 ">
            <span class="badge p-2 mb-1 bg-white rounded-pill shadow-sm" style="font-size:large">${selectedEmojiInput.value}</span>
            <p id="botMessageBox" class="bg-white p-3 rounded-5 shadow-sm">...</p>
        </div>
    `;

    // append
    document.getElementById('chat').appendChild(userContainer);
    document.getElementById('chat').appendChild(botContainer);

    // Store the element with id="botMessageBox" in a variable
    botMessageBoxReference = document.getElementById('botMessageBox');

    // reset prompt
    promptBox.value = '';
    promptBox.style.height = 'auto';  // Reset height to default
    // TODO fix slim input
    // TODO expand page height together with the textarea height


    // Optionally, if you want to reapply dynamic resizing after clearing
    promptBox.style.height = promptBox.scrollHeight*0.5 + 'px'; // Adjust height to fit any new content


    // const element = document.getElementById('chat');
    // element.scrollTop = element.scrollHeight;
    window.scrollTo(0, document.body.scrollHeight);

    loadingSpinner.classList.remove('d-none'); // Show spinner

    const xhr = new XMLHttpRequest();

    // Open a connection to the PHP script
    xhr.open('POST', 'process.php', true);

    // Set up the response stream handling
    xhr.onprogress = function() {
        // Update the webpage with each chunk of data as it's received
        document.getElementById('botMessageBox').textContent = xhr.responseText;
        loadingSpinner.classList.add('d-none'); // Hide spinner
        console.log("on progress... " + loadingSpinner);
    };

    xhr.onload = function(){
        console.log("DONE!");
    }

    console.log("formData['prompt']: " + formData.get('prompt'));
    console.log("formData['character']: " + formData.get('character'));


    // Send the request
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        "model": "llama3.1",
        "prompt": formData.get('prompt'),
        "character": formData.get('character'),
        "stream": true
    }));
});

// JavaScript to handle form submission on Enter key press in the text input
document.getElementById('prompt').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default Enter key behavior
        form.querySelector('input[type="submit"]').click(); // Trigger form submission programmatically
    }
});