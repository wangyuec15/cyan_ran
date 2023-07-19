new p5(function(sketch2) {
  let canvas2;
  let customCursor; // Variable to store custom cursor SVG

  sketch2.preload = function() {
    // Load the custom cursor SVG
    sketch2.customCursor = sketch2.loadImage('./static/mouse.svg');
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
    let width = canvas2.width;
    let height = canvas2.height;
    // console.log(width);
    sketch2.image(sketch2.customCursor, sketch2.mouseX - width / 32, sketch2.mouseY - width / 32, width / 16, width / 16);
  };
});