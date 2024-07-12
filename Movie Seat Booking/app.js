const container = document.querySelector(".container");
const seats = document.querySelectorAll(".row .seat:not(.occupied)");

const count = document.getElementById("count");
const total = document.getElementById("total");
const movieSelect = document.getElementById("movie");

let ticketPrice = parseInt(movieSelect.value);

// ------------------------------------------------ EVENTS ------------------------------------------------

// Seat Click
container.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("seat") &&
    !e.target.classList.contains("occupied")
  ) {
    const availableSelect = e.target;
    availableSelect.classList.toggle("selected");

    updateSelectedCount();
  }
});

// Movie Change
movieSelect.addEventListener("change", (e) => {
  ticketPrice = parseInt(movieSelect.value);

  saveMovieData(e.target.selectedIndex, e.target.value);

  updateSelectedCount();
});

// ------------------------------------------------ Functions ------------------------------------------------

function updateSelectedCount() {
  const selectedSeats = document.querySelectorAll(".row .seat.selected");

  const seatIndex = [...selectedSeats].map((seat) => [...seats].indexOf(seat));

  localStorage.setItem("selectedSeats", JSON.stringify(seatIndex));

  count.innerText = selectedSeats.length;

  if (localStorage.getItem("movieName")) {
    ticketPrice = localStorage.getItem("movieName");
    console.log(ticketPrice);

    total.innerText = count.innerText * ticketPrice;
  }
}

function getSeats() {
  if (localStorage.getItem("selectedSeats")) {
    const seatIndex = JSON.parse(localStorage.getItem("selectedSeats"));
    seatIndex.forEach((idx) => {
      seats[idx].classList.add("selected");
    });
  }
}

function saveMovieData(movieIdx, movieName) {
  localStorage.setItem("movieIdx", movieIdx);
  localStorage.setItem("movieName", movieName);
}

function getMovieData() {
  if (localStorage.getItem("movieName")) {
    const movieName = localStorage.getItem("movieName");
    movieSelect.value = movieName;
  }
}

getMovieData();
getSeats();
updateSelectedCount();
