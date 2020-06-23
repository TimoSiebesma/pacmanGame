import React, { Component } from "react";
import Keys from "./model/keys";
import UI from "./model/ui/ui.js";
import LevelData from "./levels.json";
import LevelLoader from "./model/levelLoader";
import Drawer from "./model/drawer";
import Updater from "./model/updater";
import Highscores from "./highscores";
import HighscoresLoader from "./model/highscoresLoader";

class Game extends Component {
  async componentDidMount() {
    //highscores methods are in HighscoresLoader
    this.highscoresLoader = new HighscoresLoader(this);
    this.setState({ highscores: this.highscoresLoader.getHighscores() });

    if (window.innerWidth > 500) {
      //stillCanvas: only gets updated when still elements change (coin captures, ui changes...)
      this.sCtx = await this.stillCanvas.current.getContext("2d");
      //canvas: contains all the moving elements (ghosts, hero, timebar...)
      this.ctx = await this.canvas.current.getContext("2d");
      //wallsCanvas: contains the walls, which only get drawn at the beginning of a level
      this.wCtx = await this.wCanvas.current.getContext("2d");

      //levelData is in JSON document
      let data = await LevelData;

      //levelLoader contains all methods related to uploading data at the beginning of a level
      this.levelLoader = new LevelLoader(this, data);

      //screenUpdater contains everything related to updates which happen every 95ms.
      this.screenUpdater = new Updater(this);

      //everything related to drawing elements to the screen
      this.drawer = new Drawer(this);

      //contains all methods related to key presses
      this.tKey = new Keys(this);

      //load level 1
      await this.levelLoader.loadLevel();

      //eventListeners
      window.addEventListener("resize", this.updateWindowDimensions);
      document.addEventListener("keydown", this.tKey.handleKeyDown, false);

      //Start the game
      this.screenUpdater.update();
    }
  }

  constructor() {
    super();
    this.wCanvas = React.createRef();
    this.canvas = React.createRef();
    this.stillCanvas = React.createRef();

    this.lives = 3;
    this.level = 1;
    this.score = 0;

    this.pause = false;
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.tKey.handleKeyDown, false);
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  state = {
    canvasWidth: window.innerWidth,
    canvasHeight: window.innerHeight,
    gameStatus: "Game",
    highscores: [],
    highscoresNotYetSubmitted: true,
  };

  render() {
    return (
      <React.Fragment>
        {window.innerWidth > 500 ? (
          <React.Fragment>
            {this.state.gameStatus === "Game" && (
              <React.Fragment>
                <canvas
                  ref={this.stillCanvas}
                  className="stillCanvasContainer"
                  width={this.state.canvasWidth + "px"}
                  height={this.state.canvasHeight + "px"}
                />
                <canvas
                  width={this.state.canvasWidth + "px"}
                  height={this.state.canvasHeight + "px"}
                  className="wCanvasContainer"
                  ref={this.wCanvas}
                />
                <canvas
                  width={this.state.canvasWidth + "px"}
                  height={this.state.canvasHeight + "px"}
                  className="canvasContainer"
                  ref={this.canvas}
                />
              </React.Fragment>
            )}
            {this.state.gameStatus === "Highscores" && (
              <Highscores parent={this} />
            )}
          </React.Fragment>
        ) : (
          <div className="errorContainer">
            Please open game on a screen with bigger dimensions
            (desktop/laptop).
          </div>
        )}
      </React.Fragment>
    );
  }

  //region ui updates
  decreaseLives = () => {
    this.livesText = new UI(`LIVES: ${this.lives}`, 119, 280, this.sCtx, 16, 0);

    this.drawer.drawStillCanvas();
  };

  increaseLevel = () => {
    this.livesText = new UI(`LEVEL ${this.level}`, -37, -255, this.sCtx, 17, 0);

    this.drawer.drawStillCanvas();
  };

  increaseScore = (sc) => {
    let widthOffset =
      this.score > 9999
        ? 20
        : this.score > 999
        ? 15
        : this.score > 99
        ? 10
        : this.score > 9
        ? 5
        : 0;

    this.score = Math.ceil(this.score + sc * (1 + (this.level - 1) / 5));

    this.scoreText = new UI(
      `SCORE: ${this.score}`,
      -183,
      280,
      this.sCtx,
      16,
      widthOffset
    );
    this.drawer.drawStillCanvas();
  };
  //region end

  refreshWindow = () => {
    window.location.reload(false);
  };

  setGameStatus = (gameStatus) => {
    this.setState({ gameStatus });
  };

  updateWindowDimensions = async () => {
    await this.setState({
      canvasWidth: window.innerWidth,
      canvasHeight: window.innerHeight,
    });

    if (this.lives > 0 && window.innerWidth > 500) {
      await this.drawer.drawStillCanvas();
      await this.drawer.drawCanvas();
      this.walls.map(async (wall) => await wall.draw());
    }
  };
}

export default Game;
