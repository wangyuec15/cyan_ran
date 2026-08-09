new p5(function(sketch2) {
  let canvas2;
  let customCursor; // Variable to store custom cursor SVG
  let pulseSpeed = 0.04;  // Controls the speed of the pulsating effect
  let scaleFactor = 0.1;


  let bgImageElement;
  let bgScale = 1.0;
  let bgPositionX = 0;
  let bgPositionY = 0;

  const getBackground = () => {
    bgImageElement = document.head;
    let computedStyle = getComputedStyle(bgImageElement);
    bgScale = parseFloat(computedStyle.getPropertyValue('background-size').replace('%', '')) / 100;
    bgPositionX = parseFloat(computedStyle.getPropertyValue('background-position-x').replace('px', ''));
    bgPositionY = parseFloat(computedStyle.getPropertyValue('background-position-y').replace('px', ''));
    console.log(bgScale, bgPositionX, bgPositionY)

  }

  sketch2.preload = function() {
    // Load the custom cursor SVG
    sketch2.customCursor = sketch2.loadImage('./static/mouse.svg');
    getBackground();
  }

  sketch2.setup = function() {
    let container2 = document.getElementById('cursor-container');
    canvas2 = sketch2.createCanvas(sketch2.windowWidth, sketch2.windowHeight);
    canvas2.parent(container2);

    sketch2.noCursor();
  };

  sketch2.draw = function() {
    // Drawing code for sketch 2
    canvas2.clear();
    
    let pulse = Math.sin(sketch2.frameCount * pulseSpeed) + 0.5;

    let width = canvas2.width;
    let height = canvas2.height;
    
    let scaledWidth = width/16;
    

    let posX = sketch2.mouseX 
    let posY = sketch2.mouseY 

    sketch2.push();
    sketch2.translate(posX, posY);
    sketch2.scale(1 + pulse * scaleFactor);
    // console.log(width);
    sketch2.image(sketch2.customCursor, -scaledWidth/2, -scaledWidth/2  , scaledWidth , scaledWidth );
    sketch2.pop();
  };
});