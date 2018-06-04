let canvas, ctx;

document.addEventListener('DOMContentLoaded',()=>{
  canvas = document.getElementById('streams');
  canvas.width = window.innerWidth;
  canvas.height = window.innerWidth;
  ctx = canvas.getContext("2d");
})



export default class Coord {
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
