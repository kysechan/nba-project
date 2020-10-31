import './App.css';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Center from 'react-center';
import { Redirect } from 'react-router-dom';

class Simpletextarea extends Component {

  constructor() {
    super();
    this.state = {
      name: "React"
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    fetch('http://0.0.0.0:8080/api/player/basic?player='+this.state.value)
    .then(response => {
      return response.json()
    })
    .then(response => {console.log(response); alert(JSON.stringify(response))})
    .catch(error => {
      console.error('Error:', error);
      alert('Could not find player: ' + this.state.value)
    })
    event.preventDefault()
  }

  

  render() {
    return (
      <Center>
          <div>
            <form onSubmit={this.handleSubmit}>
            <label>Player: </label>
            <input type="textarea" 
              name="player"
              onChange={this.handleChange}
            />
            <input type="submit" value="Submit"/>
            </form>
          </div>
      </Center>
    );
  }
}


export default Simpletextarea;
