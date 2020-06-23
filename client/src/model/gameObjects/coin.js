import DrawableObject from "./drawableObject.js";

export default class Coin extends DrawableObject {
  constructor(x, y, ctx, hero) {
    super("coin.png", x, y, ctx, 11, 0);

    this.img.style.zIndex = 1;
    this.hero = hero;
  }

  isTouchingHero = () => {
    return this.hero.findDifference(this, 0, 0) < 15;
  };
}
