import DrawableObject from "./drawableObject.js";

export default class PowerUpCoin extends DrawableObject {
  constructor(x, y, ctx, hero, parent) {
    super("powerUpCoin.png", x, y, ctx, 15, 0);

    this.img.style.zIndex = 1;
    this.hero = hero;
    this.parent = parent;
  }

  isTouchingHero = () => {
    return this.parent.hero.findDifference(this, 0, 0) < 14;
  };
}
