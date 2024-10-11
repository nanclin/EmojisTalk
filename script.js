// JavaScript to handle emoji selection and form submission
const emojiButtons = document.querySelectorAll('.emoji-button');
const selectedEmojiInput = document.getElementById('selectedEmoji');
const form = document.querySelector('form');
const loadingSpinner = document.getElementById('loadingSpinner');
let selectedEmojiDisplay = document.getElementById('selectedEmojiDisplay');
const promptBox = document.getElementById('prompt');
let botMessageBoxReference = null;
let selectedEmoji;
let userMessage;
let botMessage;

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

    updateCharacterSelection(character);
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

function updateCharacterSelection(newCharacter) {

    // Update the hidden input value with the selected emoji
    selectedEmoji = newCharacter;
    selectedEmojiInput.value = newCharacter;

    // Set a localStorage variable
    localStorage.setItem('character', newCharacter);

    // update buttons selection
    emojiButtons.forEach(button => {
        if (button.innerHTML == newCharacter){
            button.classList.add('selected'); // Use 'button' instead of 'this'
        } else {
            button.classList.remove('selected'); // Remove 'selected' class from others
        }
    });

    // Call the function to clear all chat bubbles
    clearAllChatBubbles();

    //
    loadConversationHistory(newCharacter);

    console.log("New character selected: " + newCharacter);
}

function addToConversationHistory(character, role, message) {
    // Retrieve the current conversation history for the character from localStorage
    let conversationHistory = localStorage.getItem(`conversation_${character}`);
    let convoJson;

    // Check if conversation history exists
    if (conversationHistory) {
        convoJson = JSON.parse(conversationHistory);  // Parse existing history
    } else {
        convoJson = [];  // Initialize as an empty array if no history exists
    }

    // Add the new message object to the history
    convoJson.push({
        role: role,      // 'role' like 'user' or 'bot'
        message: message // The actual message content
    });

    // Save the updated conversation history back to localStorage
    localStorage.setItem(`conversation_${character}`, JSON.stringify(convoJson));

    // Print the conversation history in a pretty format
    console.log(JSON.stringify(convoJson, null, 2)); // Pretty print with 2-space indentation
}

// Function to load conversation history from localStorage for a selected character
function loadConversationHistory(character) {
    const convoHistory = localStorage.getItem(`conversation_${character}`);

    if (convoHistory) {
        const convoHistoryJSON = JSON.parse(convoHistory);
        createChatBubbles(convoHistoryJSON);
    } else {
        console.log(`No conversation history found for character: ${character}`);
    }
}

// Function to create chat bubbles
function createChatBubbles(conversation) {

    const chatContainer = document.getElementById('chat'); // Assuming you have a container div with id 'chat'

    conversation.forEach(entry => {

        if(entry.role == 'user'){
            // Create user message container
            const chatBubble = document.createElement('div');
            chatBubble.className = 'row chatBubble text-end justify-content-end'; // Add necessary classes

            const userColDiv = document.createElement('div');
            userColDiv.className = 'col-9 align-items-end'; // Set column class for user

            const userLabel = document.createElement('span');
            userLabel.id = 'userLabel'; // Set ID for user label
            userLabel.className = 'badge p-2 mb-1 bg-primary rounded-pill shadow-sm'; // Set label styling
            userLabel.textContent = 'User:'; // Set label text

            const userMessageText = document.createElement('p');
            userMessageText.className = 'bg-white p-3 rounded-5 shadow-sm'; // Chat bubble style
            userMessageText.textContent = entry.message; // User message content

            // Append user elements to user container
            userColDiv.appendChild(userLabel);
            userColDiv.appendChild(userMessageText);
            chatBubble.appendChild(userColDiv);
            chatContainer.appendChild(chatBubble);
        }
        else if(entry.role == 'bot'){

            // Remove the id right away if needed
            if (botMessageBoxReference != null){
                botMessageBoxReference.removeAttribute('id');
            }else{
                console.log("no botMessageBoxReference, is null");
            }

            // Create bot message container
            const chatBubble = document.createElement('div');
            chatBubble.className = 'row chatBubble'; // Add row class for bot message

            const botColDiv = document.createElement('div');
            botColDiv.className = 'col-9'; // Set column class for bot

            const botLabel = document.createElement('span');
            botLabel.className = 'badge p-2 mb-1 bg-white rounded-pill shadow-sm'; // Bot label styling
            botLabel.style.fontSize = 'large'; // Set font size for bot label
            botLabel.textContent = selectedEmojiInput.value; // Bot emoji content

            const botMessageText = document.createElement('p');
            botMessageText.id = 'botMessageBox'; // Set ID for bot message
            botMessageText.className = 'bg-white p-3 rounded-5 shadow-sm'; // Chat bubble style
            botMessageText.textContent = entry.message; // Initial bot message content

            // Append bot elements to bot container
            botColDiv.appendChild(botLabel);
            botColDiv.appendChild(botMessageText);
            chatBubble.appendChild(botColDiv);

            chatContainer.appendChild(chatBubble);

            // Store the element with id="botMessageBox" in a variable
            botMessageBoxReference = document.getElementById('botMessageBox');
        }
    });
}

// Function to render each message (adjust this to fit your chat structure)
function renderMessage(message) {
    console.log("render message: " + message.content);
    // return;
    const chatContainer = document.getElementById('chat');
    const messageRow = document.createElement('div');
    messageRow.classList.add('row');
    messageRow.classList.add('chatBubble');

    const colDiv = document.createElement('div');
    colDiv.classList.add('col-9');

    const messageContent = document.createElement('p');
    messageContent.classList.add('bg-white', 'p-3', 'rounded-5', 'shadow-sm');
    messageContent.textContent = message.content;

    colDiv.appendChild(messageContent);
    messageRow.appendChild(colDiv);
    chatContainer.appendChild(messageRow);
}

// Example usage inside event listener
emojiButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Call the reusable method
        updateCharacterSelection(this.dataset.emoji);
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
    userMessage = formData.get('prompt');

    //
    if(userMessage == '')
        userMessage = 'Introduce yourself.'

    // Add the character (selected emoji) value to the form data
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
            <p class="bg-white p-3 rounded-5 shadow-sm">${userMessage}</p>
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
        botMessage = xhr.responseText;
        console.log(botMessage);
        console.log("DONE!");
        addToConversationHistory(selectedEmoji, 'bot', botMessage);
    }

    addToConversationHistory(selectedEmoji, 'user', userMessage);

    console.log("formData['prompt']: " + userMessage);
    console.log("formData['character']: " + formData.get('character'));


    // Send the request
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        "model": "llama3.1",
        "prompt": userMessage,
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