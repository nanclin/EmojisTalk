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