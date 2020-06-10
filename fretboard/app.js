const fretboard = document.querySelector(".fretboard");
const numberOfFrets = 12;
const numberOfStrings = 6;

const app = {
  init() {
    this.setupFretboard();
  },
  setupFretboard() {
    // add string to fretboard
    for (let i = 0; i < numberOfStrings; i++) {
      let string = tools.createElement("div");
      string.classList.add("string");
      fretboard.appendChild(string);
      // create frets
      for (let fret = 0; fret <= numberOfFrets; fret++) {
        let noteFret = tools.createElement("div");
        noteFret.classList.add("note-fret");
        string.appendChild(noteFret);
      }
    }
  },
};

const tools = {
  createElement(element, content) {
    element = document.createElement(element);
    if (arguments.length > 1) {
      element.innerHTML = content;
    }
    return element;
  },
};

app.init();
