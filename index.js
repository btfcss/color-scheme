import systemColorScheme from "@btfcss/system-color-scheme";


// User color scheme choice [ "light" | "light dark" | "dark"]
// Check in local storage first, then set "light dark" as default
let userChoice = localStorage.getItem('btfcss-color-scheme') || "light dark";


// Event triggered when then color scheme changes (from user or system)
const colorSchemeChangedEvent = new CustomEvent("btfcss-color-scheme-changed");



/**
 * Sets the new user color scheme preference.
 * If the preference has changed, the callback function is executed.
 *
 * @param {"light" | "system" | "dark"} newUserChoice - The new user-selected color scheme.
 */

const setUserChoice = (newUserChoice) => {

  // Do not process if the user choice has not changed
  if (newUserChoice == userChoice) return;

  // Set the new user choice
  userChoice = newUserChoice;
  localStorage.setItem('btfcss-color-scheme', userChoice);

  // Trigger the event for the new color scheme
  document.dispatchEvent(colorSchemeChangedEvent);
}



/**
 * Return the current color scheme status
 * 
 * @returns {object} Current status
 * @property {"light" | "dark" | "light dark"} user - The user's selected preference.
 * @property {"light" | "dark"} current - The currently active color scheme on the page.
 */
const get = () => {
  return { "user" : userChoice, "current": getCurrent() };
}


/**
 * Returns the current color scheme applied to the page.
 *
 * @returns {"light" | "dark"} The current page color scheme.
 */
const getCurrent = () => {
  return (userChoice === 'light dark') ? systemColorScheme.get() : userChoice
}



/**
 * Returns the user's selected color scheme preference.
 *
 * @returns {"light" | "system" | "dark"} The current user color scheme choice.
 */

const getUserChoice = () => {
  return userChoice;
}


/**
 * Sets the callback function to be triggered when the color scheme changes.
 *
 * The callback is invoked when:
 * - The user's color scheme preference has changed.
 * - The user preference is set to "light dark" (i.e., system), and the system theme has changed.
 *
 * @param {(status: { user: "light" | "light dark" | "dark", current: "light" | "dark" }) => void} callback
 * A function that will be called when the page color scheme changes.
 * The callback receives an object with the following properties:
 * - `user`: The user's color scheme preference.
 * - `current`: The currently active color scheme on the page.
 */

const addEventListenerOnChange = (callback) => {
  document.addEventListener('btfcss-color-scheme-changed', () => {    
    callback(get());
  });
}


/** 
 * Trigger the color scheme change event on system change
 * The event is only triggered if the user choice is system ("light dark")
 */
systemColorScheme.addEventListenerOnChange((isDark) => {
  // If the user choice is not system color scheme, exit
  if (userChoice == "light dark") return;
  // Otherwise, trigger the event on system settings change
  document.dispatchEvent(colorSchemeChangedEvent);
})



/**
 * Returns the system color scheme preference
 *
 * @returns {"light" | "dark"} The current system color preference
 */
const getSystem = systemColorScheme.get;



// Export the color scheme utility module
const colorScheme = {
  setUserChoice,
  getUserChoice,
  getSystem,
  getCurrent,
  get,
  addEventListenerOnChange
};

export default colorScheme;
