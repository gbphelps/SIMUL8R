/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__coordinate__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__color__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__vector_fields__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shapes__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__moving_point__ = __webpack_require__(5);







function rand() {return Math.random()*2-1;}
////////////////////////////////////////////
let running;
let meshes = [];
meshes.push(new __WEBPACK_IMPORTED_MODULE_2__vector_fields__["a" /* default */](10,.04));
meshes.push(new __WEBPACK_IMPORTED_MODULE_2__vector_fields__["a" /* default */](20,.02));

function calcNoise(point){
  let noise = new __WEBPACK_IMPORTED_MODULE_0__coordinate__["a" /* default */](0,0);
  meshes.forEach(function(mesh){
    if(typeof mesh == "object")
      {noise = noise.add(mesh.getNoise(point));}
    else
      {noise = noise.add(mesh(point));}
  })
  return noise;
};
////////////////////////////////////////////


function move(stream,color){
  if (stream.position.error()){return false;}

  let noise = calcNoise(stream.position).multiply(.3);
  let friction = stream.velocity.multiply(.3);
  let wind = new __WEBPACK_IMPORTED_MODULE_0__coordinate__["a" /* default */](0,0);

  let acceleration = noise.subtract(friction).add(wind).multiply(.5)

  if (acceleration.belowThreshold()) return false;

  let velocity = stream.velocity.add(acceleration);
  let position = stream.position.add(velocity);

  stream.position.lineTo(position,color.print());
  return new __WEBPACK_IMPORTED_MODULE_4__moving_point__["a" /* default */](position,velocity);
}

function nextFrame(streams,color){
  let newStreams = [];

  for (let i=0;i<streams.length;i++){
    let stream = move(streams[i],color);
    if (stream){newStreams = newStreams.concat(stream);}
  }
  return newStreams;
}

///////////////////////////////////////////////////
function update(color,streams){
  if (color.a <.01 || streams.length==0) cancelAnimationFrame(running);
    streams = nextFrame(streams,color);
    color = color.update();
    running = requestAnimationFrame(()=>update(color,streams))
}

let magenta = new __WEBPACK_IMPORTED_MODULE_1__color__["a" /* default */](255,0,0,.3);
let aqua = new __WEBPACK_IMPORTED_MODULE_1__color__["a" /* default */](255,0,255,.3);




document.addEventListener('DOMContentLoaded', ()=>{
  running = requestAnimationFrame(()=>update(aqua,__WEBPACK_IMPORTED_MODULE_3__shapes__["a" /* grid */](-.5,.5,-.5,.5,50)))
})


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
let canvas, ctx;

document.addEventListener('DOMContentLoaded',()=>{
  canvas = document.getElementById('streams');
  canvas.width = window.innerWidth;
  canvas.height = window.innerWidth;
  ctx = canvas.getContext("2d");
})



class Coord {
  constructor(x, y){
    this.x = x;
    this.y = y;
  }

  magnitude(){
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }

  dotProduct(vector){
    return this.x * vector.x + this.y * vector.y;
  }

  add(vector){
    return new Coord(this.x+vector.x,this.y+vector.y);
  }
  subtract(vector){
    return new Coord(this.x-vector.x,this.y-vector.y);
  }

  multiply(scalar){
    return new Coord(this.x*scalar,this.y*scalar);
  }

  plot(color='white'){
    let x = (this.x + 1) * canvas.height/2;
    let y = (1 - this.y) * canvas.width/2;
    ctx.moveTo(x,y);
    ctx.arc(x,y,1,0,Math.PI*2);
    ctx.fillStyle=color;
    ctx.fill();
  }

  lineTo(point,color='white'){
    let x = (this.x + 1) * canvas.height/2;
    let y = (1 - this.y) * canvas.width/2;
    ctx.beginPath();
    ctx.strokeStyle=color;
    ctx.moveTo(x,y);
    let x2 = (point.x + 1) * canvas.height/2;
    let y2 = (1 - point.y) * canvas.width/2;
    ctx.lineTo(x2,y2);
    ctx.stroke();
  }

  error(){
    if (this.x >= 1){return true;}
    if (this.x <= -1){return true;}
    if (this.y >= 1){return true;}
    if (this.y <= -1){return true;}
    return false;
  }

  belowThreshold(){
    if (Math.abs(this.x)<0.000001 && Math.abs(this.y)<.000001){return true;}
    return false;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Coord;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__moving_point__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__coordinate__ = __webpack_require__(1);




const line = (start,end,n) =>
{
  let result=[];
  let xinc = (end.x-start.x)/n;
  let yinc = (end.y-start.y)/n;
  for (let i=0;i<=n;i++)
  {
    let x = start.x + i*xinc;
    let y = start.y + i*yinc;
    result.push(new __WEBPACK_IMPORTED_MODULE_0__moving_point__["a" /* default */](new __WEBPACK_IMPORTED_MODULE_1__coordinate__["a" /* default */](x,y)));
  }
  return result;
}
/* unused harmony export line */



const circle = (center,radius,points,theta0=0) =>
{
  let theta_inc = (2*Math.PI-theta0)/points;
  let theta=theta0;
  let result = [];

  for (let i=0;i<points;i++)
  {
    let x = radius * Math.cos(theta) + center.x;
    let y = radius * Math.sin(theta) + center.y;
    result.push(new __WEBPACK_IMPORTED_MODULE_0__moving_point__["a" /* default */](new __WEBPACK_IMPORTED_MODULE_1__coordinate__["a" /* default */](x,y)));
    theta += theta_inc;
  }
  return result;
}
/* unused harmony export circle */


const grid = (xmin,xmax,ymin,ymax,n) =>
{
  let result=[];
  let xinc = (xmax-xmin)/n;
  let yinc = (ymax-ymin)/n;

  for (let x=xmin; x<=xmax; x+= xinc){
    for (let y=ymin; y<=ymax; y+= yinc){
      result.push(new __WEBPACK_IMPORTED_MODULE_0__moving_point__["a" /* default */](new __WEBPACK_IMPORTED_MODULE_1__coordinate__["a" /* default */](x,y)));
    }
  }

  return result;
}
/* harmony export (immutable) */ __webpack_exports__["a"] = grid;


// Example initializations:
// let start = new Coord(-1,-1);
// let end = new Coord(1,1);
// let points1 =
//     Shapes.circle(new Coord(-.15,.5),.3,1000);
// let points2 = Shapes.circle(new Coord(.15,.5),.3,1000);
// let points3 = Shapes.line(start,end,1000);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class RGBA {
  constructor(r,g,b,a){
    this.r=r;
    this.g=g;
    this.b=b;
    this.a=a;
  }

  print(){
    return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
  }

  update(){
    return new RGBA(this.r,this.g,this.b,this.a*.99)
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = RGBA;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__coordinate__ = __webpack_require__(1);



function rand() {return Math.random()*2-1;}
function lerp(a,b,w) {return (1-w)*a + w*b;}

function lerpVec(a,b,w)
{
  let x=lerp(a.x,b.x,w);
  let y=lerp(a.y,b.y,w);
  return new __WEBPACK_IMPORTED_MODULE_0__coordinate__["a" /* default */](x,y);
}

function weight(dist){return dist;}
  //{return (Math.sin(3/2*Math.PI+dist*Math.PI)+1)/2;}


class Mesh {
  constructor(numLines, influence){
    let noise=[];
    let increments=[];

    for (let i=0;i<=numLines;i++){
        let num = -1 + 2 * i/numLines;
        increments.push(num);
        noise[i]=[];

        for (let j=0;j<=numLines;j++){
           noise[i][j]=new __WEBPACK_IMPORTED_MODULE_0__coordinate__["a" /* default */](rand(),rand());
         }
      }

    this.increments=increments;
    this.noise=noise;
    this.influence=influence;
    this.numLines=numLines;
  }

  getNoise(point){
    let xnode=0;
    let ynode=0;

    while (this.increments[xnode]<=point.x){xnode++;}
    while (this.increments[ynode]<=point.y){ynode++;}

    //let c = Math.ceil((point.x+1)*numLines/2)*2/numLines-1;
    // document.write(c);

    let bottomLeft=
       this.noise[xnode-1][ynode-1];

    let bottomRight=
        this.noise[xnode][ynode-1];

    let topLeft=
        this.noise[xnode-1][ynode];

    let topRight=
        this.noise[xnode][ynode];

    let xscale=(point.x-this.increments[xnode-1])*this.numLines/2;
    let yscale=(point.y-this.increments[ynode-1])*this.numLines/2;

    let bottom=
      lerpVec(bottomLeft,bottomRight,weight(xscale));
    let top=
      lerpVec(topLeft,topRight,weight(xscale));
    return(
      lerpVec(bottom,top,weight(yscale)).multiply(this.influence));
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Mesh;



///////////////////////////////


function radialBias(origin,intensity){
  return (point)=>
    {
      let distance = point.subtract(origin);
      let scale = 5 * Math.pow(100,distance.magnitude()*-1);
      return distance.multiply(intensity*scale);
    }
}

function whorl(origin,intensity){
  return (point)=>
    {
      let distance = point.subtract(origin);
      distance = new __WEBPACK_IMPORTED_MODULE_0__coordinate__["a" /* default */](-distance.y,distance.x);
    let scale =
        10 * Math.pow(100,distance.magnitude()*-1);
      return distance.multiply(intensity*scale);
    }
}


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__coordinate__ = __webpack_require__(1);


class MovingPoint {
  constructor(point, velocity=new __WEBPACK_IMPORTED_MODULE_0__coordinate__["a" /* default */](0,0)){
    this.position = point;
    this.velocity = velocity;
  }

  fracture(){
    if (this.velocity.magnitude()>.00) {return this;}
    let vFrac = new coord(rand()*.03,rand()*.03);
    let v1 = this.velocity.add(vFrac);
    let v2 = this.velocity.subtract(vFrac);
    return [
      new movingPoint(this.position,v1),
      new movingPoint(this.position,v2)
    ];
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MovingPoint;



/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map