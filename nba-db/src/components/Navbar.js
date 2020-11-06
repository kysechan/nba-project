import React, { Component } from 'react';
import {
  Toolbar, IconButton, Typography,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/MenuOutlined';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SearchContainer from './SearchComponent'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  menuButton: {

  },
  title:{

  },
  search: {
    position: 'absolute',
    right: '5%',
    borderRadius: 5,
    backgroundColor: '#4d4d4d',
    '&:hover': {
      backgroundColor: '#333333',
    },
    marginLeft: 10,
    width: '30%',
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
});
class ReactTemplate extends Component {
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
    return (
      <div>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Nba DB
          </Typography>
          {/* <SearchContainer handleSubmit={this.props.handleSubmit}/> */}
        </Toolbar>

      </div>
    );
  }
}

ReactTemplate.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ReactTemplate);
