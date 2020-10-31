import logo from './logo.svg';
import './App.css';
import React, {Component} from 'react';

function App() {
  return (
    <div className="App">
       Hello World !
    </div>
 );
}


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
      <div>
        <label>Enter value : </label>
        <input type="textarea" 
          name="textValue"
          onChange={this.handleChange}
        />
      </div>
    );
  }
}


// export default App;
export default Simpletextarea;
