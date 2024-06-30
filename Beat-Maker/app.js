class DrumKit {
  constructor() {
    this.pads = document.querySelectorAll(".pad");
    this.playBtn = document.querySelector(".play");
    this.kickAudio = document.querySelector(".kick-sound");
    this.snareAudio = document.querySelector(".snare-sound");
    this.hihatAudio = document.querySelector(".hihat-sound");
    this.index = 0;
    this.bpm = 250; // (Beats per minute) To control the speed of the sound
    this.isPlaying = null;
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
    } else {
      // If it's playing, then clear the interval
      clearInterval(this.isPlaying);
      this.isPlaying = null;
      // Change the text of the play button
      this.playBtn.innerText = "Play";
    }
  }
}

const drumKit = new DrumKit();

drumKit.pads.forEach((pad) => {
  pad.addEventListener("click", drumKit.activePad);
  pad.addEventListener("animationend", function () {
    this.style.animation = "";
  });
});

drumKit.playBtn.addEventListener("click", () => {
  drumKit.start();
});
