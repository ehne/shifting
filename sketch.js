//vars
// lovely gradient
var colorTempArray= ["#05f","#0b51f8","#114ff4","#164ef0","#1c4ced","#214ae9","#2748e5","#2c46e1","#3244de","#3743da","#3d41d6","#433fd3","#483dcf","#4e3bcb","#5339c8","#5937c4","#5e36c0","#6434bc","#6932b9","#6f30b5","#742eb1","#7a2cae","#7f2baa","#8529a6","#8b27a3","#90259f","#96239b","#9b2198","#a11f94","#a61e90","#ac1c8c","#b11a89","#b71885","#bc1681","#c2147e","#c8127a","#cd1176","#d30f73","#d80d6f","#de0b6b","#e30967","#e90764","#ee0660","#f4045c","#f05"];
// time
var t = 1;
// stores the weather i think
let weather;
//sets default temp
var temp = 1;
// makes the url accessable everywhere
var url;
// sets default location of blob, can be 0,1,2
var tempLocation = 1;
// set rain level 
var rainLevel = "none";
// set precipitation probability
var precipProb = 0.1;

let yoff = 100;

var rain = [];
var rainingNow = true;
var bgcolor = (100, 100, 100);

function preload() {
  var lat = "-37.813629";
  var long = "144.963058";
  url =
    "https://api.darksky.net/forecast/55c3094a65ec3abf647b001be8293bf1/" +
    lat +
    "," +
    long +
    "?units=si";

  loadJSON(url, weatherUpdate, "jsonp");
}
function setup() {
  frameRate(30);
  createCanvas(windowWidth, windowHeight);
  noStroke();
  console.log(TWO_PI);
  
}

function weatherUpdate(data) {
  console.log(data);
  // save two temperatures into vars
  currentTemp = Math.floor(data.currently.apparentTemperature);
  yesterdayTemp = Math.floor(data.daily.data["0"].apparentTemperatureHigh);
  // figure out how different the temps are
  tempCompare = currentTemp - yesterdayTemp;
  console.log(tempCompare);
  // check if temp is about the same (-3 to 3)
  if (-3 < tempCompare && tempCompare < 3) {
    // temp is the same
    console.log("temp is about the same as yesterday");
    tempLocation = 1;
  } else {
    // check to see if it is more or less
    switch (tempCompare > 0) {
      case true:
        // temp is higher
        console.log("temp is higher than yesterday");
        tempLocation = 2;
        break;
      case false:
        // temp is lower
        console.log("temp is colder than yesterday");
        tempLocation = 0;
        break;
    }
  }
  // save rain var
  precipProb = data.currently.precipProbability;

  if (precipProb<0.25 && precipProb>=0.1) {
    console.log("low rain");
    rainLevel = 10;
  }
  if (precipProb<0.1 && precipProb>=0.0) {
    console.log("no rain");
    rainLevel = 0;
  }
  if (precipProb<0.65 && precipProb >= 0.25) {
    console.log("medium rain");
    rainLevel = 50;
  }
  if (precipProb<=1 && precipProb >=0.65) {
    console.log("high rain");
    rainLevel = 150;
  }

  for (i = 0; i < rainLevel; i++) {
    rain[i] = new Rain(random(50, windowWidth-50), random(0, -3000));
  }
}

 
function draw() {
  // contains possible positions of blob. (0,1,2)

  var tempLocationArray = [
    windowWidth / 4,
    windowWidth / 2,
    (windowWidth / 4) * 3
  ];

  temp = currentTemp;
  // check to see if it is too warm
  if (temp >= 45) {
    temp = 45;
  }
  if (temp <= 1) {
    temp = 1;
  }

  var bgColor = colorTempArray[temp - 1];
  background(bgColor);

  //circle(tempLocationArray[tempLocation],windowHeight/2,50)
  // update seconds counter
  if (frameCount % 30 == true) {
    t = t + 1;
  }
  // reload weather data
  if (t == 120) {
    weather = loadJSON(url, weatherUpdate, "jsonp");
    console.log("reloaded weather data");
    t = 0;
  }

  fill(255, 25);
  translate(tempLocationArray[tempLocation], height / 2);

  var i = 0;
  var v = 5;
  var firstArray = [0, 0];
  while (i <= v) {
    var radius = 200 - v * 10 + i * 20;
    beginShape();
    xoff = i * 1000;
    var firstOffset = map(noise(xoff, yoff), 0, 1, -25, 25);
    var firstR = radius + firstOffset;
    var firstX = firstR * cos(0.01);
    var firstY = firstR * sin(0.01);
    for (var a = 0; a <= TWO_PI; a += 0.01) {
      let offset = map(noise(xoff, yoff), 0, 1, -25, 25);
      let r = radius + offset;
      let x = r * cos(a);
      let y = r * sin(a);
      ///console.log(a)

      vertex(x, y);

      xoff += 0.02;
      //ellipse(x, y, 4, 4);
    }
    endShape();
    i++;
  }
  yoff += 0.01;



  translate(-tempLocationArray[tempLocation], -(height / 2));

  

  ground();
  if (rainingNow == true) {
    //background(100);
    for (i = 0; i < rain.length; i++) {
      rain[i].dropRain();
      rain[i].splash();
    }
  }
  noStroke()
  fill("#fff");

  textAlign(RIGHT);
  text("Powered by Darksky", windowWidth - 8, windowHeight - 8);
  textAlign(LEFT);
  text("https://github.com/ehne/shifting", 8, windowHeight - 8);

}

function ground() {
  //noStroke();
  
}

function Rain(x, y) {
  this.x = x;
  this.y = y;
  //this.gravity = 9.8;
  this.length = 15;
  this.r = 0;
  this.opacity = 200;


  this.dropRain = function() {
    noStroke();
    fill(255);
    rect(this.x, this.y,3,this.length);
    this.y = this.y + 11 //+ frameCount/60;
    if (this.y > windowHeight-60) {
      this.length = this.length - 10;
      //this.y= random(0,-100);
    }
    if (this.length < 0) {
      this.length = 0;
    }
  }

  this.splash = function() {
    //strokeWeight(2);
    stroke(245, 200/frameCount);
    stroke(245, this.opacity);
    noFill();
    if (this.y > windowHeight-60) {
      ellipse(this.x, windowHeight-50, this.r * 2, this.r / 2);
      this.r++;
      this.opacity = this.opacity - 10;

      //keep the rain dropping
      if (this.opacity < 0) {
        this.y = random(0, -100);
        this.length = 15;
        this.r = 0;
        this.opacity = 200;
      }
    }
  }
}