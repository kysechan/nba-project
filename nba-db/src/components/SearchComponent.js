import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';

const styles = theme => ({
  search: {
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
class SearchComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
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
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <form >
          <InputBase
            onChange={this.handleChange}
            value={this.state.searchValue}
            name="searchValue"
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </form>
      </div>
    );
  }
}

SearchComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(SearchComponent);
