export default class Keys {
  constructor(parent) {
    this.parent = parent;
  }

  checkKeys = async (key) => {
    if (key === "ArrowLeft") {
      return await this.heroGoLeft();
    }

    if (key === "ArrowRight") {
      return await this.heroGoRight();
    }

    if (key === "ArrowUp") {
      return await this.heroGoUp();
    }

    if (key === "ArrowDown") {
      return await this.heroGoDown();
    }

    return true;
  };

  handleKeyDown = async (event) => {
    if (event.code === "Space") {
      this.parent.pause = !this.parent.pause;
    } else if (
      ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
    ) {
      let secondaryKey = this.parent.key;
      let key = event.key;

      if (key === secondaryKey) {
        this.parent.key = event.key;
        this.parent.secondaryKey = "";
      } else {
        this.parent.key = event.key;
        this.parent.secondaryKey = secondaryKey;
      }
    }
  };

  heroGoLeft = async () => {
    if (!this.parent.hero.disallowedKeys.includes("ArrowLeft")) {
      for (let wall of this.parent.walls) {
        if (
          this.parent.hero.findDifference(wall, -this.parent.hero.speed, 0) <
          13 - (this.parent.hero.speed > 7 ? 1 : 0)
        ) {
          return false;
        }
      }

      this.parent.hero.directionIndex = 2;
      this.parent.hero.x -= this.parent.hero.speed;

      await this.parent.drawer.drawCanvas();
      this.parent.hero.normalize();
      return true;
    }
  };

  heroGoRight = async () => {
    if (!this.parent.hero.disallowedKeys.includes("ArrowRight")) {
      for (const wall of this.parent.walls) {
        if (
          this.parent.hero.findDifference(wall, this.parent.hero.speed, 0) <
          13 - (this.parent.hero.speed > 7 ? 1 : 0)
        ) {
          return false;
        }
      }

      this.parent.hero.directionIndex = 0;
      this.parent.hero.x += this.parent.hero.speed;

      await this.parent.drawer.drawCanvas();
      this.parent.hero.normalize();
      return true;
    }
  };

  heroGoUp = async () => {
    if (!this.parent.hero.disallowedKeys.includes("ArrowUp")) {
      for (const wall of this.parent.walls) {
        if (
          this.parent.hero.findDifference(wall, 0, -this.parent.hero.speed) <
          13 - (this.parent.hero.speed > 7 ? 1 : 0)
        ) {
          return false;
        }
      }

      this.parent.hero.directionIndex = 3;
      this.parent.hero.y -= this.parent.hero.speed;

      await this.parent.drawer.drawCanvas();
      this.parent.hero.normalize();
      return true;
    }
  };

  heroGoDown = async () => {
    if (!this.parent.hero.disallowedKeys.includes("ArrowDown")) {
      for (const wall of this.parent.walls) {
        if (
          this.parent.hero.findDifference(wall, 0, +this.parent.hero.speed) <
          13 - (this.parent.hero.speed > 7 ? 1 : 0)
        ) {
          return false;
        }
      }
      this.parent.hero.directionIndex = 1;
      this.parent.hero.y += this.parent.hero.speed;

      await this.parent.drawer.drawCanvas();
      this.parent.hero.normalize();
      return true;
    }
  };

  smoothenCorners = () => {
    switch (this.parent.secondaryKey) {
      case "ArrowLeft":
        this.parent.hero.x -= this.parent.hero.speed / 3;
        break;
      case "ArrowRight":
        this.parent.hero.x += this.parent.hero.speed / 3;
        break;
      case "ArrowUp":
        this.parent.hero.y -= this.parent.hero.speed / 3;
        break;
      case "ArrowDown":
        this.parent.hero.y += this.parent.hero.speed / 3;
        break;
    }
  };
}
