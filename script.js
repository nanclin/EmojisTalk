const emojiButtons = []
const selectedEmojiInput = document.getElementById('selectedEmoji');
const emojiButtonsContainer = document.getElementById("emojiButtons");
const form = document.querySelector('form');
const loadingSpinner = document.getElementById('loadingSpinner');
const scrollTopButton = document.getElementById("scrollTopButton");
let selectedEmojiDisplay = document.getElementById('selectedEmojiDisplay');
const promptBox = document.getElementById('prompt');
let botMessageBoxReference = null;
let userMessage;
let botMessage;
let recentEmojisList = JSON.parse(localStorage.getItem('recentEmojisList')) || [];
const maxButtonsCount = 5;

// Modified default emoji list with metadata
const startEmojiList = [
    { unicode: "🐸", annotation: "frog", tags: ["animal", "amphibian"] },
    { unicode: "🐄", annotation: "cow", tags: ["animal", "farm"] },
    { unicode: "🍉", annotation: "watermelon", tags: ["fruit", "food"] },
    { unicode: "💩", annotation: "pile of poo", tags: ["funny", "gross"] },
    { unicode: "👶", annotation: "baby", tags: ["person", "young"] },
    { unicode: "🧦", annotation: "socks", tags: ["clothing", "feet"] },
    { unicode: "⚽", annotation: "soccer ball", tags: ["sports", "ball"] },
    { unicode: "🎥", annotation: "movie camera", tags: ["film", "video"] }
];

// Update the default emoji
const defaultEmoji = startEmojiList[7]; // Movie camera emoji with metadata

// Function to format emoji info consistently
function formatEmojiInfo(emojiData) {
    return [
        emojiData.annotation,
        emojiData.unicode,
        ...(emojiData.tags || [])
    ].join(', ');
}

document.addEventListener('DOMContentLoaded', function() {
    initEmojiButtons();

    // Call once on page load
    adjustBottomSpace();
});

// Function to initialize emoji buttons
function initEmojiButtons() {

    // Get recent emojis from localStorage
    recentEmojisList = JSON.parse(localStorage.getItem('recentEmojisList')) || [];
    console.log("loaded recent list: ", recentEmojisList);

    // Add starting emojis to recent emojis if no recent emojis exist
    if (recentEmojisList.length === 0) {
        startEmojiList.forEach(emojiData => {
            updateRecentCharacters(emojiData);
        });
    }

    // Create emoji buttons for each recent emoji
    recentEmojisList.forEach(emojiData => {
        createEmojiButton(emojiData);
    });

    // initialize last selected emoji
    try {
        // Try to load the stored emoji data
        const storedEmojiData = localStorage.getItem('lastSelectedEmoji');
        if (storedEmojiData) {
            const parsedEmojiData = JSON.parse(storedEmojiData);
            // Verify the parsed data has the expected structure
            switchActiveEmoji(parsedEmojiData);
            return;
        }
    } catch (error) {
        console.log('Error loading stored emoji, falling back to default:', error);
    }
    
    // If we get here, either no stored emoji or invalid data
    switchActiveEmoji(defaultEmoji);
}

// Function to create a button for an emoji
function createEmojiButton(emojiData) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "emoji-button m-1 p-1 btn btn-light shadow-sm";
    button.dataset.emoji = emojiData.unicode;
    button.textContent = emojiData.unicode;

    // Event listener to store the selected emoji in localStorage
    button.addEventListener("click", () => {
        switchActiveEmoji(emojiData);
    });

    // Remove existing button if present
    const buttonToRemove = Array.from(emojiButtonsContainer.children)
        .find(btn => btn.textContent === emojiData.unicode);
    if (buttonToRemove) {
        emojiButtonsContainer.removeChild(buttonToRemove);
    }

    emojiButtons.push(button);
    emojiButtonsContainer.appendChild(button);
}

function removeExtraButtons() {
    while (emojiButtonsContainer.children.length > maxButtonsCount+1) {
        emojiButtonsContainer.removeChild(emojiButtonsContainer.lastElementChild);
    }
}

// Function to remove the last button from emojiButtonsContainer
function removeLastEmojiButton() {

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

    // adjust space and scroll down when typing
    adjustBottomSpace();
});

function adjustBottomSpace() {
    const promptBoxHeight = parseInt(window.getComputedStyle(promptBox).height);
    const bottomSpaceDiv = document.querySelector('#bottom-space');
    
    bottomSpaceDiv.style.height = (50 + promptBoxHeight) + 'px';
    window.scrollTo(0, document.body.scrollHeight);
}

function switchActiveEmoji(emojiData) {
    console.log('Switching to emoji:', emojiData);

    // Convert emoji to Unicode
    const emoji = emojiData.unicode;
    const unicodeStr = `U+${emoji.codePointAt(0).toString(16).toUpperCase()}`;
    console.log("Emoji to Unicode:", unicodeStr);

    // Convert Unicode back to emoji
    const unicodeCode = unicodeStr;
    const emojiBack = String.fromCodePoint(parseInt(unicodeCode.slice(2), 16));
    console.log("Unicode to Emoji:", emojiBack);

    // Update the current emoji selection
    lastSelectedEmojiData = emojiData;
    
    // Update the hidden input value
    selectedEmojiInput.value = emojiData.unicode;
    
    // Store the complete emoji data in localStorage
    localStorage.setItem('lastSelectedEmoji', JSON.stringify(emojiData));
    
    // Update button selection states
    emojiButtons.forEach(button => {
        if (button.dataset.emoji === emojiData.unicode) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });
    
    // Reset and reload conversation
    clearAllChatBubbles();
    loadConversationHistory(emojiData.unicode);
    
    // Update recent characters list if needed
    updateRecentCharacters(emojiData);

    // scroll down to the bottom of the chat
    window.scrollTo(0, document.body.scrollHeight);
    
    console.log("Switched to character:", emojiData.annotation);
}

// Function to update the recent emoji list
function updateRecentCharacters(emojiData) {
    // Find the index of the emoji if it exists
    const existingIndex = recentEmojisList.findIndex(item => item.unicode === emojiData.unicode);

    if (existingIndex !== -1) {
        console.log("Was already on the list of recents: ", recentEmojisList);
        return;
    }

    // Add the emoji to the end of the list
    recentEmojisList.push(emojiData);

    // // Limit to the last maxButtonsCount emojis
    // while (recentEmojisList.length > maxButtonsCount) {
    //     recentEmojisList.pop();
    //     // removeLastEmojiButton();
    // }

    // Save the updated list back to localStorage
    localStorage.setItem('recentEmojisList', JSON.stringify(recentEmojisList));
    
    console.log("Recent Emojis:", recentEmojisList);
}

function addToConversationHistory(unicode, role, message) {
    // Retrieve the current conversation history for the character from localStorage
    let conversationHistory = localStorage.getItem(`conversation_${unicode}`);
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
    localStorage.setItem(`conversation_${unicode}`, JSON.stringify(convoJson));

    // // Print the conversation history in a pretty format
    // console.log(JSON.stringify(convoJson, null, 2)); // Pretty print with 2-space indentation
}

// Function to load conversation history from localStorage for a selected character
function loadConversationHistory(unicode) {
    const convoHistory = localStorage.getItem(`conversation_${unicode}`);

    if (convoHistory) {
        const convoHistoryJSON = JSON.parse(convoHistory);
        createChatBubbles(convoHistoryJSON);
        console.log(`Convo history for character: ${unicode} loaded!`);
    } else {
        console.log(`No conversation history found for character: ${unicode}`);
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
            botLabel.className = 'badge fs-3 p-2 mb-1 bg-white rounded-pill shadow-sm'; // Bot label styling
            botLabel.style.fontSize = 'large'; // Set font size for bot label
            botLabel.textContent = lastSelectedEmojiData.unicode;

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
    formData.append('character', formatEmojiInfo(lastSelectedEmojiData));  // Add emoji as "character"
    
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
            <span class="badge fs-3 p-2 mb-1 bg-white rounded-pill shadow-sm" style="font-size:large">${lastSelectedEmojiData.unicode}</span>
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
    promptBox.rows = '2';
    // TODO expand page height together with the textarea height


    // Optionally, if you want to reapply dynamic resizing after clearing
    promptBox.style.height = promptBox.scrollHeight + 'px'; // Adjust height to fit any new content


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

        // adjust space needed and scroll when new text is streamed
        adjustBottomSpace();
    };

    xhr.onload = function(){
        botMessage = xhr.responseText;
        console.log(botMessage);
        console.log("DONE!");
        addToConversationHistory(lastSelectedEmojiData.unicode, 'bot', botMessage);
    }

    addToConversationHistory(lastSelectedEmojiData.unicode, 'user', userMessage);

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
document.querySelector('emoji-picker').addEventListener('emoji-click', function(event) {
    console.log('Emoji clicked:', event.detail);
    
    var modalElement = document.getElementById('exampleModal');
    var modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();

    const emojiData = {
        unicode: event.detail.emoji.unicode,
        annotation: event.detail.emoji.annotation,
        tags: event.detail.emoji.tags
    };

    createEmojiButton(emojiData);
    switchActiveEmoji(emojiData);
    updateRecentCharacters(emojiData);
});

// Show or hide the button based on scroll position
window.onscroll = function() {
    toggleScrollButton()
    console.log("scroll...");
};

function toggleScrollButton() {
    console.log("scroll top: ", document.documentElement.scrollTop);
    console.log("scrollTopButton: ", scrollTopButton);
    if (document.documentElement.scrollTop > 300) {
        scrollTopButton.style.display = "block";
    } else {
        scrollTopButton.style.display = "none";
    }
}

// Scroll smoothly back to the top when the button is clicked
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}