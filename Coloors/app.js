// Global selections and variables
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll("input[type='range']");
const currentHexes = document.querySelectorAll(".color h2");

let initialColors;

// Functions

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
  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    const randomColor = generateHex();

    // Add color to div bg
    div.style.backgroundColor = randomColor;
    hexText.innerText = randomColor;

    // Check for text contrast relative to the div's background color
    checkTextContrast(randomColor, hexText);
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

randomColors();
