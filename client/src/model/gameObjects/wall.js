import DrawableObject from "./drawableObject.js";

export default class Wall extends DrawableObject {
  constructor(x, y, ctx) {
    super("wall.png", x, y, ctx, 10, 0);

    this.img.style.zIndex = 1;
  }
}
