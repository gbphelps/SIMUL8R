import Coord from './coordinate'

export default class MovingPoint {
  constructor(point, velocity=new Coord(0,0)){
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
