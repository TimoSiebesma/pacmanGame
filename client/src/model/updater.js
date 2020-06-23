export default class Updater {
  constructor(parent) {
    this.parent = parent;
    this.counter = 0;
    this.gameOverMessage = true;
  }

  update = () => {
    setInterval(async () => {
      await this.beginningConditions();

      if (!this.parent.pause && window.innerWidth > 500) {
        if (this.counter > 0) {
          this.counter++;
        }

        if (this.parent.lives > 0) {
          await this.endOfLevelConditions();

          this.ghostTimeBarConditions();

          if (this.parent.key !== null && this.counter > 0) {
            await this.heroKeysConditions();

            this.ghostMovementConditions();

            this.parent.hero.checkCoinTouches();

            this.parent.hero.checkPowerUpCoinTouches();

            this.parent.hero.checkGhostTouches();

            await this.parent.drawer.drawCanvas();
          }
        } else if (this.gameOverMessage) {
          this.parent.setGameStatus("Highscores");
        }
      }
    }, 95);
  };

  async beginningConditions() {
    if (this.counter === 0) {
      await this.parent.messagesBox.alert([
        this.parent.level === 8 ? "Final Level" : "Level " + this.parent.level,
        " KEYS:  ← → ↑ ↓",
        "PAUSE & PLAY:  [ space ] ",
      ]);
    }
  }
  async endOfLevelConditions() {
    if (
      this.parent.level === 8 &&
      this.parent.coins.length < 1 &&
      this.parent.powerUpCoins.length < 1
    ) {
      this.parent.setGameStatus("Highscores");
    } else if (
      this.parent.coins.length < 1 &&
      this.parent.powerUpCoins.length < 1 &&
      this.parent.level < 9
    ) {
      this.parent.lives++;
      this.parent.level++;
      await this.parent.levelLoader.loadLevel();
      this.counter = 0;
    }
  }

  ghostMovementConditions() {
    if ([0, 1, 2, 3].includes(this.counter % 5)) {
      this.parent.ghosts.map((ghost) => {
        ghost.move(true);
      });
    } else {
      this.parent.ghosts.map((ghost) => ghost.move(false));
    }
  }

  ghostTimeBarConditions() {
    if (this.parent.timeBar.timeLeft > 0) {
      this.parent.timeBar.increaseTimeLeft();
      this.parent.drawer.drawStillCanvas();
    }
  }

  async heroKeysConditions() {
    let succes = await this.parent.tKey.checkKeys(
      this.parent.key,
      this.parent.hero
    );
    if (!succes && this.parent.secondaryKey !== "") {
      this.parent.key = this.parent.secondaryKey;
      this.parent.secondaryKey = "";
    } else {
      this.parent.tKey.smoothenCorners();
      this.parent.hero.normalize();
      this.parent.secondaryKey = "";
    }
  }
}
