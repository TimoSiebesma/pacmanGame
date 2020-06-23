import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import Game from "./game";

class App extends Component {
  render() {
    const App = () => (
      <div>
        <Switch>
          <Route exact path="/" component={Game} />
        </Switch>
      </div>
    );
    return (
      <Switch>
        <App />
      </Switch>
    );
  }
}

export default App;
