import "./App.css";
import React, { Component } from "react";
import Center from "react-center";
import ReactDOM from "react-dom";
import { Redirect } from "react-router-dom";
import ReactJson from 'react-json-view'
import { Element } from 'react-scroll'
// Routes
import { withRouter } from "react-router-dom";
import Routes from "./Routes";

// Material UI
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Navbar from "./components/Navbar";
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import PropTypes from 'prop-types';

import axios from 'axios';
import https from 'https'


const drawerWidth = 255;

const styles = theme => ({
  root: {
    backgroundColor:'#4d4d4d',
  },
  appBar: {
    backgroundColor:'#222D3B',
    height: 64,
    display:'block',
  },
  routeResults:{
    display:'block',
  },
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: "React",
    };
    this.handleChange = this.handleChange.bind(this);
    //this.handleSubmit = this.handleSubmit(this);
    this.search_player = this.search_player.bind(this);
    this.search_team = this.search_team.bind(this);
    this.response = ""
    this.json = ""
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    
    if(this.state.searchValue != "") {
      console.log('A name was submitted: ' + this.state.searchValue);
    }
    event.preventDefault();
  }




  // Get request API player endpoint
  search_player(event) {
    const agent = new https.Agent({  
      rejectUnauthorized: false
    });
    axios.get("https://164.90.149.249:8080/api/player/basic?player2=" + this.state.value, {httpsAgent: agent})
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
    fetch("https://164.90.149.249:8080/api/teams/basic?team=" + this.state.value)
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
    const { classes } = this.props;
    const childProps = {
    
    };
    let element;
    if (this.json !== "") {
      element = <ReactJson src={this.json} />
    }
    return (
      <div className={classes.root}>
        <AppBar position="absolute" className={classes.appBar}>
          <Navbar />
        </AppBar>
        <Element className="element" id="containerElement" 
            style={{
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
              marginTop: '64px',
            }}>
          <div className={classes.routeResults}>
            <Routes childProps={this.childProps}/>
          </div>
        </Element>
        
      </div>

      
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);

