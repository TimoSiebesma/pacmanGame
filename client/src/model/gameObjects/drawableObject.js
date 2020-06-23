export default class DrawableObject {
  constructor(imgSrc, x, y, ctx, size, speed) {
    this.imgSrc = imgSrc;
    this.x = x;
    this.y = y;
    this.size = size;
    this.ctx = ctx;
    this.speed = speed;
    this.img = document.createElement("img");
    this.img.src = this.imgSrc;
    this.rows = [
      -242,
      -207,
      -172,
      -137,
      -102,
      -67,
      -32,
      +48,
      +83,
      +118,
      +153,
      +188,
      +223,
    ];
    this.columns = [
      -242,
      -207,
      -172,
      -137,
      -102,
      -67,
      -32,
      +48,
      +83,
      +118,
      +153,
      +188,
      +223,
    ];
  }

  draw = async () => {
    await this.ctx.drawImage(
      this.img,
      this.x + window.innerWidth / 2,
      this.y + +window.innerHeight / 2,
      this.size,
      this.size
    );
  };

  findMiddle = () => {
    let middle = { x: this.x + this.size / 2, y: this.y + this.size / 2 };
    return middle;
  };
}
