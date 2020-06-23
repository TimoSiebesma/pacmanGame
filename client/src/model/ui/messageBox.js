export default class MessageBox {
  constructor(fontSize, parent) {
    this.x = 0;
    this.y = 0;
    this.sCtx = parent.sCtx;
    this.fontSize = fontSize;
    this.parent = parent;
  }

  alert = async (text) => {
    this.parent.drawer.clearAll();
    this.parent.sCtx.textAlign = "center";
    this.sCtx.fillStyle = "#FFFFFF";
    this.parent.sCtx.font = this.fontSize + "px Arial";
    text.map((line) => {
      if (text.indexOf(line) > 0) {
        this.sCtx.font = this.fontSize / 2 + "px Arial";
      }
      this.sCtx.fillText(
        line,
        this.x + window.innerWidth / 2,
        this.y + window.innerHeight / 2 + text.indexOf(line) * 45
      );
    });

    setTimeout(async () => {
      this.parent.sCtx.textAlign = "start";
      this.parent.screenUpdater.counter++;
      this.parent.drawer.drawAll();
    }, 4000);
  };
}
