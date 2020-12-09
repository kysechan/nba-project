import React, { Component } from 'react';
import { ResponsiveLine } from '@nivo/line'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    lineWrapper:{
        width:'50%',
        height:'500px',
    },
    lineChart:{
        
    }
});
class NivoLineChart extends Component{
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

    componentDidMount(){
        this.setState({
            data: this.props.graph_data,
        })
        console.log(`Inside Nivo Line - Props: ${JSON.stringify(this.props.graph_data)}`)
    }
    render() {
        const { classes, theme } = this.props;
        return(
            <div className={classes.lineWrapper}>
                {/* {JSON.stringify(this.props.graph_data)} */}
                <ResponsiveLine
                    className={classes.lineChart}
                    data={this.props.graph_data}
                    //curve="monotoneX"
                    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                    xScale={{ type: 'point' }}
                    yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
                    yFormat=" >-.2f"
                    axisTop={null}
                    axisRight={null}
                    theme={{
                        axis: {
                            fontSize: "14px",
                            tickColor: "#eee",
                            ticks: {
                              text: {
                                fill:"#FFFFFF"
                              }
                            },
                            legend: {
                              text: {
                                fill: "#FFFFFF"
                              }
                            }
                          },
                      }}
                    axisBottom={{
                        orient: 'bottom',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'year',
                        legendOffset: 45,
                        legendPosition: 'middle',
                        itemTextColor:"white"
                    }}
                    axisLeft={{
                        orient: 'left',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'count',
                        legendOffset: -50,
                        legendPosition: 'middle',
                        itemTextColor:"white"
                    }}
                    pointSize={10}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    pointLabelYOffset={-12}
                    useMesh={true}
                    style = {{color: 'white'}}
                    legends={[
                        {
                            anchor: 'bottom-right',
                            direction: 'column',
                            justify: false,
                            translateX: 100,
                            translateY: 0,
                            itemsSpacing: 0,
                            itemDirection: 'left-to-right',
                            itemWidth: 80,
                            itemTextColor:"white",
                            itemHeight: 20,
                            //itemOpacity: 0.75,
                            symbolSize: 12,
                            symbolShape: 'circle',
                            textColor: 'white',
                            //symbolBorderColor: 'rgba(0, 0, 0, .5)',
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemBackground: 'rgba(0, 0, 0, .03)',
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        }
                    ]}
                />
            </div>
        );
    }
}

NivoLineChart.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(NivoLineChart);
