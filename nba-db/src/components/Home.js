import React, { Component } from 'react';
import { LinkContainer } from "react-router-bootstrap";
import ReactJson from 'react-json-view'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SearchComponent from './SearchComponent';
import Center from "react-center";
import { Element } from 'react-scroll'
import TextField from '@material-ui/core/TextField'

//Material UI
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenufdropItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { DataGrid } from "@material-ui/data-grid";

import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

const stage_options = ["regular", "playoffs"];
const default_stage = stage_options[0];


const styles = (theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  resultsContainer: {
    marginTop: "30px",
  },
  homeContainer: {
    marginTop: "30px",
  },
  table: {
    minWidth: 650,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 100,
  },
});



class Home extends Component {
  constructor() {
    super();
    this.state = {
      name: "React",
      showMe:false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleYear = this.handleYear.bind(this);
    this.handleStage = this.handleStage.bind(this);
    this.search_player = this.search_player.bind(this);
    this.search_team = this.search_team.bind(this);
    this.clear_json = this.clear_json.bind(this);
    this.show_table = false;
    this.response = ""
    this.json = ""
    this.player_list = []
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleYear(event){
    this.setState({ year: event.target.value });
  }

  handleStage(event){
    this.setState({stage: event.target.value});
  }

  clear_json(){
    this.player_list = []
    this.show_table = false;
    this.forceUpdate()
  }

  // Get request API player endpoint
  search_player(event) {
    fetch("https://164.90.149.249:8080/api/player/basic?player=" + this.state.value + "&year=" + this.state.year + "&stage=" + this.state.stage)
      .then((response) => response.json())
      .then((response) => {
        console.log(response)
        this.json = response
        this.player_list.push(this.json)
        console.log(this.player_list)
        this.response = JSON.stringify(response)
        this.show_table = true
        this.forceUpdate()
      })
      .catch((error) => {
        console.error("Error: ", error)
        alert("Could not find player: " + this.state.value)
        // this.show_table = false
      })
    event.preventDefault()
  }

  // Get request API player endpoint
  search_team(event) {
    fetch("https://164.90.149.249:8080/api/teams/basic?team=" + this.state.value)
      .then((response) => response.json())
      .then((response) => {
        console.log(response)
        this.json = response
        this.response = JSON.stringify(response)
        this.show_table = true
        this.forceUpdate();
      })
      .catch((error) => {
        console.error("Error: ", error)
        alert("Could not find team: " + this.state.value)
        // this.show_table = false
      })
    event.preventDefault()
  }


  render() {
    const { classes, theme } = this.props;
    let element;
    return (
      <div className={classes.root}>
        {/* <Home /> */}
        <Element
          className="element"
          id="containerElement"
          style={{
            position: "relative",
            overflow: "hidden",
            width: "100%",
            marginTop: "65px",
          }}
        >
          {/* /* <div className={classes.routeResults}>
            <Routes childProps={this.childProps}/>
          </div> */}
          <Center>
            <TextField
              className="Search-bar"
              id="standard-basic"
              label="SEARCH FOR A PLAYER OR TEAM e.g Lebron James or Lakers"
              type="search"
              value={this.state.value}
              onChange={this.handleChange}
            />
            <TextField
              className="year"
              id="standard-basic"
              label="Year"
              type="search"
              value={this.state.year}
              onChange={this.handleYear}
            />
            <FormControl required className={classes.formControl}>
              <InputLabel id="demo-simple-select-required-label">
                Stage
              </InputLabel>
              <Select
                labelId="demo-simple-select-required-label"
                id="demo-simple-select-required"
                value={this.state.stage}
                onChange={this.handleStage}
                className={classes.selectEmpty}
              >
                <MenuItem value={"regular"}>Regular Season</MenuItem>
                <MenuItem value={"playoffs"}>Playoffs</MenuItem>
              </Select>
              <FormHelperText>Required</FormHelperText>
            </FormControl>
            <Button variant="contained" onClick={this.search_player}>
              Player
            </Button>
            <Button variant="contained" onClick={this.search_team}>
              Team
            </Button>
            <Button variant="contained" onClick={this.clear_json}>
              Clear
            </Button>
          </Center>
          {this.show_table ? (
            <div>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Player Name</TableCell>
                      <TableCell align="right">Team</TableCell>
                      <TableCell align="right">Season</TableCell>
                      <TableCell align="right">Stage</TableCell>
                      <TableCell align="right">Points Scored</TableCell>
                      <TableCell align="right">Assists</TableCell>
                      <TableCell align="right">Games Played</TableCell>
                      <TableCell align="right">Minutes Played</TableCell>
                      <TableCell align="right">FG Made</TableCell>
                      <TableCell align="right">FG Attempted</TableCell>
                      <TableCell align="right">3-P Made</TableCell>
                      <TableCell align="right">3-P Attempted</TableCell>
                      <TableCell align="right">FT Made</TableCell>
                      <TableCell align="right">FT Attempted</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.player_list.map((player) => (
                      <TableRow key={player.Player}>
                        <TableCell component="th" scope="row">
                          {player.Player}
                        </TableCell>
                        <TableCell align="right">{player.Team}</TableCell>
                        <TableCell align="right">{player.Season}</TableCell>
                        <TableCell align="right">{player.Stage}</TableCell>
                        <TableCell align="right">{player.PTS}</TableCell>
                        <TableCell align="right">{player.AST}</TableCell>
                        <TableCell align="right">{player.GP}</TableCell>
                        <TableCell align="right">{player.MIN}</TableCell>
                        <TableCell align="right">{player.FGM}</TableCell>
                        <TableCell align="right">{player.FGA}</TableCell>
                        <TableCell align="right">{player["3PM"]}</TableCell>
                        <TableCell align="right">{player["3PA"]}</TableCell>
                        <TableCell align="right">{player.FTM}</TableCell>
                        <TableCell align="right">{player.FTA}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ) : null}
        </Element>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
