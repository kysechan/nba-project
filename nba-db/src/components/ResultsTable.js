import React, { Component } from 'react';
import { LinkContainer } from "react-router-bootstrap";
import {

} from '@material-ui/core'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    table:{
    
    },
    tableWrapper:{
      width: '95%',
      backgroundColor: 'transparent',
    },
    tableHeader:{
      fontWeight: "bold",
      color:'white',
    },
    tableText:{
      color:'white',
    },
});
class ResultsTable extends Component{
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
                <TableContainer component={Paper} className={classes.tableWrapper}>
                    <Table className={classes.table} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableHeader}>Player Name</TableCell>
                          <TableCell align="center" className={classes.tableHeader}>Player Name</TableCell>
                          <TableCell align="center" className={classes.tableHeader}>Team</TableCell>
                          <TableCell align="center" className={classes.tableHeader}>Season</TableCell>
                          <TableCell align="center" className={classes.tableHeader}>Stage</TableCell>
                          <TableCell align="center" className={classes.tableHeader}>Points Scored</TableCell>
                          <TableCell align="center" className={classes.tableHeader}>Assists</TableCell>
                          <TableCell align="center" className={classes.tableHeader}>Blocks</TableCell>
                          <TableCell align="center" className={classes.tableHeader}>Rebounds</TableCell>
                          <TableCell align="center" className={classes.tableHeader}>Offensive Rebounds</TableCell>
                          <TableCell align="center" className={classes.tableHeader}>Defensive Rebounds</TableCell>
                          <TableCell align="center" className={classes.tableHeader}>Games Played</TableCell>
                          <TableCell align="center" className={classes.tableHeader}>Total Minutes Played</TableCell>
                          <TableCell align="center" className={classes.tableHeader}>Fouls</TableCell>
                          <TableCell align="center" className={classes.tableHeader}>Turnovers</TableCell>
                          <TableCell align="center" className={classes.tableHeader}>FG Made</TableCell>
                          <TableCell align="center" className={classes.tableHeader}>FG Attempted</TableCell>
                          <TableCell align="center" className={classes.tableHeader}>3-P Made</TableCell>
                          <TableCell align="center"  className={classes.tableHeader}>3-P Attempted</TableCell>
                          <TableCell align="center" className={classes.tableHeader}>FT Made</TableCell>
                          <TableCell align="center" className={classes.tableHeader}>FT Attempted</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.props.player_list.slice(Math.max(this.props.player_list.length - 5, 1)).map((player) => (
                          <TableRow key={player.Player}>
                            <TableCell component="th" scope="row" className={classes.tableText}>
                              {player.Player}
                            </TableCell>
                            <TableCell align="center" className={classes.tableText}>{player.Team}</TableCell>
                            <TableCell align="center" className={classes.tableText}>{player.Season}</TableCell>
                            <TableCell align="center" className={classes.tableText}>{player.Stage}</TableCell>
                            <TableCell align="center" className={classes.tableText}>{player.PTS}</TableCell>
                            <TableCell align="center" className={classes.tableText}>{player.AST}</TableCell>
                            <TableCell align="center" className={classes.tableText}>{player.BLK}</TableCell>
                            <TableCell align="center" className={classes.tableText}>{player.REB}</TableCell>
                            <TableCell align="center" className={classes.tableText}>{player.ORB}</TableCell>
                            <TableCell align="center" className={classes.tableText}>{player.DRB}</TableCell>
                            <TableCell align="center" className={classes.tableText}>{player.BLK}</TableCell>
                            <TableCell align="center" className={classes.tableText}>{player.GP}</TableCell>
                            <TableCell align="center" className={classes.tableText}>{player.MIN}</TableCell>
                            <TableCell align="center" className={classes.tableText}>{player.PF}</TableCell>
                            <TableCell align="center" className={classes.tableText}>{player.TOV}</TableCell>
                            <TableCell align="center" className={classes.tableText}>{player.FGM}</TableCell>
                            <TableCell align="center" className={classes.tableText}>{player.FGA}</TableCell>
                            <TableCell align="center" className={classes.tableText}>{player["3PM"]}</TableCell>
                            <TableCell align="center" className={classes.tableText}>{player["3PA"]}</TableCell>
                            <TableCell align="center" className={classes.tableText}>{player.FTM}</TableCell>
                            <TableCell align="center" className={classes.tableText}>{player.FTA}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
            </div>
        );
    }
}

ResultsTable.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ResultsTable);
