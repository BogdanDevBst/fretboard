//Everything is wraped up in a IIFE (Immediately Invoked Function Expression) function so users don't have acces to the variables.

(function () {
  const root = document.documentElement;
  const fretboard = document.querySelector(".fretboard");
  const instrumentSelector = document.querySelector("#instrument-selector");
  const accidentalSelector = document.querySelector(".accidental-selector");
  const numberOfFretsSelector = document.querySelector("#number-of-frets");
  const showAllNotesSelector = document.querySelector("#show-all-notes");
  const showMultipleNotesSelector = document.querySelector("#show-multiple-notes");
  const noteNameSection = document.querySelector(".note-name-section");
  const singleFretMarkPositions = [3, 5, 7, 9, 15, 17, 19, 21];
  const doubleFretMarkPositions = [12, 24];
  const notesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  const notesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

  const instrumentTuningPresets = {
    Guitar: [4, 11, 7, 2, 9, 4],
    "Bass (4 strings)": [7, 2, 9, 4],
    "Bass (5 strings)": [7, 2, 9, 4, 11],
    Ukulele: [9, 4, 0, 7],
  };

  let accidentals = "flats";
  let allNotes;
  let showMultipleNotes = false;
  let showAllNotes = false;
  let numberOfFrets = 20;
  let selectedInstrument = "Guitar";
  let numberOfStrings = instrumentTuningPresets[selectedInstrument].length;

  // My app
  const app = {
    init() {
      this.setupFretboard();
      this.setupInstrumentSelector();
      this.setupNoteNameSection();
      handlers.setupEventListeners();
    },

    setupFretboard() {
      fretboard.innerHTML = "";
      root.style.setProperty("--number-of-strings", numberOfStrings);
      // add strings to fretboard
      for (let i = 0; i < numberOfStrings; i++) {
        let string = tools.createElement("div");
        string.classList.add("string");
        fretboard.appendChild(string);

        // create frets
        for (let fret = 0; fret <= numberOfFrets; fret++) {
          let noteFret = tools.createElement("div");
          noteFret.classList.add("note-fret");
          string.appendChild(noteFret);

          let noteName = this.generateNoteNames(fret + instrumentTuningPresets[selectedInstrument][i], accidentals);

          noteFret.setAttribute("data-note", noteName);

          // Iterates thru the singleFretMarkPosition variable and is adding SINGLE fret mark
          if (i === 0 && singleFretMarkPositions.indexOf(fret) !== -1) {
            noteFret.classList.add("single-fretmark");
          }
          // Iterates thru the doubleFretMarkPosition variable and is adding DOUBLE fret mark
          if (i === 0 && doubleFretMarkPositions.indexOf(fret) !== -1) {
            let doubleFretMark = tools.createElement("div");
            doubleFretMark.classList.add("double-fretmark");
            noteFret.appendChild(doubleFretMark);
          }
        }
      }
      allNotes = document.querySelectorAll(".note-fret");
    },

    // note name generator
    generateNoteNames(noteIndex, accidentals) {
      noteIndex = noteIndex % 12;
      let noteName;
      if (accidentals === "flats") {
        noteName = notesFlat[noteIndex];
      } else if (accidentals === "sharps") {
        noteName = notesSharp[noteIndex];
      }
      return noteName;
    },

    setupInstrumentSelector() {
      for (instrument in instrumentTuningPresets) {
        let instrumentOption = tools.createElement("option", instrument);
        instrumentSelector.appendChild(instrumentOption);
      }
    },

    setupNoteNameSection() {
      noteNameSection.innerHTML = "";
      let noteNames;
      if (accidentals === "flats") {
        noteNames = notesFlat;
      } else {
        noteNames = notesSharp;
      }
      noteNames.forEach((noteName) => {
        let noteNameElement = tools.createElement("span", noteName);
        noteNameSection.appendChild(noteNameElement);
      });
    },

    toggleMultipleNotes(noteName, oppacity) {
      for (let i = 0; i < allNotes.length; i++) {
        if (allNotes[i].dataset.note === noteName) {
          allNotes[i].style.setProperty("--note-dot-opacity", oppacity);
        }
      }
    },
  };

  // Here I have all the methods and eventListeners
  const handlers = {
    showNoteDot(event) {
      // Check if show all notes is selected
      if (showAllNotes) {
        return;
      }
      if (event.target.classList.contains("note-fret")) {
        if (showMultipleNotes) {
          app.toggleMultipleNotes(event.target.dataset.note, 1);
        } else {
          event.target.style.setProperty("--note-dot-opacity", 1);
        }
      }
    },

    hideNoteDot(event) {
      // Check if show all notes is unselected
      if (showAllNotes) {
        return;
      }
      if (showMultipleNotes) {
        app.toggleMultipleNotes(event.target.dataset.note, 0);
      } else {
        event.target.style.setProperty("--note-dot-opacity", 0);
      }
    },

    setSelectedInstrument(event) {
      selectedInstrument = event.target.value;
      numberOfStrings = instrumentTuningPresets[selectedInstrument].length;
      app.setupFretboard();
    },

    setAccidentals(event) {
      if (event.target.classList.contains("acc-select")) {
        accidentals = event.target.value;
        app.setupFretboard();
        app.setupNoteNameSection();
      } else {
        return;
      }
    },

    setNumberOfFrets() {
      numberOfFrets = numberOfFretsSelector.value;
      app.setupFretboard();
    },

    setShowAllNotes() {
      showAllNotes = showAllNotesSelector.checked;
      if (showAllNotes) {
        root.style.setProperty("--note-dot-opacity", 1);
        app.setupFretboard();
      } else {
        root.style.setProperty("--note-dot-opacity", 0);
        app.setupFretboard();
      }
    },

    setShowMultipleNotes() {
      showMultipleNotes = !showMultipleNotes;
    },

    setNotesToShow(event) {
      let noteToShow = event.target.innerText;
      app.toggleMultipleNotes(noteToShow, 1);
    },

    setNotesToHide() {
      if (!showAllNotes) {
        let notesToHide = event.target.innerText;
        app.toggleMultipleNotes(notesToHide, 0);
      } else {
        return;
      }
    },

    setupEventListeners() {
      fretboard.addEventListener("mouseover", this.showNoteDot);
      fretboard.addEventListener("mouseout", this.hideNoteDot);
      instrumentSelector.addEventListener("change", this.setSelectedInstrument);
      accidentalSelector.addEventListener("click", this.setAccidentals);
      numberOfFretsSelector.addEventListener("change", this.setNumberOfFrets);
      showAllNotesSelector.addEventListener("change", this.setShowAllNotes);
      showMultipleNotesSelector.addEventListener("change", this.setShowMultipleNotes);
      noteNameSection.addEventListener("mouseover", this.setNotesToShow);
      noteNameSection.addEventListener("mouseout", this.setNotesToHide);
    },
  };

  // populates HTML
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
})();
