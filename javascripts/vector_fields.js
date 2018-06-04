import Coord from './coordinate'


function rand() {return Math.random()*2-1;}
function lerp(a,b,w) {return (1-w)*a + w*b;}

function lerpVec(a,b,w)
{
  let x=lerp(a.x,b.x,w);
  let y=lerp(a.y,b.y,w);
  return new Coord(x,y);
}

function weight(dist){return dist;}
  //{return (Math.sin(3/2*Math.PI+dist*Math.PI)+1)/2;}


export default class Mesh {
  constructor(numLines, influence){
    let noise=[];
    let increments=[];

    for (let i=0;i<=numLines;i++){
        let num = -1 + 2 * i/numLines;
        increments.push(num);
        noise[i]=[];

        for (let j=0;j<=numLines;j++){
           noise[i][j]=new Coord(rand(),rand());
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
      distance = new Coord(-distance.y,distance.x);
    let scale =
        10 * Math.pow(100,distance.magnitude()*-1);
      return distance.multiply(intensity*scale);
    }
}
