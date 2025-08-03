let guessCount = 0;
const maxGuesses = 6;
let answer;

const title = document.createElement("p");
const titleText = document.createTextNode("Welcome to Wordle Clone");
title.appendChild(titleText);
const gameInput = document.createElement("input");
gameInput.setAttribute("type", "text");
const submitButton = document.createElement("button");
const submitButtonText = document.createTextNode("Submit");
submitButton.appendChild(submitButtonText);
const resetButton = document.createElement("button");
resetButton.id = "reset-button";
const resetButtonText = document.createTextNode("Reset");
resetButton.appendChild(resetButtonText);


const content = document.getElementById("content");
content.appendChild(title);
content.appendChild(gameInput);
content.appendChild(submitButton);
content.appendChild(resetButton);




function resetGame() {
  guessCount = 0;
  gameInput.value = "";
  // Remove all guess rows except the title, input, and button
  while (content.children.length > 4) {
    content.removeChild(content.lastChild);
  }
  answer = wordList[Math.floor(Math.random() * wordList.length)];
} 

resetButton.onclick = function() {
  if(gameInput.value.trim().toLowerCase() !== answer) {
    alert("Better luck next time! The answer was: " + answer);
  }
  else {

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

  // Guess is not within the rules
  if (
    gameInput.value.trim().length > 5 ||
    gameInput.value.trim().length < 5 ||
    gameInput.value.trim() === "" ||
    !/^[a-zA-Z]+$/.test(gameInput.value.trim())
  ) {
    alert("Please enter a 5 letter guess");
    gameInput.value = "";
    return;
  }

  // Guess is within the rules but is not correct
  if (
    gameInput.value.trim().toLowerCase() !== answer &&
    gameInput.value.trim().length === 5
  ) {
    // Mark green letters
    for (let i = 0; i < guessArr.length; i++) {
      if (guessArr[i] === answerArr[i]) {
        result[i] = "green";
        answerArr[i] = null;
      }
    }

    // Mark yellow letters
    for (let i = 0; i < guessArr.length; i++) {
      if (result[i] === "green") continue;
      const indexInAnswer = answerArr.indexOf(guessArr[i]);
      if (indexInAnswer != -1) {
        result[i] = "yellow";
        answerArr[indexInAnswer] = null;
      }
    }

    // Render guess row
    const row = document.createElement("div");
    for (let i = 0; i < guessArr.length; i++) {
      const letter = document.createElement("span");
      letter.textContent = guessArr[i].toUpperCase();
      letter.style.marginRight = "10px";

      if (result[i] === "green") {
        letter.style.color = "green";
        letter.style.fontWeight = "bold";
      } else if (result[i] === "yellow") {
        letter.style.color = "orange";
        letter.style.fontWeight = "bold";
      } else {
        letter.style.color = "gray";
      }

      row.appendChild(letter);
    }

    content.appendChild(row);

    if (guessCount + 1 === maxGuesses) {
      alert(`You ran out of guesses. The correct word was: "${answer}".`);
      resetGame();
      return;
    }

    guessCount++;
    gameInput.value = "";
    return;
  }

  // Guess matches the answer and user wins
  if (gameInput.value.trim().toLowerCase() === answer) {
    const guessArr = answer.split("");
    const result = ["green", "green", "green", "green", "green"];

    const row = document.createElement("div");
    for (let i = 0; i < guessArr.length; i++) {
      const letter = document.createElement("span");
      letter.textContent = guessArr[i].toUpperCase();
      letter.style.marginRight = "8px";
      letter.style.color = "green";
      letter.style.fontWeight = "bold";
      row.appendChild(letter);
    }
    content.appendChild(row);

    guessCount++;
    alert(
      `Congrats! You guessed the correct word "${answer}" in ${guessCount} attempt${
        guessCount > 1 ? "s" : ""
      }!`
    );
  }
};

resetGame();
