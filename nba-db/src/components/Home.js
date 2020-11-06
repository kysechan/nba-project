import React, { Component } from 'react';
import { LinkContainer } from "react-router-bootstrap";
import ReactJson from 'react-json-view'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SearchComponent from './SearchComponent';
import Center from "react-center";

//Table stuff
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  resultsContainer: {
    marginTop: '30px',
  },
  homeContainer: {
    marginTop: '30px'
  }
});
class Home extends Component {
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

    if (this.state.searchValue != "") {
      console.log('A name was submitted: ' + this.state.searchValue);
    }
    event.preventDefault();
  }

  // Get request API player endpoint
  search_player(event) {
    fetch("https://164.90.149.249:8080/api/player/basic?player=" + this.state.value)
      .then((response) => response.json())
      .then((response) => {
        console.log(response)
        this.json = response
        this.response = JSON.stringify(response)
        //alert(this.response)
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
        //alert(this.response)
        this.forceUpdate()
      })
      .catch((error) => {
        console.error("Error: ", error)
        alert("Could not find team: " + this.state.value)
      })
    event.preventDefault()
  }
  render() {
    const { classes, theme } = this.props;
    let element;
    if (this.json !== "") {
      element = <ReactJson src={this.json} />
    }
    return (
      <div className={classes.homeContainer}>
        {/* <div className={classes.searchContainer}>
                <SearchComponent/>
              </div> */}
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
        </Center>
        {false && this.json != "" && <Center className={classes.resultsContainer}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Statistic</TableCell>
                  <TableCell align="right">Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  Object.keys(this.json.object).map((key, i) => (
                    <TableRow key={i}>
                      <TableCell >{key}</TableCell>
                      <TableCell align="right">{this.json.object[key]}</TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Center>
        }
        <Center className={classes.resultsContainer}>
          {element}
        </Center>

      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Home);
