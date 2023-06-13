let positions = []; // Array to store previous mouse positions
const delay = 50; // Number of frames of delay

function setup() {
  createCanvas(windowWidth, windowHeight);
  // underwave()
  positions.push(0);
}

function draw() {
  background(255);
  wave();
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
  const purpleColor = color(148, 0, 211); // Purple color
  purpleColor.setAlpha(100); // Set the alpha value for transparency

  const amplitude = height / 16;
  const delta = height / 32;
  const frequency = 0.006;

  for (let x = 0; x <= width; x += 10) {
    for (let y = height / 4 - amplitude - delta; y < height + amplitude + delta; y += 10) {
      const waveY = height / 4 - (1 - abs(pos  - x ) / width)  *   amplitude * cos((x - pos) * frequency) * abs(cos(frameCount * 0.02)) ;
      if (y >= waveY) {
        fill(purpleColor);
        ellipse(x, y, 4, 4);
      }
    }
  }
  if(positions.length > 1) {
    positions.shift();
  }

}
