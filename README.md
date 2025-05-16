# color-scheme


This npm package manages color scheme (Light/Dark mode) for front-end application (user preference / system preference). 
The color scheme setting is done in the following priority order:
1. local storage (keep track of previous user choice)
2. user preference
3. browser settings
4. system settings


We recommend using the `color-scheme` CSS property, for example : 

```css
:root {
  color-scheme: light dark;
}
```

Note that this package does not update CSS, but a callback function can be triggered on color scheme change. Update your CSS in this function. 



[![Animation showing the system color scheme manager](/images/color-scheme.gif)](https://youtu.be/4t21iBqSLeI)


## Install 

```bash
npm install btfcss@color-scheme
```

## Usage

Import the package

```js
import colorScheme from "@btfcss/color-scheme";
```

### Get User Choice

The function `getUserChoice()` returns the current user choice:
- `"light"` : light mode
- `"light dark"` : system settings
- `"dark"` : dark mode


If user choice has never been set, check if a previous choice has been recorded in local storage, otherwise the library set system settings (`"light dark"`) as default.

``` js
// Should display "light", "light dark" or "dark"
console.log (colorScheme.getUserChoice()}
```

### Get System Color Scheme

The function `getSystem()` returns the system settings:
- `"light"` : light mode
- `"dark"` : dark mode

``` js
// Should display "light" or "dark"
console.log (colorScheme.getSystem()}
```

Note that the system color scheme is not necessary the same as the page. For example, system can be set to dark while the user selected light in the page. User choice overide system settings. 


### Get Current Color Scheme

The function `getCurrent()` returns the page current color scheme:
- `"light"` : light mode
- `"dark"` : dark mode

``` js
// Should display "light" or "dark"
console.log (colorScheme.getCurrent()}
```

### Get Current Status

The function `get()` returns an object containing the current color scheme status:
 * `status.user` - The user's choice `["light" | "light dark" | " dark"]`
 * `status.current` - The page color scheme `["light" | " dark"]`
 
 ``` js
// Log the current color scheme status
console.log (colorScheme.getCurrent()}
// {user: 'light dark', current: 'dark'}
```

## Set New User Choice

When the user selects a new color scheme from the interface, you have to call the `setUserChoice(newChoice)` fonction. The function expects a string as parameter. The value of the string must be one of the following:
- `"light"` : set light mode
- `"light dark"` : set system settings
- `"dark"` : set dark mode

This function does not update the CSS, but dispatches an event that will trigger the callback function. It is recommended to update the CSS in the callback function. 


## Listen for Change

The `addEventListenerOnChange(callback)` set a callback function that will be called when the page color scheme changes. Changes may occurs 
- because the function `setUserChoice()` has been called 
- or because the user choice is set to system (`"light dark"`) and system settings has changed. 

The callback function receives the new object status as parameter :
 * `status.user` - The user's choice `["light" | "light dark" | " dark"]`
 * `status.current` - The page color scheme `["light" | " dark"]`
 
```js
colorScheme.addEventListenerOnChange((status) => {
    // On change, set the new CSS color scheme
    document.querySelector(':root').style.setProperty('color-scheme', status.user);

    // Log new status in console
    console.log ('User choice', status.user);
    console.log ('Current scheme', status.current);
}));
```



## Full Example

This full example can be tested online in [CodeSandBox](https://codesandbox.io/p/sandbox/color-scheme-yh97d3).
### HTML

``` html
<h1>Color Scheme Manager</h1>
Select color scheme :
<select id="color-scheme-selector">
    <option value="light">Light</option>
    <option value="light dark" selected>System</option>
    <option value="dark">Dark</option>
</select>
```

### CSS

```css
:root {
  color-scheme: light dark;
}

* {
  font-family: sans-serif;
  color: light-dark(#000, #fff);
  background-color: light-dark(#fff, #000);
}
```


### JavaSCript

``` js
import "./styles.css";
import colorScheme from "@btfcss/color-scheme";

// Get the selector element
const selector = document.getElementById("color-scheme-selector");

// When the selector changes
selector.addEventListener("change", () => {
  colorScheme.setUserChoice(selector.value);
});

// Callback function
function onChange(status) {
  // On change, set the new CSS color scheme
  document
    .querySelector(":root")
    .style.setProperty("color-scheme", status.user);

  // Update the selector according to user choice
  selector.value = status.user;
}

// Listen color scheme changes
colorScheme.addEventListenerOnChange(onChange);

// Call at start up for applying user preferences
onChange(colorScheme.get());
```