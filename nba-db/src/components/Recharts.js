import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
// import Tooltip from "@bit/recharts.recharts.tooltip";

import { withStyles } from "@material-ui/core/styles";

// const useStyles = makeStyles((theme) => ({
//     root: {
//     display: "flex",
//     },
//     paper: {
//     marginRight: theme.spacing(2),
//     },
// }));

const styles = (theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
});


const getIntroOfPage = (label) => {
  return label
};


const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label}: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};


class Chart extends Component {
    
  render() {
    const d = this.props.data

    return (
      <div>
        <LineChart width={1700} height={550} data={d}>
          <Line type="monotone" dataKey={this.props.filter} stroke="#d300f9" />
          <CartesianGrid stroke="none" />
          <XAxis dataKey="Player" stroke="#FFFFFF" />
          <YAxis stroke="#eeeeee" />
          <Tooltip content={<CustomTooltip />} />
        </LineChart>
      </div>
    );
  }
}

export default Chart;

