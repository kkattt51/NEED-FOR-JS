const MAX_ENEMY = 7;
const HEIGHT_ELEM = 100;

const score = document.querySelector('.score'),
  start = document.querySelector('.start'),
  gameArea = document.querySelector('.gameArea'),
  car = document.createElement('div'),
  btns = document.querySelectorAll('.btn');

const music = new Audio('audio.mp3');
//console.dir(music);
//music.volume = 0.05;

//const music = document.createElement('embed');
//music.src = 'audio.mp3';
//music.classList.add('visually-hidden');

car.classList.add('car');

const keys ={
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
};

const setting = {
  start: false,
  score: 0,
  speed: 5,
  traffic: 3,
};

let startSpeed = 0;

const changeLevel = (lvl) => {
  //console.log(typeof lvl);

  switch(lvl) {
    case '1':
      setting.traffic = 4;
      setting.speed = 3;
      break;
    case '2':
      setting.traffic = 3;
      setting.speed = 6;
      break;
    case '3':
      setting.traffic = 3;
      setting.speed = 8;
      break;
  }
  startSpeed = setting.speed;
};

function getQuantityElements(heightElement) {
  //return document.documentElement.clientHeight / heightElement;
  return (gameArea.offsetHeight / heightElement) + 1;
}

const getRandomEnemy = (max) => Math.floor((Math.random() * max) + 1);


function startGame (event) {
  const target = event.target;

  if (!target.classList.contains('btn')) return;

  const levelGame = target.dataset.levelGame;

  changeLevel(levelGame);

  btns.forEach(btn => btn.disabled = true);

  music.play();
  //document.body.append(music);

  //gameArea.style.minHeight = 100 + 'vh';
  gameArea.style.minHeight = Math.floor(
    (document.documentElement.clientHeight - HEIGHT_ELEM) / HEIGHT_ELEM) * HEIGHT_ELEM;

  start.classList.add('hide');
  gameArea.innerHTML = '';
  
  for (let i = 0; i < getQuantityElements(HEIGHT_ELEM); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = (i * HEIGHT_ELEM) + 'px';
    line.style.height = (HEIGHT_ELEM / 2) + 'px';
    line.y = i * HEIGHT_ELEM;
    //gameArea.appendChild(line);
    gameArea.append(line);
  }

  for (let i = 0; i < getQuantityElements(HEIGHT_ELEM * setting.traffic); i++) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.y = -HEIGHT_ELEM * setting.traffic * (i + 1);
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    enemy.style.top = enemy.y + 'px';
    enemy.style.background = `
      transparent 
      url(./image/enemy${getRandomEnemy(MAX_ENEMY)}.png) 
      center / contain
      no-repeat`;
    //gameArea.appendChild(enemy);
    gameArea.append(enemy);

  }

  setting.score = 0;
  setting.start = true;
  gameArea.appendChild(car);
  car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
  //car.style.left = '125px';
  car.style.top = 'auto';
  car.style.bottom = '10px';
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
}


function playGame() {

  if (setting.start){
    setting.score += setting.speed;
    score.innerHTML = 'SCORE: ' + setting.score;

    setting.speed = startSpeed + Math.floor(setting.score / 5000);

    moveRoad();
    moveEnemy();
    if (keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.speed;
    }

    if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
      setting.x += setting.speed;
    }

    if (keys.ArrowUp && setting.y > 0) {
      setting.y -= setting.speed;
    }

    if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
      setting.y += setting.speed;
    }

    car.style.left = setting.x + 'px';
    car.style.top = setting.y + 'px';

    requestAnimationFrame(playGame);
  } else{
    music.pause();
    btns.forEach(btn => btn.disabled = false);
  }
    /*requestAnimationFrame(playGame);
  } else{
    music.remove();
  }*/
}

function startRun(event) {
  if (keys.hasOwnProperty(event.key)) {
    event.preventDefault();
    keys[event.key] = true;
  }
}

function stopRun(event) {
  if (keys.hasOwnProperty(event.key)) {
    event.preventDefault();
    keys[event.key] = false; 
  }
}

function moveRoad(){
  let lines = document.querySelectorAll('.line');
  lines.forEach(function(line){
    line.y += setting.speed;
    line.style.top = line.y + 'px';
 
    if (line.y >= gameArea.offsetHeight) {
      line.y = -HEIGHT_ELEM;
    }

  });
}

function moveEnemy(){
  let enemy = document.querySelectorAll('.enemy');
  enemy.forEach(function(item) {
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();

    if (carRect.top <= enemyRect.bottom && 
      carRect.right >= enemyRect.left && 
      carRect.left <= enemyRect.right && 
      carRect.bottom >= enemyRect.top) {
      setting.start = false;
      console.warn('ДТП');
      start.classList.remove('hide');
      //start.style.top = score.offsetHeight + 'px';
    }

    item.y += setting.speed / 2;
    item.style.top = item.y + 'px';
    if (item.y >= gameArea.offsetHeight) {
      item.y = -HEIGHT_ELEM * setting.traffic;
      item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    }
  });
}

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

/*const json = {
  name: "Maks",
  age: 34
};
 console.log(json);

 console.log(JSON.stringify(json));
*/
