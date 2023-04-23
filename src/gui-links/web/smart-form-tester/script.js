const positions = ["end", "start", "in"];
const lengths = ['all'];
const conditions = ["true", "false"];
const commands = ["string", "is_numeric", "count"];
const contents = ['all'];

window.onload = () => {
    const addButton = document.getElementById("add-button");
    addButton.addEventListener("click", addInputGroup);

    // Create initial input group
    addInputGroup();
};

function addInputGroup() {
    const inputGroup = document.createElement("div");
    inputGroup.classList.add("input-group");

    // Create position input with datalist
    const positionInput = document.createElement("input");
    positionInput.classList.add("position");
    positionInput.type = "text";
    positionInput.placeholder = "Position";
    positionInput.setAttribute("list", "position-options");
    positionInput.autocomplete = "off";
    inputGroup.appendChild(positionInput);

    const lengthInput = document.createElement("input");
    lengthInput.classList.add("length");
    lengthInput.type = "text";
    lengthInput.placeholder = "Length";
    lengthInput.autocomplete = "off";
    inputGroup.appendChild(lengthInput);

    // Create condition input with datalist
    const conditionInput = document.createElement("input");
    conditionInput.classList.add("condition");
    conditionInput.type = "text";
    conditionInput.placeholder = "Condition";
    conditionInput.setAttribute("list", "condition-options");
    conditionInput.autocomplete = "off";
    inputGroup.appendChild(conditionInput);

    // Create command input with datalist
    const commandInput = document.createElement("input");
    commandInput.classList.add("command");
    commandInput.type = "text";
    commandInput.placeholder = "Command";
    commandInput.setAttribute("list", "command-options");
    commandInput.autocomplete = "off";
    inputGroup.appendChild(commandInput);

    const contentInput = document.createElement("input");
    contentInput.classList.add("content");
    contentInput.type = "text";
    contentInput.placeholder = "Content";
    contentInput.autocomplete = "off";
    inputGroup.appendChild(contentInput);

    document.getElementById("input-groups-container").appendChild(inputGroup);

    // Set up suggestions for newly created input elements
    setupSuggestions(positionInput, positions);
    setupSuggestions(conditionInput, conditions);
    setupSuggestions(commandInput, commands);
    setupSuggestions(lengthInput, lengths);
    setupSuggestions(contentInput, contents);
}

// Helper function to set up suggestions for a field
function setupSuggestions(input, options) {
    const suggestion = document.createElement("span");
    suggestion.classList.add("suggestion");
    input.parentNode.appendChild(suggestion);

    input.addEventListener("input", (e) => {
        const inputText = e.target.value;
        suggestion.textContent = findSuggestion(inputText, options);
        positionSuggestion(input, suggestion);
    });

    input.addEventListener("blur", () => {
        suggestion.textContent = "";
    });

    // Listen for the Enter key press to autofill the suggestion
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && suggestion.textContent) {
            e.preventDefault(); // Prevent form submission if the input is in a form
            input.value = suggestion.textContent;
            suggestion.textContent = "";
        }
    });
}


function findSuggestion(input, options) {
    if (!input) return "";

    for (const option of options) {
        if (option.startsWith(input)) {
            return option;
        }
    }

    return "";
}

function positionSuggestion(input, suggestion) {
    // Adjust these variables to change the position of the suggestions
    const suggestionOffsetX = 0; // Move the suggestion horizontally
    const suggestionOffsetY = -23; // Move the suggestion vertically

    const inputCoords = input.getBoundingClientRect();
    suggestion.style.top = `${
    inputCoords.top + inputCoords.height + suggestionOffsetY
  }px`;
    suggestion.style.left = `${
    inputCoords.left + inputCoords.width / 2 - suggestion.offsetWidth / 2 + suggestionOffsetX
  }px`;
}


//