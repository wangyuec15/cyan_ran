let positions = []; // Array to store previous mouse positions
const delay = 50; // Number of frames of delay
let scrollPosition = 0; // Variable to store the scroll position
let previousScrollPosition = 0; // Variable to store the previous scroll position
let wavebaseline = 0;
let undercolor = undefined;
let abovecolor = undefined;
let ellipses = [];
let maxellipses = 5;


let angle = 0; // Angle variable for noise generation
let noiseScale = 0.02; // Control the scale of the noise
let noiseStrength = 50; // Control the strength/amplitude of the noise


let customCursor; // Variable to store custom cursor SVG
let cursorcanvas;
let sketchcanvas;
function preload() {
  // Load the custom cursor SVG
  customCursor = loadImage('./static/mouse.svg');
}


function setup() {
  let container = select('#cursor-container');
  cursorcanvas = createCanvas(100, 100);
  cursorcanvas.parent(container); 

  let container2 = select('#sketch-container');
  sketchcanvas = createCanvas(windowWidth, windowHeight);
  sketchcanvas.parent(container2); 

  noCursor();
  wavebaseline = height / 4;
  undercolor = color(195, 165, 255);
  abovecolor = color(255, 255, 255);
  // underwave()
  positions.push(0);
  
  // Add event listener for scroll events on a specific element
  // let scrollContainer = document.getElementById('scroll-container');
  document.body.addEventListener('wheel', handleScroll);
}

function draw() {
  sketchcanvas.clear();
  cursorcanvas.fill(undercolor);
  wave();
  // drawRotatedEllipse({ x: mouseX, y: mouseY }, { x: mouseX + 10, y: mouseY + 10 }, 20);
  
  // drawRotatedEllipse();

  let centerX = width / 2;
  let centerY = height / 2;
  let radius = 100;

  drawNoisyEllipse();

  cursorcanvas.image(customCursor, mouseX - width/32, mouseY-width/32, width/16, width/16);
}

function underwave() {
  noStroke();
  const purpleColor = color(148, 0, 211); // Purple color
  purpleColor.setAlpha(100); // Set the alpha value for transparency

  const amplitude = height / 16;
  const frequency = 0.01;

  for (let x = 0; x <= width; x += 10) {
    for(let y = height + amplitude; y < height; y += 10) {
      fill(purpleColor);
      ellipse(x, y, 4, 4);
    }
  }
}

function wave() {
  // Store current mouse position
  const maxmove = 1;
  if(abs(mouseX - positions[positions.length - 1]) > maxmove) {
    if(mouseX > positions[positions.length-1]) {
      for(let i = 1; positions[positions.length-1] + maxmove * i < mouseX; i++) {
        positions.push(positions[positions.length-1] + maxmove * i);
      }
    } else if (mouseX < positions[positions.length-1]){
      for(let i = 1; positions[positions.length-1] - maxmove * i > mouseX; i++) {
        positions.push(positions[positions.length-1] - maxmove * i);
      }
    }
  }
  // Remove oldest position if array length exceeds delay
  if (positions.length > delay) {
    positions.shift();
  }
  
  // Draw delayed positions
  // for (let i = 0; i < positions.length; i++) {
  //   let pos = positions[i];
  //   let alpha = map(i, 0, positions.length - 1, 0, 255);
  //   fill(0, alpha);
  //   ellipse(pos, 100, 20, 20);
  // }
  
  let pos = positions[0];
  // ellipse(pos, 200, 20, 20);

  noStroke();
  // const purpleColor = color(195, 165, 255); // Purple color
  // purpleColor.setAlpha(100); // Set the alpha value for transparency

  const amplitude = height / 16;
  const delta = height / 32;
  const frequency = 0.006;

  for (let x = 0; x <= width; x += 10) {
    for (let y = wavebaseline - amplitude - delta; y < height + amplitude + delta; y += 10) {
      const waveY = wavebaseline - (1 - abs(pos  - x ) / width)  *   amplitude * cos((x - pos) * frequency) * abs(cos(frameCount * 0.02)) ;
      if (y >= waveY) {
        fill(undercolor);
        ellipse(x, y, 4, 4);
      }
    }
  }
  if(positions.length > 1) {
    positions.shift();
  }

}

function drawRotatedEllipse() {
  for (let i = ellipses.length; i < maxellipses; i++) {
    let x = random(width); // Random x-coordinate within the canvas width
    let y = random(height); // Random y-coordinate within the canvas height
    let w = random(10, 100); // Random width between 10 and 100
    let h = random(10, 100); // Random height between 10 and 100
    let randomAngle = map(random(), 0, 1, -PI, PI);
    ellipses.push({x, y, w, h, randomAngle});

    fill(fillColor);
    ellipse(x, y, w, h);
  }
  let angle = atan2(pos2.y - pos1.y, pos2.x - pos1.x);
  push();
  translate(pos1.x, pos1.y);
  rotate(angle);
  ellipse(0, 0, distance, 10);
  pop();
}

function handleScroll(event) {
  // Update the scroll position variables
  // scrollPosition = window.scrollY;

  // // Determine scroll direction
  // let scrollDirection = scrollPosition > previousScrollPosition ? 'down' : 'up';

  // // Store the current scroll position as the previous scroll position
  // previousScrollPosition = scrollPosition;
  wavebaseline += event.deltaY;
  if(wavebaseline < height/16) {
    wavebaseline = height/16;
  } 
  if(wavebaseline > height * 15 / 16) {
    wavebaseline = height * 15 / 16;
  }
  // console.log('Scroll direction:', event.deltaY);

  redraw();
}

function drawNoisyEllipse() {
  ellipses = ellipses.filter((element) => element.y > wavebaseline + width / 16);
  
  for (let i = ellipses.length; i < maxellipses; i++) {
    let x = random(width); 
    let y = width / 8 + height; // Random y-coordinate within the canvas height
    if(ellipses.length != 0) {
      y = Math.max(ellipses[ellipses.length - 1].y, height) + width / 8;
    }
    let radius = random(width/ 8, width / 4); // Random width between 10 and 100
    let angle = map(random(), 0, 1, 0, PI/4);
    let delta = random();
    ellipses.push({x, y, radius, angle, delta});

  }
  
  for(let i = 0; i < ellipses.length; i++) {
    push();
    translate(ellipses[i].x, ellipses[i].y);
    rotate(ellipses[i].angle);
    beginShape();
    let noiseValue = getNoiseValue(frameCount + ellipses[i].delta);
    let offset = map(noiseValue, 0, 1, ellipses[i].radius / 3, ellipses[i].radius * 2 / 3);
    ellipse(0,0, ellipses[i].radius - offset, offset);
      
    endShape(CLOSE);
    pop();
    ellipses[i].y  = ellipses[i].y - 1;
  }
  
}

function getNoiseValue(a) {
  let noiseValue = noise(noiseScale * cos(a), noiseScale * sin(a), frameCount * 0.01);
  return noiseValue;
}