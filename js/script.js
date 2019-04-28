var usaMap;

d3.csv("2016_us_states_data.csv", function(error, allData) {

    allData.forEach(function(d) {
        // Convert numeric values to 'numbers'
        d['POPULATION'] = +d['POPULATION'];
        d['UNEMPLOYMENT_RATE'] = +d['UNEMPLOYMENT_RATE'];
        d['AVERAGE_SALARY/MON'] = +d['AVERAGE_SALARY/MON'];
        d['MORTALITY_RATE'] = +d['MORTALITY_RATE'];
        d['PRICE/FT.'] = +d['PRICE/FT.'];
    });

    usaMap = new Map(allData);
    d3.json("us-state-centroid.json", function(json) {
        usaMap.drawMap(json, 'unemployement');
    });

});

function updateMap(value) {
    var map = d3.select("#map-view").selectAll("path");
    map.remove().exit();
    document.getElementById('table').innerHTML = '';
    usaMap.updateMap(value);
}

