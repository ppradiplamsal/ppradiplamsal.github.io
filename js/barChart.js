/** Class implementing the bar chart view. */
class BarChart {

    constructor(allData) {
        this.width = 600;
        this.height = 800;
        this.data = allData

        //Create SVG element and append map to the SVG
        this.svg = d3.select('#bar-chart')
            .append('svg')
            .attr('class', 'chart')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('style', 'padding-left: 8px;')
    }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    updateBarChart(selectedDimension) {

        var value = this.getCSVPropertyName(selectedDimension)
        //sorted data
        this.data.sort(function(a, b) {
            return b[value] - a[value]
        });

        var yMax = d3.max(this.data, function(d) {
            return d[value]
        });
        var yMin = d3.min(this.data, function(d) {
            return d[value]
        });
        // Create colorScale

        var color = "rgb(67, 217, 117)"
        var colorScale = d3.scaleLinear()
            .domain([yMin, yMax])
            .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

        var chart = this.svg.selectAll("rect")
            .data(this.data);

        chart.exit().attr("opacity", 0.5)
            .transition()
            .duration(1000)
            .attr("opacity", 0)
            .remove();

        chart = chart.enter().append("rect")
            .merge(chart);

        chart.transition()
            .duration(2000)
            .attr("x", 100)
            .attr("id", function(d) {
                return d["RegionName"]
            })
            .attr("width", function(d) {
                if (selectedDimension == 'unemployement') {
                    return d[value] / 500
                } else if (selectedDimension == 'population') {
                    return d[value] / 90000
                } else if (selectedDimension == 'mortality') {
                    return d[value] / 500
                } else if (selectedDimension == 'salary') {
                    return d[value] / 500
                } else if (selectedDimension == 'price') {
                    return d[value] / 500
                }
            })
            .attr("y", function(d, i) {
                return (i * 15) + 10;
            })
            .attr("height", 15)
            .attr("fill", function(d) {
                return colorScale(d[value])
            })

        chart.on("click", function(d) {
            createTableForClickedState(d)
        });

        var score = this.svg.selectAll("text.score")
            .data(this.data)

        var newScores = score
            .enter()
            .append("text");

        score.exit().attr("opacity", 1)
            .transition()
            .duration(2000)
            .attr("opacity", 0).remove();
        score = newScores.merge(score);

        score
            .transition()
            .duration(2000)
            .attr("x", function(d) {
                if (selectedDimension == 'unemployement' || selectedDimension == 'mortality') {
                    return (d[value] / 125) + 100
                } else if (selectedDimension == 'population') {
                    return (d[value] / 90000) + 155
                } else if (selectedDimension == 'salary') {
                    return (d[value] / 250) + 100
                } else if (selectedDimension == 'price') {
                    return (d[value] / 500) + 100
                }
            })
            .attr("y", function(d, i) {
                return (i * 15) + 17;
            })
            .attr("dx", -5)
            .attr("dy", ".36em")
            .attr("text-anchor", "end")
            .attr('class', 'score')
            .text(function(d) {
                return d[value]
            });



        var states = this.svg.selectAll("text.name")
            .data(this.data)

        var updated_states = states
            .enter()
            .append("text");

        states.exit().attr("opacity", 1)
            .transition()
            .duration(2000)
            .attr("opacity", 0).remove();
        states = updated_states.merge(states);

        states
            .transition()
            .duration(2000)
            .attr("x", 0)
            .attr("y", function(d, i) {
                return (i * 15) + 17;
            })
            .attr('class', 'name')
            .attr("dy", ".36em")
            .text(function(d) {
                return d['RegionName']
            });
    }


    highlightState(stateName) {
        d3.select("#bar-chart").selectAll("rect").classed("highlight-class", false)
        var element = d3.select("#" + stateName)
        element.classed("highlight-class", true)
        console.log(stateName)
    }

    getCSVPropertyName(value) {
        if (value == 'unemployement') {
            return 'UNEMPLOYMENT_RATE'
        }
        if (value == 'salary') {
            return 'AVERAGE_SALARY/MON'
        }
        if (value == 'population') {
            return 'POPULATION'
        }
        if (value == 'price') {
            return 'PRICE/FT.'
        }
        if (value == 'mortality') {
            return 'MORTALITY_RATE'
        }

    }
}