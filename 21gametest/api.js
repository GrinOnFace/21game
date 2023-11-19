let deckId = null;
let remainingCards = 0;
let sum1 = 0;
let sum2 = 0;

function shuffleDeck() {
  return fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then(response => response.json())
    .then(data => {
      deckId = data.deck_id;
      remainingCards = data.remaining;
    })
    .catch(error => console.error(error));
}

function drawCardValue(value, person) {
  if (value === 'KING') {
    person === 1 ? (sum1 += 4) : (sum2 += 4);
  } else if (value === 'JACK') {
    person === 1 ? (sum1 += 2) : (sum2 += 2);
  } else if (value === 'QUEEN') {
    person === 1 ? (sum1 += 3) : (sum2 += 3);
  } else if (value === '10') {
    person === 1 ? (sum1 += 10) : (sum2 += 10);
  } else if (value === 'ACE') {
    handleAce(person);
  } else {
    person === 1 ? (sum1 += Number(value[0])) : (sum2 += Number(value[0]));
  }
}

function handleAce(person) {
  const btn = person === 1 ? document.getElementById('drawCardButtonone') : document.getElementById('drawCardButtontwo');
  btn.style.display = 'none';

  const button1 = createButton('+1', () => handleAceButtonClick(1, person));
  const button2 = createButton('+10', () => handleAceButtonClick(10, person));

  document.body.appendChild(button1);
  document.body.appendChild(button2);
}

function createButton(text, clickHandler) {
  const button = document.createElement('button');
  button.textContent = text;
  button.addEventListener('click', clickHandler);
  return button;
}

function handleAceButtonClick(points, person) {
  person === 1 ? (sum1 += points) : (sum2 += points);
  removeButtons();
  updateSumDisplay(person);
}

function removeButtons() {
  const button1 = document.getElementById('myButton1');
  const button2 = document.getElementById('myButton2');

  if (button1) button1.remove();
  if (button2) button2.remove();
}

function updateSumDisplay(person) {
  const sumDisplay = person === 1 ? document.getElementById('sumDisplayone') : document.getElementById('sumDisplaytwo');
  sumDisplay.textContent = (person === 1 ? sum1 : sum2).toString();
}

function drawCard(person) {
  if (deckId === null || remainingCards === 0) {
    shuffleDeck().then(() => drawCard(person));
  } else if (remainingCards > 0) {
    fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        remainingCards = data.remaining;
        drawCardValue(data.cards[0].value, person);
        updateCardListAndSumDisplay(data, person);
      })
      .catch(error => console.error(error));
  } else {
    console.log('В колоде больше нет карт, создаем новую колоду');
    deckId = null;
  }
}

function updateCardListAndSumDisplay(data, person) {
  const cardList = person === 1 ? document.getElementById('cardListone') : document.getElementById('cardListtwo');
  const li = document.createElement('li');
  const img = document.createElement('img');
  img.src = data.cards[0].image;
  li.appendChild(img);
  cardList.appendChild(li);
  updateSumDisplay(person);
}

function gameover() {
  sum1 = Number(document.getElementById('sumDisplayone').textContent);
  sum2 = Number(document.getElementById('sumDisplaytwo').textContent);

  let resultMessage = '';

  if (sum1 > 21 && sum2 > 21) {
    resultMessage = 'Оба лузеры(';
  } else if (sum1 > 21 && sum2 <= 21) {
    resultMessage = 'Игрок 2 выиграл!';
  } else if (sum2 > 21 && sum1 <= 21) {
    resultMessage = 'Игрок 1 выиграл!';
  } else {
    resultMessage = sum1 > sum2 ? 'Игрок 1 выиграл!' : sum2 > sum1 ? 'Игрок 2 выиграл!' : 'Ничья!';
  }

  alert(resultMessage);

  setTimeout(() => {
    location.reload();
  }, 500);
}

const btnGameover = document.getElementById('gameover');
btnGameover.addEventListener('click', gameover);

const drawCardButton1 = document.getElementById('drawCardButtonone');
drawCardButton1.addEventListener('click', () => drawCard(1));

const drawCardButton2 = document.getElementById('drawCardButtontwo');
drawCardButton2.addEventListener('click', () => drawCard(2));
