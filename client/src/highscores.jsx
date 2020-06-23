import React, { Component } from "react";

class Highscores extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        {this.props.parent.state.highscoresNotYetSubmitted ? (
          <div className="highscoresContainer">
            <div className="highscoresTitle">HIGHSCORES</div>
            <div className="scoresContainer">
              {this.props.parent.highscoresLoader.writeOutHighscores()}
            </div>
            <div>
              {" "}
              <form id="highscoresForm" action="">
                {" "}
                <input
                  type="text"
                  name="username"
                  id=""
                  placeholder="Username"
                  className="usernameInput"
                />{" "}
                <span className="scoreInput">{this.props.parent.score}</span>
                <input
                  type="submit"
                  value="Submit"
                  onClick={
                    this.props.parent.highscoresLoader.dealWithHighscores
                  }
                  className="buttonInput"
                />
              </form>
            </div>
          </div>
        ) : (
          <React.Fragment>
            <div className="highscoresContainer2">Thank You For Playing!</div>
            <div
              onClick={this.props.parent.refreshWindow}
              className="playAgainButton"
            >
              PLAY AGAIN
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default Highscores;
