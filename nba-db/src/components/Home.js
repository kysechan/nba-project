import React, { Component } from "react";
import PropTypes from "prop-types";
import SearchComponent from "./SearchComponent";
import ResultsTable from "./ResultsTable";
import static_players from "./StaticPlayerList";
import Center from "react-center";
import { Element } from "react-scroll";
import Theme from "./theme";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import logo from "../images/basketball-player.svg";
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
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { ThemeProvider } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { DataGrid } from "@material-ui/data-grid";
import Toolbar from "@material-ui/core/Toolbar";
import Container from "@material-ui/core/Container";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Chart from "./Recharts";
import dynamicData from "./Recharts.js";
import SelectStage from "./SelectStage";
// import Visualize from "./Visualize";
import distinctColors from "distinct-colors";
import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import Cookies from "universal-cookie";
import { Treemap } from "recharts";

const cookies = new Cookies();

const colorArray = [
  "#0066cc",
  "#00b33c",
  "#9933ff",
  "#ff0000",
  "#0099cc",
  "#ff00ff",
  "#666699",
  "#00cc99",
  "#ffcc00",
  "#3366ff",
  "#ffff00",
];
var palette = distinctColors();
var randomColor = require("randomcolor");
//console.log(`Pallete: ${JSON.stringify(palette[0].hex())}`)
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
    backgroundColor: "#212121",
    height: "100%",
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
    minWidth: "100px",
    width: "40%",
    // text: "color",
    // background: 'white'
  },
  multilineColor: {
    color: "white",
  },
  table: {},
  tableWrapper: {
    marginTop: "20px",
    width: "95%",
    backgroundColor: "transparent",
  },
  tableHeader: {
    fontWeight: "bold",
    color: "white",
  },
  tableText: {
    color: "white",
  },
  searchBar: {
    paddingTop: "10px",
    paddingBottom: "10px",
  },
  toolbarWrapper: {
    backgroundColor: "#0f4c75",
    paddingBottom: "10px",
  },
  yearInput: {
    color: "white",
  },

  selectEmpty: {
    color: "white",
  },
  filterOptions: {
    color: "black",
  },
  homeRoot: {
    backgroundColor: "#212121",
    height: "100vh !important",
  },

  searchButtons: {
    marginRight: "10px",
    backgroundColor: "#1b262c",
    color: "white",
  },
  autoCompleteTextField: {
    color: "white",
  },
});

function set_cookie(name, value) {
  cookies.set(name, JSON.stringify(value), { path: "/" });
}

function get_cookie(name, value) {
  return cookies.get(name);
}

async function get_autcompete_props() {
  try {
    const resp = await fetch("http://" + API_IP + ":8080/api/player/all");
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
      grouped_player_list: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleYear = this.handleYear.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleStage = this.handleStage.bind(this);
    this.search_player = this.search_player.bind(this);
    this.update = this.update.bind(this);
    this.update_compares = this.update_compares.bind(this);
    this.clear = this.clear.bind(this);
    this.handleAutoCompleteChange = this.handleAutoCompleteChange.bind(this);
    this.clearAutocomplete = this.clearAutocomplete.bind(this);
    this.process = this.process.bind(this);
    this.show_table = false;
    this.response = "";
    this.json = "";
    this.clear_search = false;
    this.stats = Array();
    // this.player_list = this.player_list.bind(this);
    this.player_list = Array();
    this.i = 0;
    this.show_graph2 = false;
    this.unique_names = new Set();
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
  };

  update_compares(filter) {
    cookies.remove("graph1_data");

    var unique_names = JSON.parse(get_cookie("unique_names"));
    var player_data = {};
    console.log("printing unique names");
    console.log(unique_names);

    var player_list = this.state.player_list;
    console.log(player_list);

    player_list.forEach(function (arrayItem) {
      // console.log(arrayItem)
      if (!player_data[arrayItem["Player"]]) {
        player_data[arrayItem["Player"]] = Array();
      }
      player_data[arrayItem["Player"]].push({
        key: arrayItem["Season"].split(" ")[0],
        data: arrayItem[filter],
      });
    });

    var final_list = Array();
    unique_names.forEach((item) => {
      final_list.push({
        key: item,
        data: player_data[item],
      });
    });

    // const graph1_data = unique_names.map((player) => {
    //   "key": player,
    //   // data: player_data[player],
    // });

    set_cookie("graph1_data", final_list);
    // return temp;
  }
  clearAutocomplete(event, values) {
    values.player = null;
  }

  async process() {
    this.stats = Array();
    var i;

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
          this.i = this.i + 1;
          return;
        })
        .catch((err) => {
          this.i = this.i + 1;
          console.error("Error: ", err);

          return;
        });

      console.log(this.stats);
    }
    this.i = 0;
    console.log(this.stats);
    this.setState({ stats: this.stats });
  }

  update(event) {
    this.setState({ value: this.state.value });
    this.show_table = true;

    console.log("printing graph1 data in update()...");
    var graph1_data = get_cookie("graph1_data");
    this.update_compares(this.state.filter);
    console.log(graph1_data);
    this.forceUpdate();
  }
  clear() {
    this.setState({
      compare: Array(),
      player_list: Array(),
      compare: Array(),
      stats: [],
      data: [],
      grouped_player_list: [],
      year: null,
    });
    this.show_table = false;
    this.player_list = [];
    this.state.data = [];
    this.state.disable_filter = false;
    this.state.searchText = "";
    this.clear_search = true;
    this.json = "";
    this.response = "";
    this.stage = null;
    this.filter = null;

    this.forceUpdate();
  }

  // Get request API player endpoint
  async search_player(event) {
    if (this.stage == null || this.state.year == null || this.value == null) {
      alert("Please select more parameters");
      return;
    }
    if (!this.unique_names.has(this.value)) {
      this.unique_names.add(this.value);
    }
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
          grouped_player_list: this.state.grouped_player_list.concat({
            player: response.player,
            start_year: response.year,
            data: tmp_player_list,
            color: randomColor({
              luminosity: "light",
            }),
          }),
        });
        this.compare = this.state.compare;
        this.player_list = this.state.player_list;
        this.stats = this.state.stats;

        // set cookie
        // var player_list_string = JSON.stringify(this.player_list);
        // set_cookie('player_list', this.player_list[0])
        // set_cookie('test', ";a;ldsjkf;alsdkjf")

        console.log("setting unique names...");
        var temp = Array();
        for (let item of this.unique_names) {
          temp.push(item);
        }

        set_cookie("unique_names", JSON.stringify(temp));
        console.log(temp);

        console.log("setting graph1 data...");
        set_cookie("graph1_data", this.compare);

        console.log("getting graph1 data...");
        var graph1_data = JSON.parse(JSON.stringify(get_cookie("graph1_data")));
        console.log(graph1_data);

        console.log("setting graph2 data...");
        set_cookie("graph2_data", this.stats);
        //
        console.log("getting player list...");
        var player_list_data = get_cookie("player_list");
        console.log(player_list_data);
        // console.log(cookie)

        // console.log(this.state.compare);
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
  }

  render() {
    console.log("in render");
    console.log(this.compare);
    console.log(this.state.compare);
    const { classes, theme } = this.props;
    const graph1_data = get_cookie("graph1_data");
    const graph2_data = get_cookie("graph2_data");

    console.log("printing graph1 data...");
    console.log(graph1_data);

    let element;

    return (
      <div className={classes.homeRoot}>
        <ThemeProvider theme={Theme}>
          <div className={classes.root}>
            <Element
              className="element"
              id="containerElement"
              style={{
                width: "100%",
                height: "100vh !important",
                backgroundColor: "#212121",
              }}
            >
              <Toolbar className={classes.toolbarWrapper}>
                <img className="logo" src={logo} alt="nba icon" />
                <Typography variant="h6" className={classes.title}>
                  NBA DB
                </Typography>
                <Grid
                  container
                  direction="column"
                  justify="center"
                  alignItems="flex-start"
                >
                  <Grid
                    className={classes.searchBar}
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                  >
                    <Autocomplete
                      {...this.autocompleteProps}
                      // id="standard-basic"
                      className={classes.autocomplete}
                      autoComplete
                      type="search"
                      onChange={this.handleAutoCompleteChange}
                      InputProps={{
                        className: classes.autoCompleteTextField,
                      }}
                      clearOnEscape={true}
                      clearOnBlur={true}
                      style={{ color: "white" }}
                      // selectOnFocus="true"
                      value={this.clear_search ? "" : this.value}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          InputProps={{
                            ...params.InputProps,
                            className: classes.autoCompleteTextField,
                          }}
                          className={classes.autoCompleteTextField}
                          label="Player Search"
                          variant="outlined"
                          style={{ color: "white !important" }}
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
                                style={{
                                  fontWeight: part.highlight ? 700 : 400,
                                }}
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
                      id="year-form"
                      className={classes.yearForm}
                      InputProps={{
                        className: classes.yearInput,
                      }}
                      type="search"
                      value={this.state.year}
                      onChange={this.handleYear}
                      variant="outlined"
                    />
                    <FormControl
                      variant="outlined"
                      required
                      className={classes.stage_select}
                      disabled={this.state.disable_filter}
                      style={{ color: "white" }}
                      style={{ marginTop: "0px" }}
                    >
                      <InputLabel
                        id="stage-select"
                        style={{ marginTop: "0px" }}
                      >
                        Stage
                      </InputLabel>
                      <Select
                        labelId="stage-select"
                        id="stage-here"
                        value={this.state.stage}
                        onChange={this.handleStage}
                        className={classes.selectEmpty}
                      >
                        <MenuItem style={{ color: "black" }} value={"regular"}>
                          Regular Season
                        </MenuItem>
                        <MenuItem style={{ color: "black" }} value={"playoffs"}>
                          Playoffs
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl
                      variant="outlined"
                      required
                      className={classes.filter_select}
                      disabled={this.state.disable_filter}
                      style={{ marginTop: "0px" }}
                    >
                      <InputLabel id="filter-select">Filter</InputLabel>
                      <Select
                        labelId="filter-select"
                        id="filter"
                        style={{ color: "white" }}
                        value={this.state.filter}
                        onChange={this.handleFilter}
                        className={classes.selectEmpty}
                      >
                        <MenuItem
                          value={"PTS"}
                          className={classes.filterOptions}
                        >
                          PTS
                        </MenuItem>
                        <MenuItem
                          value={"AST"}
                          className={classes.filterOptions}
                        >
                          AST
                        </MenuItem>
                        <MenuItem
                          value={"STL"}
                          className={classes.filterOptions}
                        >
                          STL
                        </MenuItem>
                        <MenuItem
                          value={"BLK"}
                          className={classes.filterOptions}
                        >
                          BLK
                        </MenuItem>
                        <MenuItem
                          value={"MIN"}
                          className={classes.filterOptions}
                        >
                          MIN
                        </MenuItem>
                        <MenuItem
                          value={"FGM"}
                          className={classes.filterOptions}
                        >
                          FGM
                        </MenuItem>
                        <MenuItem
                          value={"FGA"}
                          className={classes.filterOptions}
                        >
                          FGA
                        </MenuItem>
                        <MenuItem
                          value={"3PM"}
                          className={classes.filterOptions}
                        >
                          3PM
                        </MenuItem>
                        <MenuItem
                          value={"3PA"}
                          className={classes.filterOptions}
                        >
                          3PA
                        </MenuItem>
                        <MenuItem
                          value={"FTM"}
                          className={classes.filterOptions}
                        >
                          FTM
                        </MenuItem>
                        <MenuItem
                          value={"FTA"}
                          className={classes.filterOptions}
                        >
                          FTA
                        </MenuItem>
                        <MenuItem
                          value={"TOV"}
                          className={classes.filterOptions}
                        >
                          TOV
                        </MenuItem>
                        <MenuItem
                          value={"PF"}
                          className={classes.filterOptions}
                        >
                          PF
                        </MenuItem>
                        <MenuItem
                          value={"REB"}
                          className={classes.filterOptions}
                        >
                          REB
                        </MenuItem>
                        <MenuItem
                          value={"ORB"}
                          className={classes.filterOptions}
                        >
                          ORB
                        </MenuItem>
                        <MenuItem
                          value={"DRB"}
                          className={classes.filterOptions}
                        >
                          DRB
                        </MenuItem>
                        <MenuItem
                          value={"GP"}
                          className={classes.filterOptions}
                        >
                          GP
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid>
                    <div>
                      <Button
                        variant="contained"
                        className={classes.searchButtons}
                        onClick={this.search_player}
                      >
                        Player
                      </Button>
                      <Button
                        variant="contained"
                        className={classes.searchButtons}
                        onClick={this.clear}
                      >
                        Clear
                      </Button>
                      <Button
                        variant="contained"
                        className={classes.searchButtons}
                        onClick={this.update}
                      >
                        Update
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </Toolbar>
              {this.show_table ? (
                <div>
                  {/* {this.state.grouped_player_list.map((item, index) => (
                    <Typography variant="h5" style={{ color: item.color, margin: "10px" }}>
                      {item.player}
                    </Typography>
                  ))} */}
                  <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                  >
                    {this.state.grouped_player_list.length > 0 &&
                      this.state.grouped_player_list.map((item, index) => (
                        <Grid item style={{ marginTop: "30px" }}>
                          <Typography
                            variant="h5"
                            style={{ color: item.color }}
                          >
                            {item.player}
                          </Typography>
                          <ResultsTable
                            player_list={item.data}
                            grouped_player_list={item}
                          />
                        </Grid>
                      ))}
                  </Grid>
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
                      data={graph1_data}
                      gridlines={null}
                      xAxis={
                        <LinearXAxis
                          type="duration"
                          tickSeries={
                            <LinearXAxisTickSeries
                              line={<LinearXAxisTickLine position="center" />}
                              label={<LinearXAxisTickLabel padding={3} />}
                            />
                          }
                        />
                      }
                    />
                  </Center>
                  <div className="space"></div>
                  <Center>
                    <h1 style={{ color: "white" }}>
                      Past {this.state.stats.length} Seasons for{" "}
                      {this.state.value} [{this.state.filter}]
                    </h1>
                  </Center>
                  <Center>
                    <div style={{ margin: "10px", textAlign: "center" }}>
                      <BarChart width={800} height={350} data={graph2_data} />
                    </div>
                  </Center>
                </div>
              ) : null}
            </Element>
          </div>
        </ThemeProvider>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
