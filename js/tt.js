// The code below has been adapted from ..............



 function tooltip_render(tooltip_data) {

    var text = "<h5>" + tooltip_data.state + "</h5>";
    text += "<ul>";
    text += "<li> <strong>Population:</strong> " + tooltip_data.population + "</li>";
    text += "<li> <strong> Price per foot:</strong> " + tooltip_data.price + "</li>";
    text += "<li> <strong>Mortality Rate:</strong> " + tooltip_data.mortality + "</li>";
    text += "<li> <strong>Average Salary:</strong> " + tooltip_data.salary + "</li>";
    text += "<li> <strong>Unemployement Rate:</strong> " + tooltip_data.unemployement + "</li>";
    text += "</ul>";

    return text;
}


 

function createMap(option, json, data) {

    for (var m = 0; m<(json.features.length)-45; m++ ) {console.log(json.features[m],"pp");}

    var value = option;
    var col = "rgb(67, 217, 117)";
    var yMin = d3.min(data, function(d) {
        console.log(d, d[value]);
        return d[value];
    });
    console.log(yMin)
    var yMax = d3.max(data, function(d) {
        return d[value];
    });

    var color = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([d3.rgb(col).brighter(), d3.rgb(col).darker()]);

    //adding tooltip
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip-title")
        .style("opacity", 0);

    for (var i = 0; i < data.length; i++) {

        // Grab State Name
        var dataState = data[i].RegionName;

        // Grab data value
        var dataValue = data[i][value];

        // Find the corresponding state inside the GeoJSON
        for (var j = 0; j < json.features.length; j++) {
            var jsonState = json.features[j].properties.name;

            if (dataState == jsonState) {

                // Copy the data value into the JSON
                json.features[j].properties[value] = dataValue;

                // Stop looking through the JSON
                break;
            }
        }
    }



    // D3 Projection
    var projection = d3.geoAlbersUsa()
                   .translate([760 / 2, 500 / 2]) // translate to center of screen
                   .scale([1000]); // scale things down so see entire US
   
    // Define path generator
    var path = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
              .projection(projection); // tell path generator to use albersUsa projection
           


    // Bind the data to the SVG and create one path per GeoJSON feature

    //d3.select("body").append("p").text("title");

    var element = document.createElement("div");
    element.appendChild(document.createTextNode('Title'));
    document.getElementById('map-view').appendChild(element);

    var svg = d3.select("#map-view")
            .append("svg")
            .attr("width", 760)
            .attr("height", 500);
            console.log(json.features);
            console.log("sikri");
            

    svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "#fff")
        .style("stroke-width", "1")
        .style("fill", function(d) {

            //Get data value
            //console.log("juna");
    var val = d.properties[value];

            if (val) {
                return color(val);
            } else {
                return "rgb(213,222,217)";
            }
        })
        .on("mouseover", function(d) {

            for (i = 0; i < data.length; i++) {
                if (data[i]['RegionName'].toLowerCase() === d.properties["name"].toLowerCase()) {
                    var stateData = data[i];
                    var tooltip_data = {
                        "state": stateData["RegionName"],
                        "price": stateData["PRICE/FT."],
                        "population": stateData["POPULATION"],
                        "unemployement": stateData["UNEMPLOYMENT_RATE"],
                        "salary": stateData["AVERAGE_SALARY/MON"],
                        "mortality": stateData["MORTALITY_RATE"]
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


    console.log("ttt");
d3.csv("2016_us_states_data.csv", function(error, allData) {

    allData.forEach(function(d) {
        // Convert numeric values to 'numbers'
        d['POPULATION'] = +d['POPULATION'];
        d['UNEMPLOYMENT_RATE'] = +d['UNEMPLOYMENT_RATE'];
        d['AVERAGE_SALARY/MON'] = +d['AVERAGE_SALARY/MON'];
        d['MORTALITY_RATE'] = +d['MORTALITY_RATE'];
        d['PRICE/FT.'] = +d['PRICE/FT.'];
    });

    
    d3.json("us-state-centroid.json", function(json) {
        createMap('UNEMPLOYMENT_RATE',json,allData);
    });

});


function updateMap(value) {
    /*console.log("pp");
    var map = d3.select("#map-view").selectAll("path");
    map.remove().exit();
    //document.getElementById('table').innerHTML = '';
    //console.log(json);
    var json = d3.json("us-state-centroid.json", function(json) {console.log("ii");return json.features;});
    console.log("jhjh");
    console.log(json);
    var data = function() {return (d3.csv("2016_us_states_data.csv", function(data) {return data}))};
    console.log("pptt");
    createMap(value,json,data);
*/

//var map = d3.select("#map-view").selectAll("path");
    //map.remove().exit();
    /*setTimeout(function(){
        what();
        function what(){
            document.getElementById('body').remove();
        };
     }, 50);*/
    

     /*
    window.onload = function (){
        
        };
        */
    

    d3.csv("2016_us_states_data.csv", function(error, allData) {

        allData.forEach(function(d) {
            // Convert numeric values to 'numbers'
            d['POPULATION'] = +d['POPULATION'];
            d['UNEMPLOYMENT_RATE'] = +d['UNEMPLOYMENT_RATE'];
            d['AVERAGE_SALARY/MON'] = +d['AVERAGE_SALARY/MON'];
            d['MORTALITY_RATE'] = +d['MORTALITY_RATE'];
            d['PRICE/FT.'] = +d['PRICE/FT.'];
        });
    
        
        d3.json("us-state-centroid.json", function(json) {
            createMap(value,json,allData);
        });
    
    });


}
