/**
 * Created by hen on 2/20/14.
 */
    var bbVis, brush, createVis, dataSet, handle, height, margin, svg, svg2, width;

    margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 150
    };

    width = 960 - margin.left - margin.right;

    height = 300 - margin.bottom - margin.top;

    bbVis = {
        x: 0 + 100,
        y: 10,
        w: width - 100,
        h: 100
    };

    dataSet = [];

    svg = d3.select("#vis").append("svg").attr({
        width: width + margin.left + margin.right,
        height: height + margin.top + margin.bottom
    }).append("g").attr({
            transform: "translate(" + margin.left + "," + margin.top + ")"
        });
		
	var line = d3.svg.line()
	    .x(function(d) { return x(d.Year); })
	    .y(function(d) { return y(d.Census); });

	var x = d3.scale.linear()
	    .range([0, width]);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");
			
    d3.csv("data.csv", function(data) {
		var censusData = []
        // convert your csv data and add it to dataSet
		data.forEach(function(d){
			d.Year = parseInt(d.Year);
			d.Census = parseInt(d["United States Census Bureau (2009) [4 ]"])
			if (!isNaN(d.Census)){
				censusData.push(d)
			}
		})
		console.log(censusData);
		
		x.domain(d3.extent(data, function(d) { return d.Year; }));
		y.domain([0, d3.max(data, function(d) { return d.Census; })]);

		  svg.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + height + ")")
		      .call(xAxis);

		  svg.append("g")
		      .attr("class", "y axis")
		      .call(yAxis)
		    .append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end");

		  svg.append("path")
		      .datum(censusData)
		      .attr("class", "line")
		      .attr("d", line);
		
		
        return createVis();
    });

    createVis = function() {
        var xAxis, xScale, yAxis,  yScale;

          xScale = d3.scale.linear().domain([0,100]).range([0, bbVis.w]);  // define the right domain generically

		  // example that translates to the bottom left of our vis space:
		  var visFrame = svg.append("g").attr({
		      "transform": "translate(" + bbVis.x + "," + (bbVis.y + bbVis.h) + ")",
		  	  //....
			  
		  });
		  
		  visFrame.append("rect");
		  //....
		  
//        yScale = .. // define the right y domain and range -- use bbVis

//        xAxis = ..
//        yAxis = ..
//        // add y axis to svg !


    };