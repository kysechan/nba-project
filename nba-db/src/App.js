import logo from './logo.svg';
import './App.css';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Center from 'react-center';

class Simpletextarea extends Component {
  constructor() {
    super();
    this.state = {
      name: "React"
    };
  }

  handleChange(event) {
    console.log(event.target.value)
  }

  render() {
    return (
      <Center>
        <div>
          <label>Enter value : </label>
          <input type="textarea" 
            name="textValue"
            onChange={this.handleChange}
          />
        </div>
      </Center>
    );
  }
}


export default Simpletextarea;
