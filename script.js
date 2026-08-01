let weakWords = JSON.parse(
  localStorage.getItem("weakWords")
) || [];


// 苦手登録
function addWeakWord(){

  const word = words[currentIndex].word;

  if(!weakWords.includes(word)){
    weakWords.push(word);
    localStorage.setItem(
      "weakWords",
      JSON.stringify(weakWords)
    );

    alert(word + " を苦手登録しました");
  }
}


// 苦手単語リスニング開始
let weakIndex = 0;
let weakMode = false;


function startWeakListening(){

  if(weakWords.length === 0){
    alert("苦手単語が登録されていません");
    return;
  }

  weakMode = true;
  weakIndex = 0;

  playWeakWord();
}



// 苦手単語再生

function playWeakWord(){

  if(!weakMode) return;


  const wordData = words.find(
    w => w.word === weakWords[weakIndex]
  );


  document.getElementById("word").innerText =
    wordData.word;

  document.getElementById("example").innerText =
    wordData.example;


  const speech =
    new SpeechSynthesisUtterance(
      wordData.example
    );


  speech.lang="en-US";
  speech.rate=0.75;


  window.speechSynthesis.speak(speech);



  setTimeout(()=>{

    weakIndex++;

    if(weakIndex >= weakWords.length){
      weakIndex=0;
    }

    playWeakWord();

  },6000);

}
