import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
});

const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
    return (
      <div className="custom-tooltip">
        <p
          style={{ color: "white" }}
          className="label"
        >{`${label}: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

// renderLegend = (props) => {
//   const { classes } = this.props;
//   const { payload } = props;

//   return (
//     <div className={classes.legend}>
//       {payload.map((p, index) => (
//         <div key={index} className={classes.legendItem}>
//           <div
//             style={{
//               height: 7,
//               width: 7,
//               backgroundColor: p.color,
//               marginRight: 5,
//             }}
//           />
//           <Typography variant="body2" style={{ color: p.color }}>
//             {p.value}
//           </Typography>
//         </div>
//       ))}
//     </div>
//   );
// };

const renderLegend = (props) => {
  const { payload } = props;

  return (
    <ul>
      {payload.map((entry, index) => (
        <li style={{ color: entry.color }} key={`item-${index}`}>
          {/* {entry.value} */}
          <Typography variant="body2" style={{ color: entry.color }}>
            {entry.value}
          </Typography>
        </li>
      ))}
    </ul>
  );
};

class Chart extends Component {
  render() {
    const d = this.props.data;

    return (
      <div>
        <LineChart width={1700} height={550} data={d}>
          <Line type="monotone" dataKey={this.props.filter} stroke="#d300f9" />
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Player" stroke="#FFFFFF" />
          <YAxis stroke="#eeeeee" />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="diamond" content={renderLegend} />
        </LineChart>
      </div>
    );
  }
}

export default Chart;
