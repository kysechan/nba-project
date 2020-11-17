import React, { Component } from 'react'
import T from 'prop-types'
import Downshift from 'downshift'
import axios from 'axios'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import { debounce, isEmpty } from 'lodash'

const styles = theme => ({
  container: {
    width: '100%',
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    width: '100%',
    maxHeight: 300,
    overflow: 'scroll',
  },
})

class Search extends Component {
  state = {
    value: null,
    suggestions: [],
  }

  componentWillUnmount() {
    this.executeSearch.cancel()
  }

  executeSearch = debounce(async () => {
    const { value } = this.state

    if (isEmpty(value) || value.length < 3) {
      return
    }

    const { data } = await axios.get(`/search?name=${value}`)
    this.setState({ suggestions: data })
  }, 350)

  handleInputChange = value => {
    this.setState({ value })
    this.executeSearch()
  }

  onChange = item => {
    const { onPlayerSelected } = this.props

    onPlayerSelected(item.id)
  }

  renderSuggestions = ({ highlightedIndex, selectedItem, getItemProps }) => {
    const { suggestions } = this.state

    return suggestions.map((s, index) => (
      <MenuItem
        {...getItemProps({ item: s })}
        key={s.id}
        selected={highlightedIndex === index}
        component="div"
        style={{
          fontWeight: 400,
        }}
      >
        {`${s.name} - ${s.team}`}
      </MenuItem>
    ))
  }

  render() {
    const { classes } = this.props
    const { suggestions } = this.state

    return (
      <Downshift
        id="downshift-simple"
        onInputValueChange={this.handleInputChange}
        onChange={this.onChange}
        itemToString={item => (item ? item.name : '')}
      >
        {({
          getInputProps,
          getItemProps,
          getMenuProps,
          highlightedIndex,
          isOpen,
          selectedItem,
          inputValue,
          clearSelection,
        }) => (
          <div className={classes.container}>
            <TextField
              fullWidth
              InputProps={{
                ...getInputProps(),
              }}
              variant="outlined"
              placeholder="SEARCH FOR A PLAYER e.g. LEBRON JAMES"
            />
            <div {...getMenuProps()}>
              {isOpen && suggestions.length > 0 ? (
                <Paper className={classes.paper} square>
                  {this.renderSuggestions({
                    highlightedIndex,
                    selectedItem,
                    getItemProps,
                  })}
                </Paper>
              ) : null}
            </div>
          </div>
        )}
      </Downshift>
    )
  }
}

Search.propTypes = {
  onPlayerSelected: T.func.isRequired,
}

export default withStyles(styles)(Search)