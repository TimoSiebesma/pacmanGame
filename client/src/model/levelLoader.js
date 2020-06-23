import Wall from "./gameObjects/wall";
import Coin from "./gameObjects/coin";
import Ghost from "./gameObjects/ghost";
import PowerUpCoin from "./gameObjects/powerUpCoin";
import Hero from "./gameObjects/hero";
import UI from "./ui/ui";
import MessageBox from "./ui/messageBox";
import TimeBar from "./gameObjects/timebar";

export default class LevelLoader {
  constructor(parent, levelData) {
    this.ctx = parent.ctx;
    this.sCtx = parent.sCtx;
    this.levelData = levelData;
    this.parent = parent;
  }

  //is coin allowed (else = powerUpCoin)
  coinAllowed = (obj1, array) => {
    for (const obj2 of array) {
      let x = Math.abs(obj1.x - obj2[0]);
      let y = Math.abs(obj1.y - obj2[1]);
      if (Math.sqrt(x * x + y * y) < 10) return false;
    }

    return true;
  };

  loadLevel = async () => {
    //data comes from JSON document
    let data = await this.levelData["level" + this.parent.level];

    this.parent.hero = new Hero(0, 0, this.parent.ctx, this.parent);
    this.parent.ghosts = await this.loadGhosts(data.Ghosts);
    this.parent.walls = await this.loadWalls(data.Walls, data.WallsExceptions);
    this.parent.coins = await this.loadCoins(data.Coins, data.CoinsExceptions);
    this.parent.powerUpCoins = await this.loadPowerUpCoins(
      data.CoinsExceptions
    );

    this.parent.scoreText = new UI(
      `SCORE: ${this.parent.score}`,
      -183,
      280,
      this.parent.sCtx,
      16,
      0
    );

    this.parent.livesText = new UI(
      `LIVES: ${this.parent.lives}`,
      119,
      280,
      this.parent.sCtx,
      16,
      0
    );

    this.parent.levelText = new UI(
      `LEVEL ${this.parent.level}`,
      -37,
      -255,
      this.parent.sCtx,
      17,
      0
    );

    this.parent.timeBar = new TimeBar(
      -81,
      259.5,
      this.parent.sCtx,
      8,
      this.parent
    );

    this.parent.messagesBox = new MessageBox(40, this.parent);
  };

  loadCoins = async (coinsData, coinsExceptionsData) => {
    let coins = [];

    for (const coinData of coinsData) {
      if (coinData.Start < 0) {
        for (let i = coinData.Start; i < coinData.Repetitions * 5; i += 35.7) {
          if (
            this.coinAllowed({ x: i, y: coinData.Start }, coinsExceptionsData)
          ) {
            coins.push(
              new Coin(i, coinData.Start, this.sCtx, this.parent.hero)
            );
            if (i !== coinData.Start) {
              coins.push(
                new Coin(coinData.Start, i, this.sCtx, this.parent.hero)
              );
            }
          }
        }
      } else {
        for (
          let i = coinData.Start;
          i > coinData.Repetitions * 5 + 35.9;
          i -= 35.9
        ) {
          if (
            this.coinAllowed({ x: i, y: coinData.Start }, coinsExceptionsData)
          ) {
            coins.push(
              new Coin(i, coinData.Start, this.sCtx, this.parent.hero)
            );

            if (i !== coinData.Start) {
              coins.push(
                new Coin(coinData.Start, i, this.sCtx, this.parent.hero)
              );
            }
          }
        }
      }
    }

    return coins;
  };

  loadGhosts = async (ghostsData) => {
    let ghosts = [];

    for (const ghostData of ghostsData) {
      ghosts.push(
        new Ghost(
          ghostData.Width,
          ghostData.Height,
          this.parent.ctx,
          ghostData.Speed,
          this.parent
        )
      );
    }

    return ghosts;
  };

  loadPowerUpCoins = async (coinsExceptionsData) => {
    let powerUpCoins = [];

    for (const coin of coinsExceptionsData) {
      powerUpCoins.push(
        new PowerUpCoin(
          coin[0],
          coin[1],
          this.parent.sCtx,
          this.parent.hero,
          this.parent
        )
      );
    }

    return powerUpCoins;
  };

  loadWalls = async (wallsData, wallsExceptionsData) => {
    let walls = [];
    for (const wallData of wallsData) {
      for (let i = wallData.StartX; i <= wallData.RepetitionsX * 5; i += 10) {
        if (
          !wallsExceptionsData.filter(
            (x) => x[0] === i && x[1] === wallData.StartY
          ).length > 0
        ) {
          walls.push(
            new Wall(i, wallData.StartY, this.parent.wCtx, this.parent.hero)
          );
        }
      }

      for (let i = wallData.StartY; i <= wallData.RepetitionsY * 5; i += 10) {
        if (
          !wallsExceptionsData.filter(
            (x) => x[0] === wallData.StartX && x[1] === i
          ).length > 0
        ) {
          walls.push(
            new Wall(wallData.StartX, i, this.parent.wCtx, this.parent.hero)
          );
        }
      }
    }
    return walls;
  };
}
