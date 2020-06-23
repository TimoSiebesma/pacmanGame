import React, { Component } from "react";
import fetch from "node-fetch";

export default class HighscoresLoader {
  constructor(parent) {
    this.parent = parent;
  }

  dealWithHighscores = async (e) => {
    let formData = new FormData(document.getElementById("highscoresForm"));
    let name = formData.get("username");
    e.preventDefault();
    let highscore = { username: name, score: this.parent.score };
    await this.parent.setState({ highscoresNotYetSubmitted: false });

    if (
      this.parent.state.highscores.filter(
        (hs) =>
          hs.userName === highscore.username && hs.score === highscore.score
      ).length === 0 &&
      highscore.score !== 0
    ) {
      await fetch("/highscoresPost", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(highscore),
      });
    }
  };

  async getHighscores() {
    let y = await fetch("/highscoresGet");
    let highscores = await y.json();

    this.parent.setState({ highscores });
    console.log(this.parent.state.highscores);
  }

  writeOutHighscores = () => {
    return this.parent.state.highscores.map((highscore) => (
      <div
        className="scoreLine"
        key={this.parent.state.highscores.indexOf(highscore) + 1}
      >
        <div className="scoresName">
          {this.parent.state.highscores.indexOf(highscore) + 1}.{" "}
          {highscore.username}
        </div>
        <div className="scoresScore">{highscore.score}</div>
      </div>
    ));
  };
}
