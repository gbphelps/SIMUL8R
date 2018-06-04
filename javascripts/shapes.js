import MovingPoint from './moving_point'
import Coord from './coordinate'


export const line = (start,end,n) =>
{
  let result=[];
  let xinc = (end.x-start.x)/n;
  let yinc = (end.y-start.y)/n;
  for (let i=0;i<=n;i++)
  {
    let x = start.x + i*xinc;
    let y = start.y + i*yinc;
    result.push(new MovingPoint(new Coord(x,y)));
  }
  return result;
}


export const circle = (center,radius,points,theta0=0) =>
{
  let theta_inc = (2*Math.PI-theta0)/points;
  let theta=theta0;
  let result = [];

  for (let i=0;i<points;i++)
  {
    let x = radius * Math.cos(theta) + center.x;
    let y = radius * Math.sin(theta) + center.y;
    result.push(new MovingPoint(new Coord(x,y)));
    theta += theta_inc;
  }
  return result;
}

export const grid = (xmin,xmax,ymin,ymax,n) =>
{
  let result=[];
  let xinc = (xmax-xmin)/n;
  let yinc = (ymax-ymin)/n;

  for (let x=xmin; x<=xmax; x+= xinc){
    for (let y=ymin; y<=ymax; y+= yinc){
      result.push(new MovingPoint(new Coord(x,y)));
    }
  }

  return result;
}

// Example initializations:
// let start = new Coord(-1,-1);
// let end = new Coord(1,1);
// let points1 =
//     Shapes.circle(new Coord(-.15,.5),.3,1000);
// let points2 = Shapes.circle(new Coord(.15,.5),.3,1000);
// let points3 = Shapes.line(start,end,1000);
