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

    height = 500 - margin.bottom - margin.top;

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

	var censusLine = d3.svg.line()
		    .x(function(d) { return x(d.Year); })
		    .y(function(d) { return y(d.Census); });			
	var socialAffairsLine = d3.svg.line()
		    .x(function(d) { return x(d.Year); })
		    .y(function(d) { return y(d.SocialAffairs); });
	var hydeLine = d3.svg.line()
		    .x(function(d) { return x(d.Year); })
		    .y(function(d) { return y(d.Hyde); });
	var maddisonLine = d3.svg.line()
		    .x(function(d) { return x(d.Year); })
		    .y(function(d) { return y(d.Maddison); });
	var popRefLine = d3.svg.line()
		    .x(function(d) { return x(d.Year); })
		    .y(function(d) { return y(d.PopRef); });

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
		var socialAffairsData = []
		var hydeData = []
		var maddisonData = []
		var popRefData =[]
        // convert your csv data and add it to dataSet
		data.forEach(function(d){
			d.Year = parseInt(d.Year);
			d.Census = parseInt(d["United States Census Bureau (2009) [4 ]"])
			d.PopRef = parseInt(d["Population Reference Bureau (1973–2008) [5 ]"])
			d.SocialAffairs = parseInt(d["United Nations Department of Economic and Social Affairs (2008) [6 ]"])
			d.Hyde = parseInt(d["HYDE (2006) [7 ]"])
			d.Maddison = parseInt(d["Maddison (2003) [8 ]"])
			//console.log(d.SocialAffairs);
			
			if (!isNaN(d.Census)){
				censusData.push(d)
			}
			if(!isNaN(d.SocialAffairs)){
				socialAffairsData.push(d)
			}
			if(!isNaN(d.Hyde)){
				hydeData.push(d)
			}
			if(!isNaN(d.Maddison)){
				maddisonData.push(d)
			}
			if(!isNaN(d.PopRef)){
				popRefData.push(d)
			}
		})
		
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
		      .attr("d", censusLine)
			  .attr("stroke", "#373F55")
			  .attr("stroke-width", 1)
			  .attr("opacity", 0.5);
		  svg.append("path")
		      .datum(socialAffairsData)
		      .attr("class", "line")
		      .attr("d", socialAffairsLine)
			  .attr("stroke", "#5E7FD7")
			  .attr("stroke-width", 1)			  
			  .attr("opacity", 0.5);
		  svg.append("path")
		      .datum(hydeData)
		      .attr("class", "line")
		      .attr("d", hydeLine)
			  .attr("stroke", "#B0B4C5")
			  .attr("stroke-width", 1)
			  .attr("opacity", 0.5);
		  svg.append("path")
		      .datum(maddisonData)
		      .attr("class", "line")
		      .attr("d", maddisonLine)
			  .attr("stroke", "#506994")
			  .attr("stroke-width", 1)
			  .attr("opacity", 0.5);
		  svg.append("path")
		      .datum(popRefData)
		      .attr("class", "line")
		      .attr("d", popRefLine)
			  .attr("stroke", "#88ABDD")
			  .attr("stroke-width", 1)
			  .attr("opacity", 0.5);
			  
  		svg.selectAll(".Census.circle").data(censusData)
  			  .enter()
  	 		 .append("circle")
  			 .attr("class", "Census circle")
  			 .attr("fill", "#373F55")
  			 .attr("cx", (function(d,i) { return x(d.Year);}))
  		  	 .attr("cy",(function(d) { return y(d.Census);}))
  			 .attr("r",2)
			 .attr("opacity", 0.5);	  	  
		 svg.selectAll(".SocialAffairs.circle")
			 .data(socialAffairsData)
			 .enter()
	 		 .append("circle")
			 .attr("class", "SocialAffairs circle")
			 .attr("fill", "#5E7FD7")
			 .attr("cx", (function(d,i) { return x(d.Year);}))
		  	 .attr("cy",(function(d) { return y(d.SocialAffairs);}))
			 .attr("r", 2)
			 .attr("opacity", 0.5);
		svg.selectAll(".Maddison.circle")
			 .data(maddisonData)
  			 .enter()
  	 		 .append("circle")
  			 .attr("class", "Maddison circle")
  			 .attr("fill", "#506994")
  			 .attr("cx", (function(d,i) { return x(d.Year);}))
  		  	 .attr("cy",(function(d) { return y(d.Maddison);}))
  			 .attr("r",2)
			 .attr("opacity", 0.5);
  		svg.selectAll(".Hyde.circle").data(hydeData)
  			 .enter()
  	 		 .append("circle")
  			 .attr("class", "Hyde circle")
  			 .attr("fill", "#B0B4C5")
  			 .attr("cx", (function(d,i) {  return x(d.Year);}))
  		  	  .attr("cy",(function(d) { return y(d.Hyde);}))
  			  .attr("r",2)
			  .attr("opacity", 0.5);
  		svg.selectAll(".popRef .circle")
			.data(popRefData)
  			  .enter()
  	 		 .append("circle")
  			 .attr("class", "popRef circle")
  			 .attr("fill", "#88ABDD")
  			 .attr("cx", (function(d,i) {  return x(d.Year);}))
  		  	  .attr("cy",(function(d) { return y(d.popRef);}))
  			  .attr("r",2)
			  .attr("opacity", 0.5);
  		

		
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