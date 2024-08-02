const currenceEl_one = document.getElementById("currency-one");
const amountEl_one = document.getElementById("amount-one");

const currenceEl_two = document.getElementById("currency-two");
const amountEl_two = document.getElementById("amount-two");

const rateEl = document.getElementById("rate");
const swap = document.getElementById("swap");

// --------------------------------------- Functions --------------------------------------------------------

// Fetch Exchange rates and update the DOM
function calculate() {
  const curr_one = currenceEl_one.value;
  const curr_two = currenceEl_two.value;

  const amount_one = Number(amountEl_one.value);

  let exchRate;
  fetch(
    `https://v6.exchangerate-api.com/v6/a2f414307b203e8cdf3eb2e1/latest/${curr_one}`
  )
    .then((res) => res.json())
    .then((data) => {
      exchRate = (amount_one * data.conversion_rates[curr_two]).toFixed(2);
      amountEl_two.value = exchRate;
      rateEl.innerText = `${amount_one} ${curr_one} = ${exchRate} ${curr_two}`;
    });
}

function swapCurr() {
  const temp = currenceEl_one.value;
  currenceEl_one.value = currenceEl_two.value;
  currenceEl_two.value = temp;

  calculate();
}

// --------------------------------------- Event Listner --------------------------------------------------------

currenceEl_one.addEventListener("change", calculate);
amountEl_one.addEventListener("input", calculate);
currenceEl_two.addEventListener("change", calculate);
amountEl_two.addEventListener("input", calculate);

swap.addEventListener("click", swapCurr);

// --------------------------------------- Function Calls --------------------------------------------------------
calculate();
