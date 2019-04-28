// The code below has been adapted from ..............

 function tooltip_render(tooltip_data) {
    var text = "<h5 style = 'font-size: 40px'>" + tooltip_data.state + "</h5>";
    text += "<ul>";
    text += "<li style = 'font-size: 18px'> <strong>Average Population 2015/16:</strong> " + tooltip_data.avgpopulation + "</li>";
    text += "<li style = 'font-size: 18px'> <strong>Value in 2015:</strong> " + tooltip_data.value2015 + "</li>";
    text += "<li style = 'font-size: 18px'> <strong>Value in 2016:</strong> " + tooltip_data.value2016 + "</li>";
    text += "<li style = 'font-size: 18px'> <strong>Percentage Change:</strong> " + tooltip_data.percentchange + "%</li>";
    text += "</ul>";
    return text;
}


function createMap(option, json, data) {
    var col = "hsl(0, 80%, 50%)";

    var yMin = d3.min(data, function(d) {
       return d.details[option][2];
    });
    
    var yMax = d3.max(data, function(d) {
        return d.details[option][2];
    });

    var color = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([d3.rgb(col).brighter(), d3.rgb(col).darker()]);

    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip-title")
        .style("opacity", 0);

    for (var i = 0; i < data.length; i++) {
        var dataState = data[i].State;
        var dataValue = data[i].details[option][2];
        // Find the corresponding state inside the GeoJSON
        for (var j = 0; j < json.features.length; j++) {           
            var jsonState = json.features[j].properties.name;
            if (dataState == jsonState) {
                // Copy the data value into the JSON
                json.features[j].properties[option] = dataValue;
                // Stop looking through the JSON
                break;
            }
        }
    }

    // D3 Projection
    var projection = d3.geoAlbersUsa()
                   .translate([1000 / 2, 500 / 2]) // translate to center of screen
                   .scale([1000]); // scale things down so see entire US
   
    // Define path generator
    var path = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
              .projection(projection); // tell path generator to use albersUsa projection
           
    var label = document.createElement('LABEL');
    var t = document.createTextNode(option);
    label.style.fontSize = "55px";
    label.style.fontFamily = "garamond";  
    label.appendChild(t);
    var kk = document.createElement('div');
    kk.style.float = "right";
    kk.style.paddingTop = "60px";
    kk.appendChild(label);

    document.getElementById('map-view').appendChild(kk);

    // Bind the data to the SVG and create one path per GeoJSON feature
    var svg = d3.select("#map-view")
            .append("svg")
            .attr("width", 1500)
            .attr("height", 500);
            
    svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "#fff")
        .style("stroke-width", "1")
        .style("fill", function(d) {

    var val = d.properties[option];

    if (val) return color(val);
    else return "rgb(213,222,217)";
    
    })
        .on("mouseover", function(d) {

            for (i = 0; i < data.length; i++) {
                if (data[i].State.toLowerCase() === d.properties["name"].toLowerCase()) {
                    var stateData = data[i];
                    var tooltip_data = {
                        "state": stateData.State,
                        "avgpopulation": stateData.details.Population[2],
                        "value2015": stateData.details[option][0],
                        "value2016": stateData.details[option][1],
                        "percentchange": stateData.details[option][3]
                    };
                    var body = tooltip_render(tooltip_data);
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(
                        body
                    );
                    tooltip.style("left", (d3.event.pageX) + "px");
                    tooltip.style("top", (d3.event.pageY) + "px");
                    
                }
            }
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        })

    }

function updateMap(value) {
       d3.json("dbase.json", function(error, allData) {

       d3.json("us-state-centroid.json", function(json) {
            createMap(value,json,allData.dbase);
        });
    });

}

updateMap("Population");
