import Coord from './coordinate'
import RGBA from './color'
import Mesh from './vector_fields'
import * as Shapes from './shapes'
import MovingPoint from './moving_point'


function rand() {return Math.random()*2-1;}
////////////////////////////////////////////
let running;
let meshes = [];
meshes.push(new Mesh(10,.04));
meshes.push(new Mesh(20,.02));

function calcNoise(point){
  let noise = new Coord(0,0);
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
  let wind = new Coord(0,0);

  let acceleration = noise.subtract(friction).add(wind).multiply(.5)

  if (acceleration.belowThreshold()) return false;

  let velocity = stream.velocity.add(acceleration);
  let position = stream.position.add(velocity);

  stream.position.lineTo(position,color.print());
  return new MovingPoint(position,velocity);
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

let magenta = new RGBA(255,0,0,.3);
let aqua = new RGBA(255,0,255,.3);




document.addEventListener('DOMContentLoaded', ()=>{
  running = requestAnimationFrame(()=>update(aqua,Shapes.grid(-.5,.5,-.5,.5,50)))
})
