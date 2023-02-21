let deckId = null;
let remainingCards = 0;
let sum1 = 0
let sum2 = 0

 
function drawCard(people) {
  if (deckId === null || remainingCards === 0) {
    fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(response => response.json())
      .then(data => {
        deckId = data.deck_id;
        remainingCards = data.remaining;
        drawCard(people);
      })
      .catch(error => console.error(error));
  } 
  else if (remainingCards > 0) {
    fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
      .then(response => response.json())
      .then(data => {
        remainingCards = data.remaining;
        if (data.cards[0].value === 'KING'){
          if (people === 1){
            sum1 = sum1 + 4
          }
          else{
            sum2 = sum2 + 4
          }
        }
        else if (data.cards[0].value === 'JACK'){
          if (people === 1){
            sum1 = sum1 + 2
          }
          else{
            sum2 = sum2 + 2
          }
        }
        else if (data.cards[0].value === 'QUEEN'){
          if (people === 1){
            sum1 = sum1 + 3
          }
          else{
            sum2 = sum2 + 3
          }
        }
        else if (data.cards[0].value === '10'){
          if (people === 1){
            sum1 = sum1 + 10
          }
          else{
            sum2 = sum2 + 10
          }
        }
        else if ((data.cards[0].value === 'ACE')){ 
          if (people === 1){
            const btn = document.getElementById('drawCardButtonone');
            btn.style.display = 'none';
            const button1 = document.createElement('button');
            button1.textContent = '+1';
            button1.id = 'myButton1';
            document.body.appendChild(button1);
            const button1click = document.getElementById('myButton1');
            button1click.addEventListener('click', () => {sum1 = sum1 + 1, button1.remove(),button2.remove(),sumDisplayone.textContent = sum1.toString(), btn.style.display = 'block';});
            const button2 = document.createElement('button');
            button2.textContent = '+10';
            button2.id = 'myButton2';
            document.body.appendChild(button2);
            const button2click = document.getElementById('myButton2');
            button2click.addEventListener('click', () => {sum1 = sum1 + 10, button1.remove(),button2.remove(),sumDisplayone.textContent = sum1.toString(), btn.style.display = 'block'});
          }
          else{
            const btn = document.getElementById('drawCardButtontwo');
            btn.style.display = 'none';
            const button1 = document.createElement('button');
            button1.textContent = '+1';
            button1.id = 'myButton1';
            document.body.appendChild(button1);
            const button1click = document.getElementById('myButton1');
            button1click.addEventListener('click', () => {sum2 = sum2 + 1, button1.remove(),button2.remove(),sumDisplaytwo.textContent = sum2.toString(), btn.style.display = 'block';});
            const button2 = document.createElement('button');
            button2.textContent = '+10';
            button2.id = 'myButton2';
            document.body.appendChild(button2);
            const button2click = document.getElementById('myButton2');
            button2click.addEventListener('click', () => {sum2 = sum2 + 10, button1.remove(),button2.remove(),sumDisplaytwo.textContent = sum2.toString(), btn.style.display = 'block'});
          }
        }
        else{
          if (people === 1){
            sum1 = sum1 + (Number(data.cards[0].code[0]))
          }
          else {
            sum2 = sum2 + (Number(data.cards[0].code[0]))
          }
        }
        if (people === 1){
          const cardList1 = document.getElementById('cardListone');
          const li1 = document.createElement('li');
          const img1 = document.createElement('img');
          img1.src = data.cards[0].image;
          li1.appendChild(img1);
          cardList1.appendChild(li1);
          const sumDisplay = document.getElementById('sumDisplayone');
          sumDisplay.textContent = sum1.toString();
        }
        else{
          const cardList2 = document.getElementById('cardListtwo');
          const li2 = document.createElement('li');
          const img2 = document.createElement('img');
          img2.src = data.cards[0].image;
          li2.appendChild(img2);
          cardList2.appendChild(li2);
          const sumDisplay = document.getElementById('sumDisplaytwo');
          sumDisplay.textContent = sum2.toString();
        }
      })
      .catch(error => console.error(error));
  } 
  else {
    console.log('В колоде больше нет карт, создаем новую колоду');
    deckId = null;
  }
}

function gameover(){
  sum1 = Number(document.getElementById("sumDisplayone").textContent)
  sum2 = Number(document.getElementById("sumDisplaytwo").textContent)
  if (sum1 > 21 && sum2 > 21){
    alert("Проиграли оба")
  }
  else if (sum1 > 21 && sum2 <= 21){
    alert("Проиграл первый")
  }
  else if (sum2 > 21 && sum1 <= 21){
    alert("Проиграл второй")
  }
  else {
      if (sum1 > sum2) {
        alert('Игрок 1 выиграл!');
      } else if (sum2 > sum1) {
        alert('Игрок 2 выиграл!');
      } else {
        alert('Ничья!');
      }
  }
  setTimeout(function() {
    location.reload();
  }, 500);
}

const btn = document.getElementById('gameover');
btn.addEventListener('click', () => {
  gameover()});

const drawCardButton1 = document.getElementById('drawCardButtonone');
drawCardButton1.addEventListener('click', () => {
  drawCard(1)});

const drawCardButton2 = document.getElementById('drawCardButtontwo');
drawCardButton2.addEventListener('click', () => {
  drawCard(2)});
