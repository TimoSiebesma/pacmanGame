export default class TimeBar {
  constructor(x, y, ctx, seconds, parent) {
    this.parent = parent;
    this.x = x;
    this.y = y;
    this.ctx = ctx;
    this.amtSeconds = seconds;
    this.fullLength = 168;
    this.fullTime = 8000;
    this.ratio = this.fullTime / this.fullLength;
    this.timeLeft = 0;
  }

  draw = async () => {
    //increaseTimeLeft gets called in Update(), so every 95ms this.timeLeft gets smaller every update() cycle
    this.ctx.fillStyle = "#b30000";
    this.ctx.fillRect(
      this.x + window.innerWidth / 2,
      this.y + window.innerHeight / 2,
      this.timeLeft / this.ratio,
      18
    );
  };

  increaseTimeLeft = () => {
    this.timeLeft = this.timeLeft > 0 ? this.timeLeft - 95 : 0;
  };
}
