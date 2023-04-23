document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("custom-form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const position = form.querySelector(".position").value;
        const length = form.querySelector(".length").value;
        const condition = form.querySelector(".condition").value;
        const command = form.querySelector(".command").value;
        const content = form.querySelector(".content").value;

        // Perform custom validation and filtering based on input values
        const finalContent = filterContent(position, length, condition, command, content);

        // Combine input values into a single string
        const result = `${position},${length},${condition},${command},${finalContent}`;

        console.log(result);
    });
});

function filterContent(position, length, condition, command, content) {
    // Add your custom filters based on input values
    // For example, if position is "end", modify content in some way
    if (position === "end") {
        content += "_end";
    }

    // Add more conditions and custom filters as needed
    // For example, if command is "string" and content contains numbers, remove them
    if (command === "string") {
        content = content.replace(/[0-9]/g, '');
    }

    return content;
}