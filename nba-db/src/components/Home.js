import React, { Component } from "react";
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
import {
  BarChart,
  LinearXAxisTickSeries,
  LinearXAxisTickLine,
  Line,
  LineChart,
  LineSeries,
  LinearXAxis,
  LinearXAxisTickLabel,
} from "reaviz";

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

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Chart from "./Recharts";
import dynamicData from "./Recharts.js";
import SelectStage from "./SelectStage";
// import Visualize from "./Visualize";

import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";

const WhiteTextTypography = withStyles({
  root: {
    color: "#FFFFFF",
  },
})(Typography);

const stage_options = ["regular", "playoffs"];
const default_stage = stage_options[0];

const API_IP = "165.227.31.0"; //"localhost";

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
    const resp = await fetch("http://localhost:8080/api/player/all");
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
      player_list: [],
      stats: [],
      i: 0,
      compare: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleYear = this.handleYear.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleStage = this.handleStage.bind(this);
    this.search_player = this.search_player.bind(this);
    this.update = this.update.bind(this);
    this.clear = this.clear.bind(this);
    this.handleAutoCompleteChange = this.handleAutoCompleteChange.bind(this);
    this.clearAutocomplete = this.clearAutocomplete.bind(this);
    this.process = this.process.bind(this);
    this.show_table = false;
    this.response = "";
    this.json = "";
    this.clear_search = false;
    this.stats = Array();
    this.i = 0;
    this.show_graph2 = false;
    this.last = "none";
    this.years = [
      "2007",
      "2008",
      "2009",
      "2010",
      "2011",
      "2012",
      "2013",
      "2014",
      "2015",
      "2016",
      "2017",
      "2018",
      "2019",
    ];
    //this.player_list = [];

    this.autocompleteProps = {
      options: static_players.static_players,
      getOptionLabel: (option) => option.player,
    };
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
    // this.value = event.target.value;
  }

  handleYear(event) {
    this.setState({ year: event.target.value });
    // this.year = event.target.value;
  }

  handleStage(event) {
    this.setState({ stage: event.target.value });
    this.stage = event.target.value;
  }

  handleFilter(event) {
    this.setState({ filter: event.target.value });
    this.filter = event.target.value;
    // this.last = "filter"
    // if (this.last != "search") this.process();
    this.forceUpdate();
  }

  toggleTable() {
    this.show_table = true;
  }

  handleAutoCompleteChange = (event, values, reason) => {
    if (values != null && reason == "select-option") {
      this.setState(
        {
          value: values.player,
        },
        () => {
          console.log(this.state.value);
        }
      );
      this.value = values.player;
    }

    // this.process();
    // this.forceUpdate();
  };

  clearAutocomplete(event, values) {
    values.player = null;
  }

  async process() {
    // this.setState({ stats: [] });
    // let accesstoRef = d3.select(this.myRef.current);
    this.stats = Array();
    var i;
    // var j = 0;

    for (i = 0; i < this.years.length; i++) {
      await fetch(
        "http://" +
          API_IP +
          ":8080/api/v2/player/basic?player=" +
          this.value +
          "&year=" +
          this.years[i] +
          "&stage=" +
          this.stage
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error();
          }
          return response.json().data;
        })
        .then((response) => {
          console.log(this.value);
          console.log("found good year" + this.years[this.i]);
          this.stats = this.stats.concat([
            {
              key: this.years[this.i],
              data: response[this.filter],
            },
          ]);
          // this.state.stats = this.state.stats.concat([
          //   {
          //     key: this.state.years[this.state.i],
          //     data: response[this.state.filter],
          //   },
          // ]);
          // this.setState({
          //   stats: this.state.stats.concat([
          //     {
          //       key: this.state.years[this.state.i],
          //       data: response[this.state.filter],
          //     },
          //   ]),
          // });
          //   this.state.i = this.state.i + 1;
          // this.setState({ i: this.state.i + 1 });
          this.i = this.i + 1;
          return;
        })
        .catch((err) => {
          //   this.state.i = this.state.i + 1;
          // this.setState({ i: this.state.i + 1 });
          this.i = this.i + 1;
          console.error("Error: ", err);

          return;
        });

      console.log(this.stats);
    }
    this.i = 0;
    console.log(this.stats);
    this.setState({ stats: this.stats });
    // console.log(";lajksdfl;akjsdkl;fjal;skdjfl;aksjdf;lkajsdf");
    // this.setState({ stats: this.state.stats });
    // this.stats = this.state.stats;
    // this.process();
  }

  update() {
    this.setState({ value: this.state.value });
    this.process();
    this.forceUpdate();
  }
  clear() {
    this.player_list = [];
    this.show_table = false;
    this.state.data = [];
    this.state.disable_filter = false;
    // this.value = null;
    this.state.searchText = "";
    this.clear_search = true;
    this.forceUpdate();
  }

  // Get request API player endpoint
  async search_player(event) {
    await fetch(
      "http://" +
        API_IP +
        ":8080/api/v2/player/basic?player=" +
        this.value +
        "&year=" +
        this.state.year +
        "&stage=" +
        this.stage
    )
      .then((response) => response.json())
      .then((response) => {
        this.toggleTable();
        //this.state.data = this.state.data.concat(response.data);
        //this.setState({ value: this.state.value });
        console.log(`Response 1: ${response.data}`);
        const filter_1 = this.state.filter;
        //this.stats = Array();\
        console.log(`Filter: ${filter_1}`);
        var arr = Array();
        var tmp_player_list = Array();
        var compare = Array();
        var i = 0;
        response.data.forEach(function (arrayItem) {
          arr.push({
            key: arrayItem.lower_year_bound.toString(),
            data: arrayItem[filter_1],
          });
          tmp_player_list.push(arrayItem);
          compare.push({
            key: arrayItem["Season"].split(" ")[0],
            id: i.toString(),
            data: arrayItem[filter_1],
          });
          i = i + 1;
        });
        i = 0;
        console.log(`Array after for loop: ${JSON.stringify(arr)}`);
        this.setState({
          stats: arr,
          player_list: this.state.player_list.concat(tmp_player_list),
          compare: this.state.compare.concat({
            key: this.value,
            data: compare,
          }),
        });
        console.log(this.state.compare);
        //this.process();
        console.log(`stats state: ${JSON.stringify(this.state.stats)}`);
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
    console.log(this.stats);
    // this.setState({ stats: this.stats });
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
                // selectOnFocus="true"
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
                <Button variant="contained" onClick={this.update}>
                  Update
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
                      {this.state.player_list.map((player) => (
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
                  {/* <Chart data={this.state.data} filter={this.state.filter} /> */}
                  <LineChart
                    width={800}
                    height={350}
                    scaled={false}
                    series={
                      <LineSeries
                        type="grouped"
                        line={<Line strokeWidth={4} />}
                      />
                    }
                    data={this.state.compare}
                    gridlines={null}
                    xAxis={
                      <LinearXAxis
                        type="duration"
                        tickSeries={
                          <LinearXAxisTickSeries
                            line={<LinearXAxisTickLine position="center" />}
                            label={<LinearXAxisTickLabel padding={3}/>}
                          />
                        }
                      />
                    }
                  />
                </Center>
                <div class="space"></div>
                <Center>
                  <h1 style={{ color: "white" }}>
                    Past {this.state.stats.length} Seasons for{" "}
                    {this.state.value} [{this.state.filter}]
                  </h1>
                </Center>
                <Center>
                  <div style={{ margin: "10px", textAlign: "center" }}>
                    <BarChart
                      width={800}
                      height={350}
                      data={this.state.stats}
                    />
                  </div>
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
