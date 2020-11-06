import React, { Component } from 'react';
import { LinkContainer } from "react-router-bootstrap";
import {

} from '@material-ui/core'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  notfound: {
    paddingTop: '100px',
    textAlign: 'center'
  }
});
class NotFound extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    this.handleChange = this.handleChange.bind(this);
  }
  render() {
    const { classes, theme } = this.props;
    return (
      <div className="NotFound">
        <h3>Sorry, page not found!</h3>
      </div>
    );
  }
}

NotFound.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(NotFound);
