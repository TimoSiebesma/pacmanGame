import DrawableObject from "./drawableObject.js";

export default class Hero extends DrawableObject {
  constructor(x, y, ctx, parent) {
    super("hero.png", x, y, ctx, 28, 7);
    this.disallowedKeys = [];
    this.img.style.zIndex = 10;
    this.power = 0;
    this.powerUps = 0;
    this.parent = parent;
    this.directionIndex = 0;
  }

  checkCoinTouches = async () => {
    for (const coin of this.parent.coins) {
      if (coin.isTouchingHero()) {
        this.parent.coins = this.parent.coins.filter((c) => c !== coin);
        let previousIndex = this.parent.hero.directionIndex;
        this.parent.hero.directionIndex = 4;
        await this.parent.increaseScore(1);
        await this.parent.drawer.drawStillCanvas();
        setTimeout(() => {
          this.parent.hero.directionIndex = previousIndex;
        }, 10);

        break;
      }
    }
  };

  checkPowerUpCoinTouches = async () => {
    for (const coin of this.parent.powerUpCoins) {
      if (coin.isTouchingHero()) {
        this.parent.powerUpCoins = this.parent.powerUpCoins.filter(
          (c) => c !== coin
        );
        await this.parent.drawer.drawStillCanvas();

        await this.powerUp();
        setTimeout(async () => {
          await this.powerDown();
        }, 8000);
        break;
      }
    }
  };

  checkGhostTouches = async () => {
    for (const ghost of this.parent.ghosts) {
      if (this.findDifference(ghost, 0, 0) < 14) {
        if (this.power < ghost.power) {
          await this.die();
          this.parent.decreaseLives();
          this.parent.key = null;
          break;
        } else {
          //remove ghost from screen (outside of screen)
          ghost.x = window.innerWidth * 2 + 10;
          ghost.y = window.innerHeight / 2 - 7;
          this.parent.increaseScore(10);

          setTimeout(() => {
            //respawn in middle of screen
            ghost.x = 50;
            ghost.y = 7;
          }, 3500);
        }
      }
    }
  };

  die = () => {
    this.parent.lives--;
    this.x = 0;
    this.y = 0;
    this.directionIndex = 0;
  };

  draw = async () => {
    //hero uses 5/1 dimensions image containing 5 1/1 sprites. directionIndex decides which of the 5 gets shown.
    await this.ctx.drawImage(
      this.img,
      (this.directionIndex * this.img.width) / 5,
      0,
      this.img.width / 5,
      this.img.height,
      this.x + window.innerWidth / 2,
      this.y + window.innerHeight / 2,
      (this.img.width / 5 / this.img.height) * this.size,
      (this.img.height / this.img.height) * this.size
    );
  };

  findDifference = (obj, speedX, speedY) => {
    let x = Math.abs(this.findMiddle().x - obj.findMiddle().x + speedX);
    let y = Math.abs(this.findMiddle().y - obj.findMiddle().y + speedY);
    return Math.sqrt(x * x + y * y);
  };

  //keeps pacman from moving inside the walls too much
  normalize = () => {
    for (const wall of this.parent.walls) {
      let difference = this.findDifference(wall, 0, 0);
      if (difference < 18 - (this.parent.hero.speed > 7 ? 1 : 0)) {
        let x = Math.abs(this.findMiddle().x - wall.findMiddle().x);
        let y = Math.abs(this.findMiddle().y - wall.findMiddle().y);
        let extra = 18 - (this.parent.hero.speed > 7 ? 1 : 0) - difference;

        if (x > y) {
          this.x += this.findMiddle().x > wall.findMiddle().x ? extra : -extra;
        } else {
          this.y += this.findMiddle().y > wall.findMiddle().y ? extra : -extra;
        }

        break;
      }
    }
    if (this.x < -260) {
      this.x += 500;
    } else if (this.x > +240) {
      this.x -= 500;
    } else if (this.y < -260) {
      this.y += 500;
    } else if (this.y > +240) {
      this.y -= 500;
    }
  };

  powerUp = () => {
    this.powerUps++;
    this.power = 2;
    this.speed = 9;
    this.parent.timeBar.timeLeft = 8000;
  };

  powerDown = () => {
    this.powerUps--;
    if (this.powerUps === 0) {
      this.speed = 7;
      this.power = 0;
    }
  };

  resetDisallowedKeys = () => {
    this.disallowedKeys = [];
  };
}
