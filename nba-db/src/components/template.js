import React, { Component } from 'react';
import { LinkContainer } from "react-router-bootstrap";
import {

} from '@material-ui/core'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    }
});
class ReactTemplate extends Component{
    constructor(props) {
        super(props);
        this.state = {

        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      this.setState({
        [name]: value
      });
    }
    render() {
        const { classes, theme } = this.props;
        return(
            <div>


            </div>
        );
    }
}

ReactTemplate.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ReactTemplate);
