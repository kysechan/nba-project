import "./App.css";
import React, { Component } from "react";
import Center from "react-center";
import ReactDOM from "react-dom";
import { Redirect } from "react-router-dom";
import ReactJson from 'react-json-view'
import { Element } from 'react-scroll'
import Header from './components/Header.jsx'
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
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import Home from "./components/Home"
import SearchResults from "./components/SearchResults"
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const drawerWidth = 255;
const styles = (theme) => ({
  root: {
    backgroundColor: "#393e46",
  },
  appBar: {
    backgroundColor: "#222D3B",
    height: 64,
    display: "block",
  },
  routeResults: {
    display: "block",
  },
});

class App extends Component {

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Header />
        <Home />
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);

