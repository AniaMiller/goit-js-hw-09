const startButton = document.querySelector('[data-start]');
const stopButton = document.querySelector('[data-stop]');

let timer = null;

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
}

startButton.addEventListener('click', setRandomColor);
stopButton.addEventListener('click', freezCurrentColor);

function setRandomColor() {
  timer = setInterval(() => {
    document.body.style.background = getRandomHexColor();
  }, 2000);
  startButton.disabled = true;
  stopButton.disabled = false;
}

function freezCurrentColor() {
  startButton.disabled = false;
  stopButton.disabled = true;
  clearInterval(timer);
}
