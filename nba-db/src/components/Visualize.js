import React, { Component } from "react";
import { LinkContainer } from "react-router-bootstrap";
import {} from "@material-ui/core";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import * as d3 from "d3";

import { BarChart, LineChart, AreaChart } from "reaviz";

const API_IP = "165.227.31.0";
const styles = (theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
});
class Visualize extends Component {
  constructor(props) {
    super(props);
    this.state = {
      years: [
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
      ],
      stats: [],
      i: 0,
    };
    //this.handleChange = this.handleChange.bind(this);
    this.showData = this.showData.bind(this);
    this.showGraph = this.showGraph.bind(this);
    // this.componentDidMount = this.componentDidMount(this);
    // this.process = this.process.bind(this);

    // var svg = d3.select("#player_trend_graph").append("svg").append("g")
  }

  // handleChange(event) {
  //   const target = event.target;
  //   const value = target.type === 'checkbox' ? target.checked : target.value;
  //   const name = target.name;
  //   this.setState({
  //     [name]: value
  //   });
  // }
//   async process() {
//     // this.setState({ stats: [] });
//     // let accesstoRef = d3.select(this.myRef.current);

//     var i;
//     // var j = 0;

//     var d = Array();

//     for (i = 0; i < this.state.years.length; i++) {
//       await fetch(
//         "https://" +
//           API_IP +
//           ":8080/api/player/basic?player=" +
//           this.props.value +
//           "&year=" +
//           this.state.years[i] +
//           "&stage=" +
//           this.props.stage
//       )
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error();
//           }
//           return response.json();
//         })
//         .then((response) => {
//           console.log(this.props.value);
//           console.log("found good year" + this.state.years[this.state.i]);

//           this.state.stats = this.state.stats.concat([
//             {
//               key: this.state.years[this.state.i],
//               data: response[this.props.filter],
//             },
//           ]);
//           //   this.state.i = this.state.i + 1;
//           this.setState({ i: this.state.i + 1 });
//           return;
//         })
//         .catch((err) => {
//           //   this.state.i = this.state.i + 1;
//           this.setState({ i: this.state.i + 1 });
//           console.error("Error: ", err);

//           return;
//         });
//     }
//     console.log(";lajksdfl;akjsdkl;fjal;skdjfl;aksjdf;lkajsdf");
//     return this.state.stats;
//     // this.process();
//   }
  //   async componentDidUpdate() {
  //     // this.setState({ stats: [] });
  //     // let accesstoRef = d3.select(this.myRef.current);

  //     var i;
  //     var j = 0;

  //     // this.setState({ j: 0 });

  //     for (i = 0; i < this.state.years.length; i++) {
  //       await fetch(
  //         "https://" +
  //           API_IP +
  //           ":8080/api/player/basic?player=" +
  //           this.props.value +
  //           "&year=" +
  //           this.state.years[i] +
  //           "&stage=" +
  //           this.props.stage
  //       )
  //         .then((response) => {
  //           if (!response.ok) {
  //             throw new Error();
  //           }
  //           return response.json();
  //         })
  //         .then((response) => {
  //           console.log(this.props.value);
  //           console.log("found good year" + this.state.years[this.state.i]);

  //           this.state.stats = this.state.stats.concat([

  //             {
  //               key: this.state.years[this.state.i],
  //               data: response[this.props.filter],
  //             },
  //           ]);
  //           this.setState({ i: this.state.i + 1 });
  //           //   this.state.i = this.state.i + 1;
  //           return;
  //         })
  //         .catch((err) => {
  //           this.setState({ i: this.state.i + 1 });
  //           //   this.state.i = this.state.i + 1;
  //           console.error("Error: ", err);

  //           return;
  //         });
  //     }
  //   }
//   async componentDidMount() {
//     // this.setState({ stats: [] });
//     // let accesstoRef = d3.select(this.myRef.current);

//     var i;
//     // var j = 0;

//     this.setState({ i: 0 });

//     for (i = 0; i < this.state.years.length; i++) {
//       await fetch(
//         "https://" +
//           API_IP +
//           ":8080/api/player/basic?player=" +
//           this.props.value +
//           "&year=" +
//           this.state.years[i] +
//           "&stage=" +
//           this.props.stage
//       )
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error();
//           }
//           return response.json();
//         })
//         .then((response) => {
//           console.log(this.props.value);
//           console.log("found good year" + this.state.years[this.state.i]);

//           this.state.stats = this.state.stats.concat([
//             {
//               key: this.state.years[this.state.i],
//               data: response[this.props.filter],
//             },
//           ]);
//           //   this.state.i = this.state.i + 1;
//           this.setState({ i: this.state.i + 1 });
//           return;
//         })
//         .catch((err) => {
//           //   this.state.i = this.state.i + 1;
//           this.setState({ i: this.state.i + 1 });
//           console.error("Error: ", err);

//           return;
//         });
//     }
//     // this.process();
//   }

//   showData(event) {
//     console.log(this.state.stats);

//     // if (this.state.stats.length > 1) {

//     //   return this.process();
//     // }
//     // await this.process();
//     return (
//       <div>
//         <BarChart width={1450} height={350} data={this.state.stats} />
//       </div>
//     );
//   }

//   showGraph(event) {
//     var x = d3.scaleTime().domain();
//   }

  render() {
    // this.setState({ i: 0 });
    const { classes, theme } = this.props;
    console.log(this.props.value);

    // return (
    //   <div>
    //     <BarChart width={1450} height={350} data={this.state.stats} />

    //   </div>
    // );
    // return this.process();
    // this.setState({ i: 0 });
    // const d = this.process();
    return (
      <div>
        <BarChart width={1450} height={350} data={this.props.data} />
      </div>
    );
  }
}

Visualize.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Visualize);
