const inputField = document.getElementById("search-field");
const searchBtn = document.getElementById("search-btn");
const foodContainer = document.getElementById("food-container");
const form = document.getElementById("form");

const localStorageKey = "foodItems";

// Fetch and display data from localStorage on page load
document.addEventListener("DOMContentLoaded", () => {
  const fetchedFoodItems = JSON.parse(localStorage.getItem(localStorageKey)) || [];
  fetchedFoodItems.forEach((item) => addToUI(item.foodItem)); // Add each item to the UI
  toggleListVisibility(); // Check if the list should be displayed or not
});

// Function to add an item to the UI
function addToUI(foodItemValue) {
  const listCreated = document.createElement("li");
  listCreated.className = "food-list";
  listCreated.innerHTML = `
    <p><input readonly class="input-field" type="text" value="${foodItemValue}"></p>
    <div class='iconsParent'>
      <svg class='editButton' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      </svg>
      <svg class='saveButton hidden' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </svg>
      <svg class='deleteButton' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
      </svg>
    </div>`;

  // Add the new list item to the food container
  foodContainer.append(listCreated);

  // Attach event listeners to the newly created buttons
  const editIcon = listCreated.querySelector('.editButton');
  const saveIcon = listCreated.querySelector('.saveButton');
  const inputField = listCreated.querySelector('.input-field');
  
  editIcon.addEventListener("click", () => {
    inputField.removeAttribute("readonly");
    inputField.focus(); // Focus on the input field for editing
    inputField.style.outline = '1px solid #eeccdc';
    const length = inputField.value.length;
    inputField.setSelectionRange(length, length);
    saveIcon.classList.remove("hidden"); // Show the save icon
    editIcon.classList.add("hidden"); // Hide the edit icon
  });
  
  saveIcon.addEventListener("click", () => {
    if(inputField.value != '') {
      inputField.setAttribute("readonly", true);
      saveIcon.classList.add("hidden"); // Hide the save icon
      editIcon.classList.remove("hidden"); // Show the edit icon
      inputField.style.outline = 'none';
    updateLocalStorage(foodItemValue, inputField.value); // Update the value in localStorage
    } else {
      alert('List cannot be empty!');
      inputField.focus();
    }
  });

  inputField.addEventListener('blur', ()=> {
    inputField.setAttribute("readonly", true);
      saveIcon.classList.add("hidden"); // Hide the save icon
      editIcon.classList.remove("hidden"); // Show the edit icon
      inputField.style.outline = 'none';
    updateLocalStorage(foodItemValue, inputField.value); // Update the value in localStorage
  }); 
  

  const deleteIcon = listCreated.querySelector('.deleteButton');
  // Delete button functionality
  deleteIcon.addEventListener("click", () => {
    listCreated.remove();
    removeFromLocalStorage(foodItemValue);
    toggleListVisibility(); // Check visibility after removing an item
  });

  toggleListVisibility(); // Check visibility after adding an item
}

// Handle form submission
form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (inputField.value !== "") {
    // Add the item to the UI and localStorage
    addToUI(inputField.value);
    addToLocalStorage(inputField.value); // Save the item to localStorage
    inputField.value = ""; // Clear the input field after submission
    inputField.focus();
  }
});

// Add item to localStorage
function addToLocalStorage(foodItemValue) {
  const foodItems = JSON.parse(localStorage.getItem(localStorageKey)) || [];
  foodItems.push({ foodItem: foodItemValue });
  localStorage.setItem(localStorageKey, JSON.stringify(foodItems));
}

// Remove item from localStorage
function removeFromLocalStorage(foodItemValue) {
  const foodItems = JSON.parse(localStorage.getItem(localStorageKey)) || [];
  const updatedFoodItems = foodItems.filter((item) => item.foodItem !== foodItemValue);
  localStorage.setItem(localStorageKey, JSON.stringify(updatedFoodItems));
}

// Function to update localStorage (if needed)
function updateLocalStorage(oldValue, newValue) {
  const foodItems = JSON.parse(localStorage.getItem(localStorageKey)) || [];
  const updatedItems = foodItems.map(item => 
    item.foodItem === oldValue ? { foodItem: newValue } : item
  );
  localStorage.setItem(localStorageKey, JSON.stringify(updatedItems));
}

// Toggle visibility of the list based on the number of items
function toggleListVisibility() {
  const emptyList = document.getElementById('nolist');
  if (foodContainer.children.length > 0) {
    foodContainer.style.display = "block"; // Show the list if items exist
    emptyList.style.display = 'none';
  } else {
    foodContainer.style.display = "none"; // Hide the list if no items exist
    emptyList.style.display = 'block';
  }
}
