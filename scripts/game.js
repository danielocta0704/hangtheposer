const hangmanAudio = document.querySelector(".hangman-audio");
const hangmanImage = document.querySelector(".hangman-box img");
const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const gameModal = document.querySelector(".game-modal");
const bgmAudio = document.querySelector(".bgm-audio");
const winAudio = document.querySelector(".win-audio");
const loseAudio = document.querySelector(".lose-audio");

let currentWord, correctLetters = [], wrongGuessCount = 0;
const maxGuesses = 6;

const getCategoryFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    console.log("Category from URL:", category);
    return category ? category.toLowerCase() : ""; 
};

const getRandomWord = () => {
    const selectedCategory = getCategoryFromURL();
    const wordsInCategory = wordlist[selectedCategory];

    if (!wordsInCategory || wordsInCategory.length === 0) {
        console.error("No words in the selected category:", selectedCategory);
        return;
    }

    const { word, hint } = wordsInCategory[Math.floor(Math.random() * wordsInCategory.length)];
    currentWord = word;

    console.log("Selected category:", selectedCategory);
    console.log("Selected word:", word);
    document.querySelector(".hint-text b").innerText = hint;
    
    wordDisplay.innerHTML = currentWord.split("").map(char => {
        if (char === " ") {
            return `<li class="letter guessed"> </li>`;
        } else {
            return `<li class="letter"></li>`;
        }
    }).join("");
};

const gameOver = (isVictory) => {
    console.log("Game Over Triggered:", isVictory);
    setTimeout(() => {
        const modalText = isVictory ? "You've guessed right, the word is:" : "WOMP WOMP, You guessed wrong, the right word is:";
        gameModal.querySelector("img").src = `/assets/${isVictory ? 'victory' : 'lost'}.gif`;
        gameModal.querySelector("h4").innerText = `${isVictory ? 'You are one cool person!!' : 'GAME OVER POSER!'}`;
        gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;

        const buttons = keyboardDiv.querySelectorAll("button");
        buttons.forEach(button => button.disabled = true);

        bgmAudio.pause();

        if (isVictory) {
            winAudio.play();
        } else {
            loseAudio.play();
        }

        gameModal.classList.add("show");
    }, 300);
};

const initGame = (button, clickedLetter) => {
    const normalizedLetter = clickedLetter.toLowerCase();

    if (wrongGuessCount >= maxGuesses || correctLetters.length === currentWord.length) {
        console.log("The game is over, no more guesses allowed!");
        return;
    }

    console.log(`Clicked Letter: ${normalizedLetter}`);
    if (currentWord.toLowerCase().includes(normalizedLetter)) {
        console.log("Correct letter!");
        [...currentWord].forEach((letter, index) => {
            if (letter.toLowerCase() === normalizedLetter) {
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        });
    } else {
        console.log("Wrong guess!");
        wrongGuessCount++;
        hangmanImage.src = `/assets/hangman-${wrongGuessCount}.svg`;
        hangmanAudio.play();
    }
    
    button.disabled = true;
    guessesText.innerText = `${wrongGuessCount}/${maxGuesses}`;

    if (wrongGuessCount === maxGuesses) {
        console.log("Game Over: Lost!");
        return gameOver(false);
    }
    if (correctLetters.length === currentWord.replace(/ /g, "").length) {
        console.log("Game Over: Won!");
        return gameOver(true);
    }
};

const qwertyLayout = [
    'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
    'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
    'z', 'x', 'c', 'v', 'b', 'n', 'm'
];

qwertyLayout.forEach(letter => {
    const button = document.createElement("button");
    button.innerText = letter.toUpperCase();
    keyboardDiv.appendChild(button);
    button.addEventListener("click", e => initGame(e.target, letter));
});

getRandomWord();
