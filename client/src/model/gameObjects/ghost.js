import DrawableObject from "./drawableObject.js";

export default class Ghost extends DrawableObject {
  constructor(x, y, ctx, speed, parent) {
    super("ghost.png", x, y, ctx, 28, speed);
    this.disallowedKeys = [];
    this.img.style.zIndex = 9;
    this.allowedDirections = [];
    this.direction = null;
    this.power = 1;
    this.parent = parent;
    this.directionIndex = 0;
  }

  draw = async () => {
    //ghosts contains a 2/1 dimensions image containing 2 1/1 sprites. directionIndex decides which of the 2 gets shown.
    await this.ctx.drawImage(
      this.img,
      (this.directionIndex * this.img.width) / 2,
      0,
      this.img.width / 2,
      this.img.height,
      this.x + window.innerWidth / 2,
      this.y + window.innerHeight / 2,
      (this.img.width / 2 / this.img.height) * this.size,
      (this.img.height / this.img.height) * this.size
    );
  };

  move = async (filter) => {
    let dir = this.direction;

    if (filter) {
      let chaseDir = "";
      this.findAllowedDirections();
      if (this.power > this.parent.hero.power) {
        chaseDir = this.isChasingPacmanAllowed();
      } else {
        chaseDir = this.isRunningFromPacmanAllowed();
      }

      if (this.allowedDirections.includes(chaseDir)) {
        dir = chaseDir;
      } else {
        this.filterOpposites("Left", "Right");
        this.filterOpposites("Up", "Down");
        dir = this.findDirection();
      }
    }

    if (dir === "Left") {
      this.goLeft();
    } else if (dir === "Right") {
      this.goRight();
    } else if (dir === "Up") {
      this.goUp();
    } else if (dir === "Down") {
      this.goDown();
    }
    this.direction = dir;
  };

  findAllowedDirections = async () => {
    this.allowedDirections = [];

    this.findAllowedDirection(
      this.isDirectionAllowed(this.x - this.speed, this.y, -this.speed, 0),
      "Left"
    );
    this.findAllowedDirection(
      this.isDirectionAllowed(this.x + this.speed, this.y, this.speed, 0),
      "Right"
    );
    this.findAllowedDirection(
      this.isDirectionAllowed(this.x, this.y - this.speed, 0, -this.speed),
      "Up"
    );
    this.findAllowedDirection(
      this.isDirectionAllowed(this.x, this.y + this.speed, 0, this.speed),
      "Down"
    );
  };

  filterOpposites = (side1, side2) => {
    if (this.direction === side1) {
      this.allowedDirections = this.allowedDirections.filter(
        (dir) => dir !== side2
      );
    } else if (this.direction === side2) {
      this.allowedDirections = this.allowedDirections.filter(
        (dir) => dir !== side1
      );
    }
  };

  findAllowedDirection(isAllowed, direction) {
    if (isAllowed) {
      this.allowedDirections.push(direction);
    } else {
      this.allowedDirections = this.allowedDirections.filter(
        (position) => position !== direction
      );
    }
  }

  findDirection = () => {
    return this.allowedDirections[
      Math.floor(Math.random() * this.allowedDirections.length)
    ];
  };

  findDifference = (obj, speedX, speedY) => {
    let x = Math.abs(this.findMiddle().x - obj.findMiddle().x + speedX);
    let y = Math.abs(this.findMiddle().y - obj.findMiddle().y + speedY);
    return Math.sqrt(x * x + y * y);
  };

  goLeft = () => {
    if (this.isDirectionAllowed(this.x - this.speed, this.y, -this.speed, 0)) {
      this.x -= this.speed;
      this.normalize(this.parent.walls);
    }
  };

  goRight = () => {
    if (this.isDirectionAllowed(this.x + this.speed, this.y, this.speed, 0)) {
      this.x += this.speed;
      this.normalize(this.parent.walls);
    }
  };

  goUp = () => {
    if (this.isDirectionAllowed(this.x, this.y - this.speed, 0, -this.speed)) {
      this.y -= this.speed;
      this.normalize(this.parent.walls);
    }
  };

  goDown = () => {
    if (this.isDirectionAllowed(this.x, this.y + this.speed, 0, this.speed)) {
      this.y += this.speed;
      this.normalize(this.parent.walls);
    }
  };

  isBoxArea = (posX, posY) =>
    posX > -65 && posX < +45 && posY > -65 && posY < +45;

  isOuterFieldArea = (posX) => posX < -248 || posX > +224;

  isDisallowedArea = (posX, posY) =>
    this.isBoxArea(posX, posY) || this.isOuterFieldArea(posX, posY);

  isChasingPacmanAllowed = () => {
    if (this.isOnSameRow()) {
      return this.x < this.parent.hero.x ? "Right" : "Left";
    } else if (this.isOnSameCol()) {
      return this.y < this.parent.hero.y ? "Down" : "Up";
    }
    return "";
  };

  isRunningFromPacmanAllowed = () => {
    if (this.isOnSameRow()) {
      return this.x > this.parent.hero.x ? "Right" : "Left";
    } else if (this.isOnSameCol()) {
      return this.y > this.parent.hero.y ? "Down" : "Up";
    }
    return "";
  };

  isOnSameCol = () => {
    if (Math.abs(this.x - this.parent.hero.x) <= 5) {
      if (
        [
          this.rows.includes(this.x),
          this.rows.includes(this.x - 1),
          this.rows.includes(this.x - 2),
          this.rows.includes(this.x - 3),
          this.rows.includes(this.x - 4),
          this.rows.includes(this.x + 1),
          this.rows.includes(this.x + 2),
          this.rows.includes(this.x + 3),
          this.rows.includes(this.x + 4),
        ].includes(true)
      ) {
        return true;
      }
    }
    return false;
  };

  isOnSameRow = () => {
    if (Math.abs(this.y - this.parent.hero.y) <= 5) {
      if (
        [
          this.columns.includes(this.y),
          this.columns.includes(this.y - 1),
          this.columns.includes(this.y - 2),
          this.columns.includes(this.y - 3),
          this.columns.includes(this.y - 4),
          this.columns.includes(this.y + 1),
          this.columns.includes(this.y + 2),
          this.columns.includes(this.y + 3),
          this.columns.includes(this.y + 4),
        ].includes(true)
      ) {
        return true;
      }
    }
    return false;
  };

  isDirectionAllowed = (x, y, xSpeed, ySpeed) => {
    if (this.isDisallowedArea(x, y)) {
      return false;
    }
    for (const wall of this.parent.walls) {
      if (this.findDifference(wall, xSpeed, ySpeed) < 12) {
        return false;
      }
    }
    return true;
  };

  normalize = () => {
    for (const wall of this.parent.walls) {
      let difference = this.findDifference(wall, 0, 0);
      if (difference < 17) {
        let x = Math.abs(this.findMiddle().x - wall.findMiddle().x);
        let y = Math.abs(this.findMiddle().y - wall.findMiddle().y);
        let extra = 17 - difference;
        if (x > y) {
          this.x += this.findMiddle().x > wall.findMiddle().x ? extra : -extra;
        } else {
          this.y += this.findMiddle().y > wall.findMiddle().y ? extra : -extra;
        }
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        break;
      }
    }
  };
}
