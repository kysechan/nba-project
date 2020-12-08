import React, { Component } from 'react';
import { LinkContainer } from "react-router-bootstrap";
import {

} from '@material-ui/core'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import * as d3 from 'd3'

import { BarChart, LineChart, AreaChart } from 'reaviz'


const API_IP = "165.227.31.0";
const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    }
});
class Visualize extends Component{
    constructor(props) {
        super(props);
        this.state = {
            years : ["2014", "2015", "2016", "2017", "2018"],
            stats: []
        }
        //this.handleChange = this.handleChange.bind(this);
        this.showData = this.showData.bind(this)
        this.showGraph = this.showGraph.bind(this)
        
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
    componentDidMount(){
        // let accesstoRef = d3.select(this.myRef.current);
        
        
        var i;
        var j = 0;
        for(i=0; i < 5; i++){
            fetch(
                "https://" +
                  API_IP +
                  ":8080/api/player/basic?player=" +
                  this.props.value +
                  "&year=" +
                  this.state.years[i] +
                  "&stage=" +
                  this.props.stage
              ).then((response) => response.json()).then(
                  (response) => {
                    
                    this.setState({
                        stats: this.state.stats.concat([{key: this.state.years[j], data: response[this.props.filter]}])
                  });
                  j = j + 1
        });
        
        }
    }

    showData(event) {
    
        
        console.log(this.state.stats)
        // var data = []
        // this.state.years.map((year) => 
        //         data.push([year, this.state.stats[this.state.years.indexOf(year)]])
        //     );
        // console.log(data)
        return(
            <div>
                 {/* {this.state.stats.map((stat) => 
                    <p key={stat["key"]}>{stat["key"]}: {stat["value"]}</p>
                )} */}

                <BarChart width={350} height = {250} data = {this.state.stats} />
                
            </div>
        )
    }

    showGraph(event) {
        var x = d3.scaleTime().domain()
    }


    render() {
        const { classes, theme } = this.props;
        return(
            <div>
                {/* {this.props.value}
                {this.props.stage} */}
                {/* <button onClick = {this.showData}>Visualize Trend</button> */}
                
                {this.showData()}
                
            </div>
        );
    }
}

Visualize.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Visualize);
