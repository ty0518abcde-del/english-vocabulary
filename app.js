let words = [];
let current = 0;

let learnedWords =
  JSON.parse(localStorage.getItem("learnedWords")) || [];

let favorites =
  JSON.parse(localStorage.getItem("favorites")) || [];

let weakWords =
  JSON.parse(localStorage.getItem("weakWords")) || [];


function $(id){
  return document.getElementById(id);
}


async function loadWords(){

  try {

    const response = await fetch("words.json");

    if(!response.ok){
      throw new Error("words.jsonが読み込めません");
    }

    words = await response.json();

    current = 0;

    showWord();

    updateProgress();


  } catch(e){

    console.error(e);

    const word =
      $("word");

    if(word){
      word.textContent =
      "データ読み込みエラー";
    }

  }

}



function showWord(){

  if(words.length === 0){
    return;
  }


  const w = words[current];


  if($("word"))
    $("word").textContent = w.word;


  if($("meaning"))
    $("meaning").textContent = w.meaning;


  if($("example"))
    $("example").textContent =
    "Example: " + w.example;


  if($("translation"))
    $("translation").textContent =
    "和訳: " + w.translation;


  if($("answer"))
    $("answer").style.display="none";


  updateLearnedButton();

}





if($("flipButton")){

$("flipButton").onclick = function(){

  if($("answer").style.display==="none"){

    $("answer").style.display="block";

    this.textContent="隠す";

  }else{

    $("answer").style.display="none";

    this.textContent=
    "タップして意味を見る";

  }

};

}




if($("nextButton")){

$("nextButton").onclick=function(){

 current++;

 if(current >= words.length){
   current=0;
 }

 showWord();

};

}





function speak(text){

 const speech =
 new SpeechSynthesisUtterance(text);

 speech.lang="en-US";
 speech.rate=0.8;

 speechSynthesis.speak(speech);

}



if($("speakButton")){

$("speakButton").onclick=function(){

 if(words[current]){

   speak(words[current].example);

 }

};

}





if($("learnedButton")){

$("learnedButton").onclick=function(){

 const word =
 words[current].word;


 if(!learnedWords.includes(word)){

   learnedWords.push(word);

 }


 localStorage.setItem(
 "learnedWords",
 JSON.stringify(learnedWords)
 );


 updateProgress();

 updateLearnedButton();

};

}





function updateLearnedButton(){

 const button =
 $("learnedButton");


 if(!button || !words[current])
 return;


 if(learnedWords.includes(words[current].word)){

   button.textContent="✅ 習得済み";

 }else{

   button.textContent="✅ 覚えた";

 }

}





if($("favoriteButton")){

$("favoriteButton").onclick=function(){

 const word =
 words[current].word;


 if(!favorites.includes(word)){

   favorites.push(word);

 }


 localStorage.setItem(
 "favorites",
 JSON.stringify(favorites)
 );

};

}





if($("weakButton")){

$("weakButton").onclick=function(){

 const word =
 words[current].word;


 if(!weakWords.includes(word)){

   weakWords.push(word);

 }


 localStorage.setItem(
 "weakWords",
 JSON.stringify(weakWords)
 );

};

}





if($("showUnlearned")){

$("showUnlearned").onclick=function(){

 words =
 words.filter(
 w=>!learnedWords.includes(w.word)
 );


 current=0;

 showWord();

};

}





if($("showAll")){

$("showAll").onclick=function(){

 loadWords();

};

}





function updateProgress(){

 if(!$("progressBar") ||
    !$("progressText"))
    return;


 const percent =
 words.length ?
 learnedWords.length / words.length * 100
 :0;


 $("progressBar").style.width =
 percent+"%";


 $("progressText").textContent =
 `${learnedWords.length}/${words.length}語習得 (${Math.round(percent)}%)`;

}





function startWeakListening(){

 const list =
 words.filter(
 w=>weakWords.includes(w.word)
 );


 if(list.length===0){

  alert("苦手単語がありません");

  return;

 }


 let i=0;


 function play(){

   if(i>=list.length)
     return;


   speak(list[i].example);

   i++;

   setTimeout(play,5000);

 }


 play();

}



loadWords();
