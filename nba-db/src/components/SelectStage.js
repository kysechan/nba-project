import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import "react-dropdown/style.css";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 100,
  },
});

class SelectStage extends Component {
  constructor() {
    super();
  }
  render() {
    const { classes, theme } = this.props;
    return (
      <FormControl required className={classes.formControl}>
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
        <FormHelperText>Required</FormHelperText>
      </FormControl>
    );
  }
}

SelectStage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default SelectStage;
