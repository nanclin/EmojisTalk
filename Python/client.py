import json
import requests

# NOTE: ollama must be running for this to work, start the ollama app or run `ollama serve`
model = "llama3.1"  # TODO: update this for whatever model you wish to use

def chat(messages):
    """
    Sends a chat request to the server and processes the streamed response.
    Args: messages (list): List of messages in the conversation history.
    Returns: dict: The final message received from the server after processing all streamed tokens.
    """
    # Make a POST request to the chat server with the model and messages
    r = requests.post(
        "http://0.0.0.0:11434/api/chat",
        json={"model": model, "messages": messages, "stream": True, "options":{"temperature": 1, "seed": 123}},
        stream=True  # Enable streaming to receive the response incrementally
    )
    
    # Raise an exception if the request fails
    r.raise_for_status()

    output = ""  # Initialize an empty string to store the output

    # print("HISTORY:")
    # print(messages)
    # print("")

    # Iterate over each line in the streamed response
    for line in r.iter_lines():
        body = json.loads(line)  # Parse the JSON response from the server
        
        # If there's an error in the response, raise an exception
        if "error" in body:
            raise Exception(body["error"])
        
        # If the response is not complete ('done' is False), process the streamed content
        if body.get("done") is False:
            message = body.get("message", "")  # Get the message object from the response
            content = message.get("content", "")  # Extract the 'content' field from the message
            output += content  # Append the streamed content to the output
            # Print the streamed content token by token as it's received
            print(content, end="", flush=True)

        # If the response is complete ('done' is True), return the final message
        if body.get("done", False):
            message["content"] = output  # Update the message with the complete output
            return message  # Return the final message object

def processPromptGenericFromFile(character, prompt):
    # Path to your configuration file
    config_file = 'character.prompt'

    # Read the content of the configuration file
    with open(config_file, 'r') as file:
        template = file.read()

    # Replace placeholders with actual character
    new_prompt = template.replace('{{character}}', character)

    # Append the user prompt
    new_prompt = f"[[{new_prompt}]] {prompt}"

    return new_prompt

def main():
    messagesHistory = []

    # selected_character = "frog"  # Method selection, can be "frog", "cow", "horse", etc.
    # Ask user to select a character
    selected_character = input("Choose a character: ").strip().lower()

    # add initial priming prompt
    messagesHistory.append({"role": "user", "content": processPromptGenericFromFile(selected_character,"")})

    while True:
        user_input = input("Enter a prompt: ")

        print()
        messagesHistory.append({"role": "user", "content": user_input})
        message = chat(messagesHistory)
        messagesHistory.append(message)
        print("\n\n")

if __name__ == "__main__":
    main()
