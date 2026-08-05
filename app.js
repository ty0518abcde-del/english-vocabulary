let words = [];
let current = 0;

const wordEl = document.getElementById("word");
const meaningEl = document.getElementById("meaning");
const exampleEl = document.getElementById("example");
const translationEl = document.getElementById("translation");

const answerEl = document.getElementById("answer");
const flipButton = document.getElementById("flipButton");
const nextButton = document.getElementById("nextButton");
const searchInput = document.getElementById("search");

async function loadWords() {
  const response = await fetch("words.json");
  words = await response.json();
  showWord();
}

function showWord() {
  if (words.length === 0) return;

  const w = words[current];

  wordEl.textContent = w.word;
  meaningEl.textContent = w.meaning;
  exampleEl.textContent = "Example: " + w.example;
  translationEl.textContent = "和訳: " + w.translation;

  answerEl.style.display = "none";
  flipButton.textContent = "タップして意味を見る";
}

flipButton.addEventListener("click", () => {
  if (answerEl.style.display === "none") {
    answerEl.style.display = "block";
    flipButton.textContent = "隠す";
  } else {
    answerEl.style.display = "none";
    flipButton.textContent = "タップして意味を見る";
  }
});

nextButton.addEventListener("click", () => {
  current = (current + 1) % words.length;
  showWord();
});

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();

  const index = words.findIndex(w =>
    w.word.toLowerCase().includes(keyword)
  );

  if (index >= 0) {
    current = index;
    showWord();
  }
});
const speakButton = document.getElementById("speakButton");

speakButton.addEventListener("click", () => {
  const text = wordEl.textContent;

  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";
  speech.rate = 0.8;

  window.speechSynthesis.speak(speech);
});

const favoriteButton = document.getElementById("favoriteButton");
const weakButton = document.getElementById("weakButton");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let weakWords = JSON.parse(localStorage.getItem("weakWords")) || [];

favoriteButton.addEventListener("click", () => {
  const word = wordEl.textContent;

  if (!favorites.includes(word)) {
    favorites.push(word);
    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites)
    );
    alert("⭐ お気に入りに追加しました");
  }
});


weakButton.addEventListener("click", () => {
  const word = wordEl.textContent;

  if (!weakWords.includes(word)) {
    weakWords.push(word);
    localStorage.setItem(
      "weakWords",
      JSON.stringify(weakWords)
    );
    alert("❌ 苦手単語に追加しました");
  }
});
loadWords();
let learnedWords =
JSON.parse(
localStorage.getItem("learnedWords")
) || [];
