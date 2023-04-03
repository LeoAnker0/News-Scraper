console.log("cheese")

const viewMenuButton = document.querySelector('#viewMenuButton');
const menu = document.querySelector('#menu');

let viewMenuCounter = 0
    viewMenuButton.addEventListener('click', function() {
        // execute your desired action here
        //console.log('View Menu button clicked');
        if (viewMenuCounter == 0) {
          menu.style.display = "block";
          viewMenuCounter = 1

        } else {
          menu.style.display = "none";
          viewMenuCounter = 0
        }

    });


//the code for the form
// Get the button and the form elements
const addRowButton = document.getElementById("addRowButton");
const form = document.getElementById("form");

// Add an event listener to the button
addRowButton.addEventListener("click", function () {
  // Create a new row
  const newRow = document.createElement("div");
  newRow.classList.add("row");

  // Add the HTML for the row
  newRow.innerHTML = `
    <select name="where">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
      <option value="3">Option 3</option>
    </select>
    <select name="how_many">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
      <option value="3">Option 3</option>
    </select>
    <select name="condition">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
      <option value="3">Option 3</option>
    </select>
    <select name="command">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
      <option value="3">Option 3</option>
    </select>
    <input type="text" name="content" placeholder="Content">`;

  // Append the row to the form
  form.appendChild(newRow);
});