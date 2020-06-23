export default class UI {
  constructor(text, x, y, sCtx, fontSize, widthOffset) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.sCtx = sCtx;
    this.fontSize = fontSize;
    this.widthOffset = widthOffset;
  }

  draw = async () => {
    this.sCtx.font = this.fontSize + "px Arial";
    this.sCtx.fillStyle = "#556f96";

    this.sCtx.fillRect(
      this.x - 2 * this.fontSize + window.innerWidth / 2,
      this.y - 1.5 * this.fontSize + window.innerHeight / 2,
      this.fontSize * 8.4,
      this.fontSize * 2.3
    );
    this.sCtx.fillStyle = "#FFFFFF";
    this.sCtx.fillText(
      this.text,
      this.x - this.widthOffset + window.innerWidth / 2,
      this.y + window.innerHeight / 2
    );
  };
}
