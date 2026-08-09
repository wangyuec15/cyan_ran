new p5(function(sketch1) {
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

  let canvas1;

  function pageHeight() {
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, sketch1.windowHeight);
  }

  sketch1.setup = function() {

    let container2 = document.getElementById('sketch-container');
    sketchcanvas = sketch1.createCanvas(sketch1.windowWidth, pageHeight());
    sketchcanvas.parent(container2);

    sketch1.noCursor();
    wavebaseline = sketch1.height / 4;
    undercolor = sketch1.color(195, 165, 255);
    abovecolor = sketch1.color(255, 255, 255);
    // underwave()
    positions.push(0);

    // Add event listener for scroll events on a specific element
    // let scrollContainer = document.getElementById('scroll-container');
    document.body.addEventListener('wheel', handleScroll);

    // Images below the fold can still be loading at setup() time and
    // grow the page after this canvas is sized, so recheck once everything's in.
    window.addEventListener('load', () => sketch1.resizeCanvas(sketch1.windowWidth, pageHeight()));
  };

  sketch1.windowResized = function() {
    sketch1.resizeCanvas(sketch1.windowWidth, pageHeight());
  };

  sketch1.draw = function() {
    // Drawing code for sketch 1
    sketchcanvas.clear();
    wave();
    // drawRotatedEllipse({ x: mouseX, y: mouseY }, { x: mouseX + 10, y: mouseY + 10 }, 20);
    
    // drawRotatedEllipse();


    drawNoisyEllipse();
  };

  function wave() {
    // Store current mouse position
    const maxmove = 1;
    if(sketch1.abs(sketch1.mouseX - positions[positions.length - 1]) > maxmove) {
      if(sketch1.mouseX > positions[positions.length-1]) {
        for(let i = 1; positions[positions.length-1] + maxmove * i < sketch1.mouseX; i++) {
          positions.push(positions[positions.length-1] + maxmove * i);
        }
      } else if (sketch1.mouseX < positions[positions.length-1]){
        for(let i = 1; positions[positions.length-1] - maxmove * i > sketch1.mouseX; i++) {
          positions.push(positions[positions.length-1] - maxmove * i);
        }
      }
    }
    // Remove oldest position if array length exceeds delay
    if (positions.length > delay) {
      positions.shift();
    }
    
    
    let pos = positions[0];
    // ellipse(pos, 200, 20, 20);
  
    sketch1.noStroke();
  
    const amplitude = sketch1.height / 16;
    const delta = sketch1.height / 32;
    const frequency = 0.006;
  
    for (let x = 0; x <= sketch1.width; x += 10) {
      for (let y = wavebaseline - amplitude - delta; y < sketch1.height + amplitude + delta; y += 10) {
        const waveY = wavebaseline - (1 - sketch1.abs(pos  - x ) / sketch1.width)  *   amplitude * sketch1.cos((x - pos) * frequency) *sketch1. abs(sketch1.cos(sketch1.frameCount * 0.02)) ;
        if (y >= waveY) {
          sketch1.fill(undercolor);
          sketch1.ellipse(x, y, 4, 4);
        }
      }
    }
    if(positions.length > 1) {
      positions.shift();
    }
  
  }

  function handleScroll(event) {
    wavebaseline += event.deltaY;
    if(wavebaseline < sketch1.height/16) {
      wavebaseline = sketch1.height/16;
    } 
    if(wavebaseline > sketch1.height * 15 / 16) {
      wavebaseline = sketch1.height * 15 / 16;
    }
    // console.log('Scroll direction:', event.deltaY);
  
    sketch1.redraw();
  }

  function drawNoisyEllipse() {
    ellipses = ellipses.filter((element) => element.y > wavebaseline + sketch1.width / 16);
    
    for (let i = ellipses.length; i < maxellipses; i++) {
      let x = sketch1.random(sketch1.width); 
      let y = sketch1.width / 8 + sketch1.height; // Random y-coordinate within the canvas height
      if(ellipses.length != 0) {
        y = Math.max(ellipses[ellipses.length - 1].y, sketch1.height) + sketch1.width / 8;
      }
      let radius = sketch1.random(sketch1.width/ 8, sketch1.width / 4); // Random width between 10 and 100
      let angle = sketch1.map(sketch1.random(), 0, 1, 0, sketch1.PI/4);
      let delta = sketch1.random();
      ellipses.push({x, y, radius, angle, delta});
  
    }
    
    for(let i = 0; i < ellipses.length; i++) {
      sketch1.push();
      sketch1.translate(ellipses[i].x, ellipses[i].y);
      sketch1.rotate(ellipses[i].angle);
      sketch1.beginShape();
      let noiseValue = getNoiseValue(sketch1.frameCount + ellipses[i].delta);
      let offset = sketch1.map(noiseValue, 0, 1, ellipses[i].radius / 3, ellipses[i].radius * 2 / 3);
      sketch1.ellipse(0,0, ellipses[i].radius - offset, offset);
        
      sketch1.endShape(sketch1.CLOSE);
      sketch1.pop();
      ellipses[i].y  = ellipses[i].y - 1;
    }
    
  }
  
  function getNoiseValue(a) {
    let noiseValue = sketch1.noise(noiseScale * sketch1.cos(a), noiseScale * sketch1.sin(a), sketch1.frameCount * 0.01);
    return noiseValue;
  }

});




// function setup() {

// }

// function draw() {
  
// }

// // function underwave() {
// //   noStroke();
// //   const purpleColor = color(148, 0, 211); // Purple color
// //   purpleColor.setAlpha(100); // Set the alpha value for transparency

// //   const amplitude = height / 16;
// //   const frequency = 0.01;

// //   for (let x = 0; x <= width; x += 10) {
// //     for(let y = height + amplitude; y < height; y += 10) {
// //       fill(purpleColor);
// //       ellipse(x, y, 4, 4);
// //     }
// //   }
// // }



// function drawRotatedEllipse() {
//   for (let i = ellipses.length; i < maxellipses; i++) {
//     let x = random(width); // Random x-coordinate within the canvas width
//     let y = random(height); // Random y-coordinate within the canvas height
//     let w = random(10, 100); // Random width between 10 and 100
//     let h = random(10, 100); // Random height between 10 and 100
//     let randomAngle = map(random(), 0, 1, -PI, PI);
//     ellipses.push({x, y, w, h, randomAngle});

//     fill(fillColor);
//     ellipse(x, y, w, h);
//   }
//   let angle = atan2(pos2.y - pos1.y, pos2.x - pos1.x);
//   push();
//   translate(pos1.x, pos1.y);
//   rotate(angle);
//   ellipse(0, 0, distance, 10);
//   pop();
// }



