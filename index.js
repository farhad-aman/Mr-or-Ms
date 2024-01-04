/**
 * Checks if the given string contains only letters and spaces.
 * @param {string} str - The string to be checked.
 * @returns {boolean} - True if the string contains only letters and spaces, false otherwise.
 */
const containsOnlyLettersAndSpaces = (str) => {
  return /^[A-Za-z\s]*$/.test(str);
};

/**
 * Validates the provided name, ensuring it meets specific criteria.
 * It also updates the error message shown to the user.
 * @param {string} name - The name to be validated.
 * @returns {boolean} - True if the name is valid, false otherwise.
 */
const validateName = (name) => {
  if (!name) {
    error.innerText = "Name is Empty!";
    return false;
  }
  if (!containsOnlyLettersAndSpaces(name)) {
    error.innerText = "Name should only contain letters and spaces!";
    return false;
  }
  if (name.length > 255) {
    error.innerText = "Name should be at most 255 characters!";
    return false;
  }
  return true;
};

/**
 * Validates the gender selection in the form.
 * @returns {boolean} - False if neither of the gender options is selected, true otherwise.
 */
const validateGender = () => {
  if (!isMale.checked && !isFemale.checked) {
    error.innerText = "Gender is not selected!";
    return false;
  }
  return true;
};

/**
 * Displays the gender prediction or an error message if no prediction is available.
 * @param {Object} prediction - The prediction object containing gender and probability.
 * @param {string} name - The name for which the prediction is made.
 */
const showPrediction = ({ gender, probability }, name) => {
  if (!gender) {
    error.innerText = "No prediction is available for this name!";
    predictionText.innerText = "No prediction is available for this name!";
  } else {
    const percentage = (probability * 100).toFixed(2);
    predictionText.innerText = `${percentage}% ${gender}`;
  }
};

/**
 * Fetches the gender prediction for a given name from an external API.
 * @param {string} name - The name for which the prediction is required.
 */
const fetchPrediction = async (name) => {
  const url = new URL("https://api.genderize.io/");
  url.search = new URLSearchParams({ name }).toString();
  
  try {
    const response = await fetch(url, { method: "GET" });
    if (response.ok) {
      const body = await response.json();
      showPrediction(body, name);
    } else {
      error.innerText = response.status === 404
        ? "No prediction is available for this name!"
        : "Something went wrong! Please try again later.";
    }
  } catch (error) {
    error.innerText = "An error occurred! Please try again later.";
  }
};

/**
 * Updates the displayed saved answer with the given values.
 * @param {string} name - The name to display.
 * @param {string} gender - The gender to display.
 */
const updateSavedAnswer = (name, gender) => {
  savedAnswerText.innerText = `${name} is ${gender}`;
  currentSavedAnswer.name = name;
  currentSavedAnswer.gender = gender;
};

/**
 * Retrieves and displays the saved gender value for a given name.
 * @param {string} name - The name for which the saved value is required.
 */
const getSavedValues = (name) => {
  const gender = localStorage.getItem(name);
  if (gender) {
    updateSavedAnswer(name, gender);
  } else {
    savedAnswerText.innerText = `No gender is saved for ${name}`;
  }
};

/**
 * Handles the form submission event.
 * Prevents default form submission, validates input, and fetches prediction.
 * @param {Event} event - The form submission event.
 */
const handleFormSubmit = (event) => {
  event.preventDefault();
  const name = nameInput.value;
  if (validateName(name)) {
    error.innerText = "";
    getSavedValues(name);
    fetchPrediction(name);
  }
};

/**
 * Handles the save button click event.
 * Validates input and saves the gender selection to localStorage.
 */
const handleSave = () => {
  const name = nameInput.value;
  if (validateName(name) && validateGender()) {
    error.innerText = "";
    const gender = isMale.checked ? "male" : "female";
    localStorage.setItem(name, gender);
    updateSavedAnswer(name, gender);
  }
};

/**
 * Handles the clear button click event.
 * Removes the saved gender value for the current name from localStorage.
 */
const handleClear = () => {
  localStorage.removeItem(currentSavedAnswer.name);
  savedAnswerText.innerText = `Cleared saved gender for ${currentSavedAnswer.name}`;
};

// DOM Elements
const nameInput = document.getElementById("name");
const error = document.getElementById("error");
const form = document.getElementById("form");
const isMale = document.getElementById("male");
const isFemale = document.getElementById("female");
const predictionText = document.getElementById("prediction");
const savedAnswerText = document.getElementById("saved-answer");

// Stores the current saved answer
const currentSavedAnswer = { name: "", gender: "" };

// Event Listeners
form.onsubmit = handleFormSubmit;
