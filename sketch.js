const ROWS = 10;
const BEADS = 10;
const LENGTH = 15; // in number of beads

const D = 50;
const ROW_HEIGHT = D * 1.5;

const [W, H] = [LENGTH * D + 3 * D, ROWS * ROW_HEIGHT + D];
const [OFFSET_X, OFFSET_Y] = [2 * D, D];
/*const COLOURS = [
  [252, 186, 3],
  [26, 35, 189],
  [235, 19, 37],
  [255, 255, 255],
  [20, 219, 209],
];*/

const COLOURS = ["#FCBA03", "#1A23BD", "#EB1325", "#FFFFFF", "#14DBD1"];

const GAME = [];

let [selectedIndex, selectedRow] = [null, null];
let timePressed = 0;

for (let i = 0; i < ROWS; i++) {
  GAME[i] = [];
  for (let j = 0; j < BEADS; j++) GAME[i].push(j);
}

let kocka;

function preload() {
  kocka = loadImage("./kocka.png");
}

function setup() {
  createCanvas(1300, 1400);
}

function flickBeads() {
  if (GAME[selectedRow][selectedIndex] < BEADS)
    for (let i = selectedIndex; i < BEADS; i++)
      GAME[selectedRow][i] = LENGTH - BEADS + i;
  else for (let i = 0; i <= selectedIndex; i++) GAME[selectedRow][i] = i;
}

function mousePressed() {
  let inputX = (touches.length > 0 ? touches[0].x : mouseX) - 200;
  let inputY = touches.length > 0 ? touches[0].y : mouseY;
  let clickedRow = floor((inputY - OFFSET_Y + ROW_HEIGHT / 2) / ROW_HEIGHT);
  if (clickedRow < 0 || clickedRow >= ROWS) return;
  let [relativeX, relativeY] = [
    (inputX - OFFSET_X) / D,
    (inputY - OFFSET_Y - clickedRow * ROW_HEIGHT) / D,
  ];
  for (let i = 0; i < BEADS; i++) {
    let dist = (relativeX - GAME[clickedRow][i]) ** 2 + relativeY ** 2;
    if (dist <= 0.25) {
      [selectedIndex, selectedRow] = [i, clickedRow];
      timePressed = new Date().getTime();
      return;
    }
  }
}

function mouseReleased() {
  if (new Date().getTime() - timePressed < 150) flickBeads();
  [selectedIndex, selectedRow] = [null, null];
}

function touchEnded() {
  mouseReleased();
}

function touchStarted() {
  mousePressed();
}

function draw() {
  background(255);
  translate(OFFSET_X + 200, OFFSET_Y);
  if (selectedIndex !== null) {
    if ((mouseX - 200 - OFFSET_X) / D > LENGTH - BEADS + selectedIndex) {
      for (let i = selectedIndex; i < BEADS; i++)
        GAME[selectedRow][i] = LENGTH - BEADS + i;
    } else if ((mouseX - 200 - OFFSET_X) / D < selectedIndex) {
      for (let i = 0; i <= selectedIndex; i++) GAME[selectedRow][i] = i;
    } else {
      GAME[selectedRow][selectedIndex] = (mouseX - 200 - OFFSET_X) / D;
      for (let i = selectedIndex + 1; i < BEADS; i++)
        if (GAME[selectedRow][i] - GAME[selectedRow][i - 1] < 1)
          GAME[selectedRow][i] = GAME[selectedRow][i - 1] + 1;
        else break;
      for (let i = selectedIndex - 1; i >= 0; i--)
        if (GAME[selectedRow][i + 1] - GAME[selectedRow][i] < 1)
          GAME[selectedRow][i] = GAME[selectedRow][i + 1] - 1;
        else break;
    }
  }

  strokeWeight(0);
  fill(160, 82, 45);
  let gradient = drawingContext.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#09ff00");
  gradient.addColorStop(1, "#2605ff");
  drawingContext.fillStyle = gradient;
  rect(-OFFSET_X + D / 2, -OFFSET_Y, D, ROWS * ROW_HEIGHT + D, D, D, 0, 0);
  rect(LENGTH * D - D / 2, -OFFSET_Y, D, ROWS * ROW_HEIGHT + D, D, D, 0, 0);
  stroke(0);
  strokeWeight(3);
  for (let i = 0; i < ROWS; i++)
    line(-D / 2, i * ROW_HEIGHT, LENGTH * D - D / 2, i * ROW_HEIGHT);
  drawBeads();
  image(kocka, -300, 700, 1300, 600);
}

function drawBeads() {
  for (let i = 0; i < ROWS; i++) {
    //fill(COLOURS[i % COLOURS.length]);
    let gradient = drawingContext.createLinearGradient(200, 0, 700, 0);
    gradient.addColorStop(0, COLOURS[i % COLOURS.length]);
    gradient.addColorStop(1, COLOURS[(i + 1) % COLOURS.length]);
    drawingContext.fillStyle = gradient;
    for (let j = 0; j < BEADS; j++) {
      strokeWeight(2);
      circle(GAME[i][j] * D, i * ROW_HEIGHT, D - 2);
    }
  }
}
