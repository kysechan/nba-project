import "./App.css";
import React, { Component } from "react";
import Center from "react-center";
import ReactDOM from "react-dom";
import { Redirect } from "react-router-dom";

class Player extends Component {
  constructor() {
    super();
    this.state = {
      name: "React",
    };
    this.handleChange = this.handleChange.bind(this);
    this.search_player = this.search_player.bind(this);
    this.search_team = this.search_team.bind(this);
    this.response = ""
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  // Get request API player endpoint
  search_player(event) {
    fetch("http://0.0.0.0:8080/api/player/basic?player=" + this.state.value)
      .then((response) => response.json())
      .then((response) => {
        console.log(response)
        this.response = JSON.stringify(response)
        alert(this.response)
        this.forceUpdate()
      })
      .catch((error) => {
        console.error("Error: ", error)
        alert("Could not find player: " + this.state.value)
      })
    event.preventDefault()
  }

  // Get request API player endpoint
  search_team(event) {
    fetch("http://0.0.0.0:8080/api/teams/basic?team=" + this.state.value)
      .then((response) => response.json())
      .then((response) => {
        console.log(response)
        this.response = JSON.stringify(response)
        alert(this.response)
        this.forceUpdate()
      })
      .catch((error) => {
        console.error("Error: ", error)
        alert("Could not find team: " + this.state.value)
      })
    event.preventDefault()
}

  render() {
    return (
      <Center>
        <label>
          Search:
          <input value={this.state.value} onChange={this.handleChange} />
        </label>
        <button onClick={this.search_player}>
          Player
        </button>
        <button onClick={this.search_team}>
          Team
        </button>
        <h4>{this.response}</h4>
      </Center>
    );
  }
}

export default Player;

