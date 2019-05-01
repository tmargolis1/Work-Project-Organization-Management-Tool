var canvas;
var Points = [];

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  for (var i = 0; i < 100; i++) {
    Points.push(new Point());
  }
}

function draw() {
  background('#1297B8');
  for (var i = 0; i < Points.length; i++) {
    Points[i].move();
    Points[i].display();
  }
  for (var i = 0; i < Points.length; i++) {
    if (dist(Points[i].x, Points[i].y, mouseX, mouseY) <= 100) {
      push();
      stroke('#373737');
      strokeWeight(2);
      line(Points[i].x, Points[i].y, mouseX, mouseY);
      pop();
    }
  }
}

class Point {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.diameter = random (10,30);
    this.speed = random(1, 2);
  }

  move() {
    this.x += this.speed;
    this.y += this.speed;
    if (this.x > width) {
      this.x = 0 - this.diameter;
    }
    if (this.y > height) {
      this.y = 0 - this.diameter;
    }
  }

  display() {
    push();
    fill('#373737');
    strokeWeight(0);
    ellipse(this.x, this.y, this.diameter, this.diameter);
    pop();
  }
}