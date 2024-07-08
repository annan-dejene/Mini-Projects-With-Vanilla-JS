// ------------------------------------------------- Global selections and variables -------------------------------------------
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll("input[type='range']");
const currentHexes = document.querySelectorAll(".color h2");

const copyContainer = document.querySelector(".copy-container");
const copyPopup = document.querySelector(".copy-popup");

const adjustButtons = document.querySelectorAll(".adjust");
const lockButtons = document.querySelectorAll(".lock");

// for local storage --  an array of objects
let savedPalettes = [];

let initialColors;

//  -------------------------------------------------------- Event Listners ---------------------------------------------------

generateBtn.addEventListener("click", randomColors);

sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});

colorDivs.forEach((div, index) => {
  div.addEventListener("change", () => {
    updateTextUI(index);
  });
});

// Clipboard functionality
currentHexes.forEach((hex) => {
  hex.addEventListener("click", () => {
    // Copy the hex to clipboard
    navigator.clipboard.writeText(hex.innerText);

    // Show confirmation
    copyContainer.classList.add("active");
    copyPopup.classList.add("active");
  });
});

copyPopup.addEventListener("transitionend", () => {
  copyPopup.classList.remove("active");
  copyContainer.classList.remove("active");
});

// Sliders after click
adjustButtons.forEach((adjustBtn) => {
  adjustBtn.addEventListener("click", (event) => {
    const adjustSliders = event.target.parentElement.parentElement.children[2];
    adjustSliders.classList.toggle("active");

    // Remove slider with the X btn
    const closeAdjustment = adjustSliders.children[0];

    closeAdjustment.addEventListener("click", () => {
      adjustSliders.classList.remove("active");
    });
  });
});

// Lock a color palette
lockButtons.forEach((lockBtn, idx) => {
  lockBtn.addEventListener("click", () => {
    // Save that palette
    lockBtn.parentElement.parentElement.classList.toggle("locked");

    // change the icon
    lockBtn.classList.toggle("locked");

    if (lockBtn.classList.contains("locked")) {
      lockBtn.innerHTML = `<i class="fa fa-lock" aria-hidden="true"></i>`;
    } else {
      lockBtn.innerHTML = `<i class="fas fa-lock-open"></i>`;
    }
  });
});

//  -------------------------------------------------------- Functions --------------------------------------------------------

// Color generator
function generateHex() {
  //   const letters = "0123456789ABCDEF";
  //   let color = "#";

  //   for (let i = 0; i < 6; i++) {
  //     color += letters[Math.floor(Math.random() * 16)];
  //   }

  //   return color;
  // Instead of the above code, we can use chroma.js library to generate random colors
  const hexColor = chroma.random();
  return hexColor;
}

function randomColors() {
  initialColors = []; // Reset everytime we generate new colors (refresh the page)
  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    const randomColor = generateHex();

    const prevColor = hexText.innerText;

    // Add the color to the initialColors array
    initialColors.push(chroma(randomColor).hex()); // chroma(randomColor).hex() is used to convert the color to hex

    // Check if the color palette div has locked
    if (div.classList.contains("locked")) {
      initialColors[index] = prevColor;
    }

    // Add color to div bg
    div.style.backgroundColor = initialColors[index];
    hexText.innerText = initialColors[index];

    // Check for text contrast relative to the div's background color
    checkTextContrast(initialColors[index], hexText);

    // Check Contrast for buttons
    const currAdjustBtn = adjustButtons[initialColors.length - 1];
    const currLockBtn = lockButtons[initialColors.length - 1];

    checkTextContrast(initialColors[index], currAdjustBtn);
    checkTextContrast(initialColors[index], currLockBtn);

    // Initial colorize sliders
    const color = chroma(initialColors[index]);
    const sliders = div.querySelectorAll(".sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    colorizeSliders(color, hue, brightness, saturation);
  });
}

function checkTextContrast(color, text) {
  const luminace = chroma(color).luminance();
  if (luminace > 0.5) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
}

function colorizeSliders(color, hue, brightness, saturation) {
  // Scale saturation
  const noSat = color.set("hsl.s", 0); // min saturation
  const fullSat = color.set("hsl.s", 1); // max saturation
  const scaleSaturation = chroma.scale([noSat, color, fullSat]);

  // Scale brightness
  const midBright = color.set("hsl.l", 0.5); // we are doing only mid Brightness because we know highest brightness is full light and none is dark
  const scaleBrightness = chroma.scale(["black", midBright, "white"]);

  // Update input slider colors
  saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSaturation(
    0
  )}, ${scaleSaturation(1)})`;

  brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBrightness(
    0
  )}, ${scaleBrightness(0.5)}, ${scaleBrightness(1)})`;

  hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
}

function hslControls(e) {
  const index =
    e.target.getAttribute("data-hue") ||
    e.target.getAttribute("data-bright") ||
    e.target.getAttribute("data-sat");

  let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');

  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];

  // const bgColor = colorDivs[index].querySelector("h2").innerText // --> This will cause problems because when the color becomes black or white, since we're using that color to set the saturation, and hue, the color won't change anymore. So, we need to use the initialColors array instead of the colorDivs[index].querySelector("h2").innerText
  const bgColor = initialColors[index]; // We're using initialColors array since we know the original colors will be available even after we change the color using the sliders

  let color = chroma(bgColor)
    .set("hsl.s", saturation.value)
    .set("hsl.l", brightness.value)
    .set("hsl.h", hue.value);

  // colorDivs[index].querySelector("h2").innerText = color.hex(); --> This will cause problems because when the color becomes black or white, since we're using that color to set the saturation, and hue, the color won't change anymore. So, we need to use the color variable instead of the colorDivs[index].querySelector("h2").innerText

  colorDivs[index].style.backgroundColor = color;

  // colorize sliders/inputs
  colorizeSliders(color, hue, brightness, saturation);
}

function updateTextUI(index) {
  const activeDiv = colorDivs[index];
  const color = chroma(activeDiv.style.backgroundColor);
  const textHex = activeDiv.querySelector("h2");
  const icons = activeDiv.querySelectorAll(".controls button");

  textHex.innerText = color.hex();

  // Check contrast
  checkTextContrast(color, textHex);

  for (let icon of icons) {
    checkTextContrast(color, icon);
  }
}

// Implement save to palette and LOCAL Storage stuff
const saveBtn = document.querySelector(".save");
const submitSave = document.querySelector(".submit-save");
const closeSave = document.querySelector(".close-save");
const saveContainer = document.querySelector(".save-container");
const saveInput = document.querySelector(".save-name");

// Event Listners
saveBtn.addEventListener("click", openPalette);

closeSave.addEventListener("click", closePalette);

function openPalette(event) {
  const popup = saveContainer.children[0];
  saveContainer.classList.add("active");
  popup.classList.add("active");
}

function closePalette(event) {
  const popup = saveContainer.children[0];
  saveContainer.classList.remove("active");
  popup.classList.remove("active");
}

randomColors();
