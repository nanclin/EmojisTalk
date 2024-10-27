const emojiButtons = []
const selectedEmojiInput = document.getElementById('selectedEmoji');
const emojiButtonsContainer = document.getElementById("emojiButtons");
const form = document.querySelector('form');
const loadingSpinner = document.getElementById('loadingSpinner');
let selectedEmojiDisplay = document.getElementById('selectedEmojiDisplay');
const promptBox = document.getElementById('prompt');
let botMessageBoxReference = null;
let selectedEmoji;
let userMessage;
let botMessage;
const startEmojiList = ["🐸", "🐄", "🍉", "💩", "👶", "🧦", "⚽", "🎥"];
const defaultEmoji = "🎥";
let recentEmojis = JSON.parse(localStorage.getItem('recentEmojis')) || [];

document.addEventListener('DOMContentLoaded', function() {
    initEmojiButtons();
});
// Function to initialize emoji buttons
function initEmojiButtons() {
    // Retrieve the last selected character from localStorage, or predefined default
    const lastSelectedEmoji = localStorage.getItem("lastSelectedEmoji") || defaultEmoji;  

    // Get recent emojis from localStorage
    recentEmojis = JSON.parse(localStorage.getItem('recentEmojis')) || [];

    // Add starting emojis to recent emojis if no recent emojis exist
    if (recentEmojis.length == 0) {
        startEmojiList.forEach(emoji => {
            updateRecentCharacters(emoji); // Function to add an emoji to recent emojis
        });
    }

    // Create emoji buttons for each recent emoji found
    recentEmojis.forEach(emoji => {
        createEmojiButton(emoji); // Function to create an emoji button in the UI
    });

    // Update the displayed character selection based on the last selected character
    updateCharacterSelection(lastSelectedEmoji); 
}

// Function to create a button for an emoji
function createEmojiButton(emoji) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "emoji-button m-1 p-1 btn btn-light shadow-sm";
    button.dataset.emoji = emoji;
    button.textContent = emoji;

    // Event listener to store the selected emoji in localStorage
    button.addEventListener("click", () => {
        // localStorage.setItem("lastSelectedEmoji", emoji);
        // document.getElementById("selectedEmoji").value = emoji;  // Update hidden input
        // initEmojiButtons();  // Refresh buttons
        updateCharacterSelection(emoji);
    });

    {
         // Find the button by matching the emoji
        const buttonToRemove = Array.from(emojiButtonsContainer.children).find(button => button.textContent === emoji);
        
        // If the button exists, remove it
        if (buttonToRemove) {
            emojiButtonsContainer.removeChild(buttonToRemove);
        }
    }

    emojiButtons.push(button);
    emojiButtonsContainer.insertBefore(button, emojiButtonsContainer.children[1]);

    // todo remove duplicated buttons
}

// Function to remove the last button from emojiButtonsContainer
function removeEmojiButton() {
    // const secondButton = emojiButtonsContainer.children[1]; // Get the second button
    // if (secondButton) {
    //     emojiButtonsContainer.removeChild(secondButton); // Remove the second button
    // }

    // remove the last button from emojiButtonsContainer
    const lastButton = emojiButtonsContainer.lastElementChild; // Get the last button
    if (lastButton) {
        emojiButtonsContainer.removeChild(lastButton); // Remove the last button
    }
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

function updateCharacterSelection(lastSelectedEmoji) {

    // Update the hidden input value with the selected emoji
    selectedEmoji = lastSelectedEmoji;
    selectedEmojiInput.value = lastSelectedEmoji;

    // Set a localStorage variable
    localStorage.setItem('lastSelectedEmoji', lastSelectedEmoji);

    // update buttons selection
    emojiButtons.forEach(button => {
        if (button.innerHTML == lastSelectedEmoji){
            button.classList.add('selected'); // Use 'button' instead of 'this'
        } else {
            button.classList.remove('selected'); // Remove 'selected' class from others
        }
    });

    // Call the function to clear all chat bubbles
    clearAllChatBubbles();

    //
    loadConversationHistory(lastSelectedEmoji);

    // Call this function whenever a new emoji is selected
    updateRecentCharacters(lastSelectedEmoji);

    console.log("New character selected: " + lastSelectedEmoji);
}

// Function to update the recent emoji list
function updateRecentCharacters(newEmoji) {

    if (recentEmojis.includes(newEmoji)){
        console.log("Was already on the list of recents: "+recentEmojis);
        return;
    }

    // // Remove the emoji if it already exists to prevent duplicates
    // recentEmojis = recentEmojis.filter(emoji => emoji !== newEmoji);

    // Add the new emoji to the list
    recentEmojis.push(newEmoji);

    // Limit to the last x emojis
    if (recentEmojis.length > 30) {
        recentEmojis.shift();
        removeEmojiButton();
    }

    // Save the updated list back to localStorage
    localStorage.setItem('recentEmojis', JSON.stringify(recentEmojis));

    console.log("Recent Emojis: "+recentEmojis);
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
            botLabel.className = 'badge text-muted fs-3 p-2 mb-1 bg-white rounded-pill shadow-sm'; // Bot label styling
            botLabel.style.fontSize = 'large'; // Set font size for bot label
            botLabel.textContent = selectedEmojiInput.value.split(' ')[0]; // Bot emoji content

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

/////

document.querySelector('emoji-picker').addEventListener('emoji-click', function () {
    console.log('Emoji clicked:', event.detail);
    
    var modalElement = document.getElementById('exampleModal')
    var modal = bootstrap.Modal.getInstance(modalElement) // Returns a Bootstrap modal instance
    modal.hide();

    console.log("PICKER: " + event.detail.unicode + ' ' + event.detail.emoji.shortcodes);

    var lastSelectedEmoji = event.detail.unicode;// + ` (details: ${event.detail.emoji.shortcodes.join(", ")})`;

    updateRecentCharacters(lastSelectedEmoji);

    createEmojiButton(lastSelectedEmoji);

    updateCharacterSelection(lastSelectedEmoji);
});