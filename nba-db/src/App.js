import "./App.css";
import React, { Component } from "react";
import Center from "react-center";
import ReactDOM from "react-dom";
import { Redirect } from "react-router-dom";
import ReactJson from 'react-json-view'

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
    this.json = ""
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  // Get request API player endpoint
  search_player(event) {
    fetch("http://164.90.149.249:8080/api/player/basic?player=" + this.state.value)
      .then((response) => response.json())
      .then((response) => {
        console.log(response)
        this.json = response
        this.response = JSON.stringify(response)
        // alert(this.response)
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
    fetch("http://164.90.149.249:8080/api/teams/basic?team=" + this.state.value)
      .then((response) => response.json())
      .then((response) => {
        console.log(response)
        this.response = JSON.stringify(response)
        this.json = response
        // alert(this.response)
        this.forceUpdate()
      })
      .catch((error) => {
        console.error("Error: ", error)
        alert("Could not find team: " + this.state.value)
      })
    event.preventDefault()
}

  render() {
    let element;
    if (this.json !== "") {
      element = <ReactJson src={this.json} />
    }
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
        {element}
      </Center>
    );
  }
}

export default Player;

