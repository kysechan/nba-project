import logo from './logo.svg';
import './App.css';
import React, {Component} from 'react';

function App() {
  ReactDOM.render(
    <h1>Hello, world!</h1>,
    document.getElementById('root')
  );
}





class EssayForm extends React.Component {
  render() {
    return (
      <form>
        <label>
          Name:
          <input type="text" name="name" />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}


export default App;
