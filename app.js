let words = [];
let current = 0;

let learnedWords =
  JSON.parse(localStorage.getItem("learnedWords")) || [];

let favorites =
  JSON.parse(localStorage.getItem("favorites")) || [];

let weakWords =
  JSON.parse(localStorage.getItem("weakWords")) || [];


const wordEl = document.getElementById("word");
const meaningEl = document.getElementById("meaning");
const exampleEl = document.getElementById("example");
const translationEl = document.getElementById("translation");
const answerEl = document.getElementById("answer");

const flipButton = document.getElementById("flipButton");
const nextButton = document.getElementById("nextButton");


async function loadWords(){

  const response = await fetch("words.json");

  words = await response.json();

  showWord();

  updateProgress();

}



function showWord(){

  if(words.length === 0) return;


  const w = words[current];


  wordEl.textContent = w.word;

  meaningEl.textContent = w.meaning;

  exampleEl.textContent =
    "Example: " + w.example;

  translationEl.textContent =
    "和訳: " + w.translation;


  answerEl.style.display = "none";

  flipButton.textContent =
    "タップして意味を見る";


  updateLearnedButton();

}



flipButton.addEventListener(
"click",
()=>{

 if(answerEl.style.display==="none"){

   answerEl.style.display="block";

   flipButton.textContent="隠す";

 }else{

   answerEl.style.display="none";

   flipButton.textContent=
   "タップして意味を見る";

 }

});
function speak(text){

  const speech =
    new SpeechSynthesisUtterance(text);

  speech.lang = "en-US";
  speech.rate = 0.8;

  window.speechSynthesis.speak(speech);

}



document
.getElementById("speakButton")
.addEventListener(
"click",
()=>{

  const sentence =
    words[current].example;

  speak(sentence);

});



document
.getElementById("learnedButton")
.addEventListener(
"click",
()=>{

 const word =
 words[current].word;


 if(!learnedWords.includes(word)){

   learnedWords.push(word);

   localStorage.setItem(
     "learnedWords",
     JSON.stringify(learnedWords)
   );

 }


 updateProgress();

 updateLearnedButton();


});



function updateLearnedButton(){

 const button =
 document.getElementById("learnedButton");


 if(learnedWords.includes(words[current].word)){

   button.textContent =
   "✅ 習得済み";

 }else{

   button.textContent =
   "✅ 覚えた";

 }

}




document
.getElementById("favoriteButton")
.addEventListener(
"click",
()=>{

 const word =
 words[current].word;


 if(!favorites.includes(word)){

   favorites.push(word);

   localStorage.setItem(
     "favorites",
     JSON.stringify(favorites)
   );

 }

});





document
.getElementById("weakButton")
.addEventListener(
"click",
addWeakWord);



function addWeakWord(){

 const word =
 words[current].word;


 if(!weakWords.includes(word)){

   weakWords.push(word);

   localStorage.setItem(
    "weakWords",
    JSON.stringify(weakWords)
   );

 }

}





function startWeakListening(){

 const weakList =
 words.filter(
 w=>weakWords.includes(w.word)
 );


 if(weakList.length===0){

   alert("苦手単語がありません");

   return;

 }


 let index = 0;


 function playNext(){

   if(index >= weakList.length){

     return;

   }


   speak(
    weakList[index].example
   );


   index++;


   setTimeout(
    playNext,
    5000
   );

 }


 playNext();

}




function updateProgress(){

 const percent =
 words.length === 0
 ? 0
 : learnedWords.length /
   words.length * 100;



 document
 .getElementById("progressBar")
 .style.width =
 percent + "%";



 document
 .getElementById("progressText")
 .textContent =
 `${learnedWords.length} / ${words.length}語習得 (${Math.round(percent)}%)`;

}





document
.getElementById("showUnlearned")
.addEventListener(
"click",
()=>{

 words =
 words.filter(
 w=>!learnedWords.includes(w.word)
 );


 current = 0;

 showWord();

});





document
.getElementById("showAll")
.addEventListener(
"click",
loadWords);





loadWords();


nextButton.addEventListener(
"click",
()=>{

 current =
 (current + 1) % words.length;

 showWord();

});
