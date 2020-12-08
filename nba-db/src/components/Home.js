import React, { Component } from "react";
import { LinkContainer } from "react-router-bootstrap";
import ReactJson from "react-json-view";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import SearchComponent from "./SearchComponent";
import static_players from "./StaticPlayerList";
import Center from "react-center";
import { Element } from "react-scroll";
import Theme from "./theme";
import { ThemeProvider } from "@material-ui/core/styles";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

//Material UI
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Autocomplete from "@material-ui/lab/Autocomplete";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { DataGrid } from "@material-ui/data-grid";

import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Chart from "./Recharts";
import dynamicData from "./Recharts.js";
import SelectStage from "./SelectStage";

import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";

const WhiteTextTypography = withStyles({
  root: {
    color: "#FFFFFF",
  },
})(Typography);

const stage_options = ["regular", "playoffs"];
const default_stage = stage_options[0];

const API_IP = 'localhost'; //"165.227.31.0";

let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

const styles = (theme) => ({
  inputRoot: {
    // color: "purple",
    // ".MuiOutlinedInput-notchedOutline": {
    //   borderColor: "green",
    // },
    // ".MuiOutlinedInput-notchedOutline": {
    //   borderColor: "red",
    // },
    // ".MuiOutlinedInput-notchedOutline": {
    //   borderColor: "purple",
    // },
    // ".MuiAutocomplete": {
    //   color: "black",
    // },
  },
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
  stage_select: {
    margin: theme.spacing(1),
    minWidth: 100,
  },
  filter_select: {
    margin: theme.spacing(1),
    minWidth: 100,
  },
  FormControl: {
    margin: theme.spacing(1),
    minWidth: 100,
  },
  autocomplete: {
    minWidth: "300px",
    // text: "color",
    // background: 'white'
  },
  multilineColor: {
    color: "white",
  },
});

async function get_autcompete_props() {
  try {
    const resp = await fetch("https://localhost:8080/api/player/all");
    const data = await resp.json();
    console.log(data.players);
    return data.players;
  } catch (err) {
    console.log(err);
  }
}
console.log(static_players.static_players);

class Home extends Component {
  constructor() {
    super();
    this.state = {
      name: "React",
      showMe: false,
      data: [],
      disable_filter: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleYear = this.handleYear.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleStage = this.handleStage.bind(this);
    this.search_player = this.search_player.bind(this);
    this.clear = this.clear.bind(this);
    this.handleAutoCompleteChange = this.handleAutoCompleteChange.bind(this);
    this.clearAutocomplete = this.clearAutocomplete.bind(this);
    this.show_table = false;
    this.response = "";
    this.json = "";
    this.clear_search = false;

    this.player_list = [];

    this.autocompleteProps = {
      options: static_players.static_players,
      getOptionLabel: (option) => option.player,
    };
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleYear(event) {
    this.setState({ year: event.target.value });
  }

  handleStage(event) {
    this.setState({ stage: event.target.value });
  }

  handleFilter(event) {
    this.setState({ filter: event.target.value });
    this.forceUpdate();
  }

  toggleTable() {
    this.show_table = true;
  }

  handleAutoCompleteChange = (event, values) => {
    if (values != null) {
      this.setState(
        {
          value: values.player,
        },
        () => {
          console.log(this.state.value);
        }
      );
    }
  };

  clearAutocomplete(event, values) {
    values.player = null;
  }

  clear() {
    this.player_list = [];
    this.show_table = false;
    this.state.data = [];
    this.state.disable_filter = false;
    this.value = null;
    this.state.searchText = "";
    this.clear_search = true;
    this.forceUpdate();
  }

  // Get request API player endpoint
  search_player(event) {
    fetch(
      "https://" +
        API_IP +
        ":8080/api/player/basic?player=" +
        this.state.value +
        "&year=" +
        this.state.year +
        "&stage=" +
        this.state.stage
    )
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        this.json = response;
        this.player_list.push(this.json);
        console.log(this.player_list);
        this.response = JSON.stringify(response);
        this.toggleTable();
        this.state.data = this.state.data.concat(response);
        this.forceUpdate();
      })
      .catch((error) => {
        console.error("Error: ", error);
        console.log(
          "https://" +
            API_IP +
            ":8080/api/player/basic?player=" +
            this.state.value +
            "&year=" +
            this.state.year +
            "&stage=" +
            this.state.stage
        );
        alert(
          "Could not find player: " +
            this.state.value +
            this.state.year +
            this.state.stage
        );
      });
    event.preventDefault();
  }

  render() {
    const { classes, theme } = this.props;
    // this.props.data = this.data;
    let element;
    return (
      <ThemeProvider theme={Theme}>
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
            <Center>
              <Autocomplete
                {...this.autocompleteProps}
                // id="standard-basic"
                className={classes.autocomplete}
                autoComplete
                type="search"
                classes={{ inputRoot: classes.inputRoot }}
                onChange={this.handleAutoCompleteChange}
                clearOnEscape={true}
                clearOnBlur={true}
                selectOnFocus="true"
                value={this.clear_search ? "" : this.value}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Player Search"
                    variant="outlined"
                  />
                )}
                renderOption={(option, { inputValue }) => {
                  const matches = match(option.player, inputValue);
                  const parts = parse(option.player, matches);

                  return (
                    <div>
                      {parts.map((part, index) => (
                        <span
                          key={index}
                          style={{ fontWeight: part.highlight ? 700 : 400 }}
                        >
                          {part.text}
                        </span>
                      ))}
                    </div>
                  );
                }}
              />
              <TextField
                className="year"
                // id="standard-basic"
                label="Year"
                type="search"
                value={this.state.year}
                onChange={this.handleYear}
                variant="outlined"
              />
              <FormControl
                required
                className={classes.stage_select}
                disabled={this.state.disable_filter}
              >
                <InputLabel id="stage-select">Stage</InputLabel>
                <Select
                  labelId="stage-select"
                  id="stage"
                  value={this.state.stage}
                  onChange={this.handleStage}
                  className={classes.selectEmpty}
                >
                  <MenuItem value={"regular"}>Regular Season</MenuItem>
                  <MenuItem value={"playoffs"}>Playoffs</MenuItem>
                </Select>
              </FormControl>
              <FormControl
                required
                className={classes.filter_select}
                disabled={this.state.disable_filter}
              >
                <InputLabel id="filter-select">Filter</InputLabel>
                <Select
                  labelId="filter-select"
                  id="filter"
                  value={this.state.filter}
                  onChange={this.handleFilter}
                  className={classes.selectEmpty}
                >
                  <MenuItem value={"PTS"}>PTS</MenuItem>
                  <MenuItem value={"AST"}>AST</MenuItem>
                  <MenuItem value={"STL"}>STL</MenuItem>
                  <MenuItem value={"BLK"}>BLK</MenuItem>
                  <MenuItem value={"MIN"}>MIN</MenuItem>
                  <MenuItem value={"FGM"}>FGM</MenuItem>
                  <MenuItem value={"FGA"}>FGA</MenuItem>
                  <MenuItem value={"3PM"}>3PM</MenuItem>
                  <MenuItem value={"3PA"}>3PA</MenuItem>
                  <MenuItem value={"FTM"}>FTM</MenuItem>
                  <MenuItem value={"FTA"}>FTA</MenuItem>
                  <MenuItem value={"TOV"}>TOV</MenuItem>
                  <MenuItem value={"PF"}>PF</MenuItem>
                  <MenuItem value={"REB"}>REB</MenuItem>
                  <MenuItem value={"ORB"}>ORB</MenuItem>
                  <MenuItem value={"DRB"}>DRB</MenuItem>
                  <MenuItem value={"GP"}>GP</MenuItem>
                </Select>
              </FormControl>
              <div>
                <Button variant="contained" onClick={this.search_player}>
                  Player
                </Button>
                <Button variant="contained" onClick={this.clear}>
                  Clear
                </Button>
              </div>
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
                <Center>
                  <h1 style={{ color: "white" }}>{this.state.filter}</h1>
                </Center>
                <Center>
                  <Chart data={this.state.data} filter={this.state.filter} />
                </Center>
                <div class="space"></div>
                <Center>
                  
                  <Chart data={this.state.data} filter={this.state.filter} />
                </Center>
              </div>
            ) : null}
          </Element>
        </div>
      </ThemeProvider>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
