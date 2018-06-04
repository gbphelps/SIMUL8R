export default class RGBA {
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
