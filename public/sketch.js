let positions = []; // Array to store previous mouse positions
const delay = 50; // Number of frames of delay
let scrollPosition = 0; // Variable to store the scroll position
let previousScrollPosition = 0; // Variable to store the previous scroll position
let wavebaseline = 0;
let undercolor = undefined;
let abovecolor = undefined;

let customCursor; // Variable to store custom cursor SVG

function preload() {
  // Load the custom cursor SVG
  customCursor = loadImage('./static/mouse.svg');
}


function setup() {
  createCanvas(windowWidth, windowHeight);
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
  background(255);
  wave();
  // drawRotatedEllipse({ x: mouseX, y: mouseY }, { x: mouseX + 10, y: mouseY + 10 }, 20);
  image(customCursor, mouseX - width/32, mouseY-width/32, width/16, width/16);

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

function drawRotatedEllipse(pos1, pos2, distance) {
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
  console.log('Scroll direction:', event.deltaY);

  redraw();
}