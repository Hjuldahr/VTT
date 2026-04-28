async function loadChat() {
    const response = await fetch("/campaign/load/chat", {
        method: "GET"
    });
    const results = await response.json();

    // Process

    return results;
}

function createChatBlock(entry) {
    const container = document.createElement('div')
}

document.addEventListener('DOMContentLoaded', () => {
    const textBoxInput = document.getElementById('text_box_input');
    
    let chatEntries = await loadChat();
    chatEntries.array.forEach(createChatBlock);

    textBoxInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            console.log("Enter key pressed!");
        }
    });
});