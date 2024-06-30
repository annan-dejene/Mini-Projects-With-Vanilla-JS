class DrumKit {
  constructor() {
    this.pads = document.querySelectorAll(".pad");
    this.playBtn = document.querySelector(".play");
    // Current sounds
    this.currentKick = "/Beat-Maker/sounds/kick-classic.wav";
    this.currentSnare = "/Beat-Maker/sounds/snare-acoustic01.wav";
    this.currentHihat = "/Beat-Maker/sounds/hihat-acoustic01.wav";

    // Audio
    this.kickAudio = document.querySelector(".kick-sound");
    this.snareAudio = document.querySelector(".snare-sound");
    this.hihatAudio = document.querySelector(".hihat-sound");
    // Others
    this.index = 0;
    this.bpm = 150; // (Beats per minute) To control the speed of the sound
    this.isPlaying = null;

    // Selects
    this.selects = document.querySelectorAll("select");

    // mute btns
    this.muteBtns = document.querySelectorAll(".mute");

    // tempo slider
    this.tempoSlider = document.querySelector(".tempo-slider");
  }

  activePad() {
    this.classList.toggle("active");
  }

  repeat() {
    let step = this.index % 8;
    const activeBars = document.querySelectorAll(`.b${step}`);
    // loop over the pads
    activeBars.forEach((bar) => {
      bar.style.animation = `playTrack 0.3s alternate ease-in-out 2`; // playTrack is the animation name we created in the css file, 0.3s is the duration of the animation, alternate is the direction of the animation, ease-in-out is the timing function, 2 is the number of times the animation will play (1 time forward and 1 time backward)

      // Check if the bar is active
      if (bar.classList.contains("active")) {
        // Check which sound to play
        if (bar.classList.contains("kick-pad")) {
          this.kickAudio.currentTime = 0; // (Restarts the time of the actual audio track) To play the sound from the beginning every time it's turn comes
          this.kickAudio.play();
        } else if (bar.classList.contains("snare-pad")) {
          this.snareAudio.currentTime = 0; // To play the sound from the beginning every time it's turn comes
          this.snareAudio.play();
        } else if (bar.classList.contains("hihat-pad")) {
          this.hihatAudio.currentTime = 0; // To play the sound from the beginning every time it's turn comes
          this.hihatAudio.play();
        }
      }
    });
    this.index++;
  }

  start() {
    const interval = (60 / this.bpm) * 1000;
    // Everytime we come to the start function we want to check if it's already playing or not
    if (!this.isPlaying) {
      // If it's not playing, then start the interval
      // the setInterval function will return an id, which we can use to clear the interval
      this.isPlaying = setInterval(() => {
        this.repeat();
      }, interval);
      // Change the text of the play button
      this.playBtn.innerText = "Stop";
      this.playBtn.classList.add("active");
    } else {
      // If it's playing, then clear the interval
      clearInterval(this.isPlaying);
      this.isPlaying = null;
      // Change the text of the play button
      this.playBtn.innerText = "Play";
      this.playBtn.classList.remove("active");
    }
  }

  changeSound(event) {
    const selectionName = event.target.name;
    const selectionValue = event.target.value;
    switch (selectionName) {
      case "kick-select":
        this.kickAudio.src = selectionValue;
        break;
      case "snare-select":
        this.snareAudio.src = selectionValue;
        break;
      case "hihat-select":
        this.hihatAudio.src = selectionValue;
        break;
    }
  }

  muteSound(event) {
    const muteIndex = event.target.getAttribute("data-track"); // OR => event.target.dataset.track;
    event.target.classList.toggle("active");

    if (event.target.classList.contains("active")) {
      event.target.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
      switch (muteIndex) {
        case "0":
          this.kickAudio.volume = 0;
          break;
        case "1":
          this.snareAudio.volume = 0;
          break;
        case "2":
          this.hihatAudio.volume = 0;
          break;
      }
    } else {
      event.target.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
      switch (muteIndex) {
        case "0":
          this.kickAudio.volume = 1;
          break;
        case "1":
          this.snareAudio.volume = 1;
          break;
        case "2":
          this.hihatAudio.volume = 1;
          break;
      }
    }
  }

  changeTempo(event) {
    const tempoText = document.querySelector(".tempo-nr");
    this.bpm = event.target.value;
    tempoText.innerText = event.target.value;
  }

  updateTempo(event) {
    clearInterval(this.isPlaying);
    this.isPlaying = null;

    if (this.playBtn.classList.contains("active")) {
      this.start();
    }
  }
}

const drumKit = new DrumKit();

// Event listeners

drumKit.pads.forEach((pad) => {
  pad.addEventListener("click", drumKit.activePad);
  pad.addEventListener("animationend", function () {
    this.style.animation = "";
  });
});

drumKit.playBtn.addEventListener("click", () => {
  drumKit.start();
});

drumKit.selects.forEach((select) => {
  select.addEventListener("change", (event) => {
    drumKit.changeSound(event);
  });
});

drumKit.muteBtns.forEach((btn) => {
  btn.addEventListener("click", function (event) {
    drumKit.muteSound(event);
  });
});

drumKit.tempoSlider.addEventListener("input", function (event) {
  drumKit.changeTempo(event);
});

drumKit.tempoSlider.addEventListener("change", function (event) {
  drumKit.updateTempo(event);
});
