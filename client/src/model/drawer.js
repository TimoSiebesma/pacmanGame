export default class Drawer {
  constructor(parent) {
    this.parent = parent;
  }

  clearAll = async () => {
    if (this.parent.stillCanvas.current) {
      await this.parent.sCtx.clearRect(
        0,
        0,
        this.parent.stillCanvas.current.width,
        this.parent.stillCanvas.current.height
      );
    }
    if (this.parent.canvas.current) {
      await this.parent.ctx.clearRect(
        0,
        0,
        this.parent.canvas.current.width,
        this.parent.canvas.current.height
      );
    }
    if (this.parent.wCanvas.current) {
      await this.parent.wCtx.clearRect(
        0,
        0,
        this.parent.wCanvas.current.width,
        this.parent.wCanvas.current.height
      );
    }
  };

  drawAll = async () => {
    await this.parent.drawer.clearAll();

    this.parent.walls.map(async (wall) => await wall.draw());
    this.parent.coins.map(async (coin) => await coin.draw());
    await this.parent.powerUpCoins.map((pCoin) => pCoin.draw());
    await this.parent.hero.draw();
    await this.parent.scoreText.draw();
    await this.parent.levelText.draw();

    await this.parent.livesText.draw();
    this.parent.ghosts.map(async (ghost) => await ghost.draw());
  };

  drawCanvas = async () => {
    await this.parent.ctx.clearRect(
      0,
      0,
      this.parent.canvas.current.width,
      this.parent.canvas.current.height
    );

    await this.parent.hero.draw();

    if (this.parent.hero.power < this.parent.ghosts[0].power) {
      for (const ghost of this.parent.ghosts) {
        ghost.directionIndex = 0;
      }
    }

    if (this.parent.hero.power > this.parent.ghosts[0].power) {
      for (const ghost of this.parent.ghosts) {
        ghost.directionIndex = 1;
      }
    }

    await this.parent.ghosts.map(async (ghost) => await ghost.draw());
  };

  drawStillCanvas = async () => {
    await this.parent.sCtx.clearRect(
      0,
      0,
      this.parent.stillCanvas.current.width,
      this.parent.stillCanvas.current.height
    );

    await this.parent.timeBar.draw();
    await this.parent.coins.map((coin) => coin.draw());
    await this.parent.powerUpCoins.map((pCoin) => pCoin.draw());
    await this.parent.scoreText.draw();
    await this.parent.livesText.draw();
    await this.parent.levelText.draw();
  };
}
