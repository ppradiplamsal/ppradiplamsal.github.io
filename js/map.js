/** Class implementing the map view. */
class Map {
    /**
     * Creates a Map Object
     */
    constructor(allData) {
        //Width and height of map
        this.width = 760;
        this.height = 500;
        this.data = allData


        //Create SVG element and append map to the SVG
        this.svg = d3.select("#map-view")
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height);

    }

    updateMap(option) {

        var value = this.getCSVPropertyName(option)
        var col = "rgb(67, 217, 117)"
        var yMin = d3.min(this.data, function(d) {
            return d[value];
        })
        var yMax = d3.max(this.data, function(d) {
            return d[value];
        })

        var color = d3.scaleLinear()
            .domain([yMin, yMax])
            .range([d3.rgb(col).brighter(), d3.rgb(col).darker()]);

        //adding tooltip
        var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip-title")
            .style("opacity", 0);

        for (var i = 0; i < this.data.length; i++) {

            // Grab State Name
            var dataState = this.data[i].RegionName;

            // Grab data value
            var dataValue = this.data[i][value];

            // Find the corresponding state inside the GeoJSON
            for (var j = 0; j < this.statesJson.features.length; j++) {
                var jsonState = this.statesJson.features[j].properties.name;

                if (dataState == jsonState) {

                    // Copy the data value into the JSON
                    this.statesJson.features[j].properties[value] = dataValue;

                    // Stop looking through the JSON
                    break;
                }
            }
        }

        // Bind the data to the SVG and create one path per GeoJSON feature
        var self = this;
        this.svg.selectAll("path")
            .data(this.statesJson.features)
            .enter()
            .append("path")
            .attr("d", this.path)
            .style("stroke", "#fff")
            .style("stroke-width", "1")
            .style("fill", function(d) {

                // Get data value
                var val = d.properties[value];

                if (val) {
                    return color(val);
                } else {
                    return "rgb(213,222,217)";
                }
            })
            .on("click", function(d) {

                for (i = 0; i < self.data.length; i++) {
                    if (self.data[i]['RegionName'].toLowerCase() === d.properties["name"].toLowerCase()) {
                        var stateData = self.data[i]
                        createTableForClickedState(stateData)
                    }
                }

            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0);
            })
            .on("mouseover", function(d) {

                for (i = 0; i < self.data.length; i++) {
                    if (self.data[i]['RegionName'].toLowerCase() === d.properties["name"].toLowerCase()) {
                        var stateData = self.data[i]
                        var tooltip_data = {
                            "state": stateData["RegionName"],
                            "price": stateData["PRICE/FT."],
                            "population": stateData["POPULATION"],
                            "unemployement": stateData["UNEMPLOYMENT_RATE"],
                            "salary": stateData["AVERAGE_SALARY/MON"],
                            "mortality": stateData["MORTALITY_RATE"]
                        }
                        var body = self.tooltip_render(tooltip_data)
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", .9);
                        tooltip.html(
                            body
                        )
                        tooltip.style("left", (d3.event.pageX) + "px")
                        tooltip.style("top", (d3.event.pageY) + "px");
                        window.barChart.highlightState(self.data[i]['RegionName'])
                    }
                }
            })




    /**
     * Renders the actual map
     * @param the json data with the shape of all countries
     */
    drawMap(json, value) {

        this.statesJson = json;
        // D3 Projection
        this.projection = d3.geoAlbersUsa()
            .translate([this.width / 2, this.height / 2]) // translate to center of screen
            .scale([1000]); // scale things down so see entire US

        // Define path generator
        this.path = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
            .projection(this.projection); // tell path generator to use albersUsa projection
        this.updateMap(value)
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

    tooltip_render(tooltip_data) {

        var text = "<h5>" + tooltip_data.state + "</h5>";
        text += "<ul>"
        text += "<li> <strong>Population:</strong> " + tooltip_data.population + "</li>"
        text += "<li> <strong> Price per foot:</strong> " + tooltip_data.price + "</li>"
        text += "<li> <strong>Mortality Rate:</strong> " + tooltip_data.mortality + "</li>"
        text += "<li> <strong>Average Salary:</strong> " + tooltip_data.salary + "</li>"
        text += "<li> <strong>Unemployement Rate:</strong> " + tooltip_data.unemployement + "</li>"
        text += "</ul>";

        return text;
    }
}