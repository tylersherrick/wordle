let guessCount = 0;
const maxGuesses = 6;
let answer;
let letterStates = {}; // track keyboard key states

// Build main UI
const title = document.createElement("p");
title.textContent = "Welcome to Wordle Clone";

const gameInput = document.createElement("input");
gameInput.setAttribute("type", "text");

const submitButton = document.createElement("button");
submitButton.textContent = "Submit";

const resetButton = document.createElement("button");
resetButton.id = "reset-button";
resetButton.textContent = "Reset";

const content = document.getElementById("content");
content.appendChild(title);
content.appendChild(gameInput);
content.appendChild(submitButton);
content.appendChild(resetButton);

// Keyboard container
const keyboard = document.createElement("div");
keyboard.id = "keyboard";
content.appendChild(keyboard);

// Guesses container (wraps all guess rows)
const guessesContainer = document.createElement("div");
guessesContainer.id = "guesses-container";
content.insertBefore(guessesContainer, keyboard); // place guesses above keyboard

// Generate keyboard rows
const keyRows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
keyRows.forEach(row => {
  const rowDiv = document.createElement("div");
  rowDiv.className = "key-row";
  
  row.split("").forEach(letter => {
    const key = document.createElement("button");
    key.textContent = letter;
    key.id = `key-${letter}`;
    key.className = "key";
    rowDiv.appendChild(key);
  });

  keyboard.appendChild(rowDiv);
});

// Reset game
function resetGame() {
  guessCount = 0;
  gameInput.value = "";
  letterStates = {};

  // Remove all guess rows except the title, input, submit, reset, and keyboard
  while (guessesContainer.firstChild) {
    guessesContainer.removeChild(guessesContainer.firstChild);
  }

  answer = wordList[Math.floor(Math.random() * wordList.length)];

  // Reset key classes
  keyRows.forEach(row => {
    row.split("").forEach(letter => {
      const keyButton = document.getElementById(`key-${letter}`);
      keyButton.className = "key";
    });
  });
}

resetButton.onclick = function() {
  if(gameInput.value.trim().toLowerCase() !== answer) {
    alert("Better luck next time! The answer was: " + answer);
  }
  resetGame();
}

submitButton.onclick = function() {
  if (guessCount >= maxGuesses) {
    alert("No more guesses left!");
    return;
  }
  
  const guessArr = gameInput.value.toLowerCase().split("");
  const answerArr = answer.split("");
  const result = ["grey", "grey", "grey", "grey", "grey"];

  // Validation
  if (
    gameInput.value.trim().length !== 5 ||
    !/^[a-zA-Z]+$/.test(gameInput.value.trim())
  ) {
    alert("Please enter a 5 letter guess");
    gameInput.value = "";
    return;
  }

  // Wrong guess
  if (gameInput.value.trim().toLowerCase() !== answer) {
    // Green letters
    for (let i = 0; i < guessArr.length; i++) {
      if (guessArr[i] === answerArr[i]) {
        result[i] = "green";
        answerArr[i] = null;
      }
    }

    // Yellow letters
    for (let i = 0; i < guessArr.length; i++) {
      if (result[i] === "green") continue;
      const indexInAnswer = answerArr.indexOf(guessArr[i]);
      if (indexInAnswer !== -1) {
        result[i] = "yellow";
        answerArr[indexInAnswer] = null;
      }
    }

    // Render guess row
    const row = document.createElement("div");
    for (let i = 0; i < guessArr.length; i++) {
      const letter = document.createElement("span");
      letter.textContent = guessArr[i].toUpperCase();
      letter.className = result[i]; // use CSS classes
      row.appendChild(letter);

      // Update keyboard state
      const upper = guessArr[i].toUpperCase();
      if (letterStates[upper] !== "green") { 
        letterStates[upper] = result[i];
      }
    }
    guessesContainer.appendChild(row); // <-- FIXED: append to guessesContainer

    // Update keyboard display
    Object.keys(letterStates).forEach(letter => {
      const keyButton = document.getElementById(`key-${letter}`);
      keyButton.className = `key ${letterStates[letter]}`;
    });

    if (guessCount + 1 === maxGuesses) {
      alert(`You ran out of guesses. The correct word was: "${answer}".`);
      resetGame();
      return;
    }

    guessCount++;
    gameInput.value = "";
    return;
  }

  // Correct guess
  if (gameInput.value.trim().toLowerCase() === answer) {
    const row = document.createElement("div");
    answer.split("").forEach(l => {
      const letter = document.createElement("span");
      letter.textContent = l.toUpperCase();
      letter.className = "green";
      row.appendChild(letter);
      letterStates[l.toUpperCase()] = "green";
    });
    guessesContainer.appendChild(row); // <-- FIXED: append to guessesContainer

    Object.keys(letterStates).forEach(letter => {
      const keyButton = document.getElementById(`key-${letter}`);
      keyButton.className = `key ${letterStates[letter]}`;
    });

    guessCount++;
    alert(
      `Congrats! You guessed the correct word "${answer}" in ${guessCount} attempt${guessCount > 1 ? "s" : ""}!`
    );
  }
};

resetGame();
