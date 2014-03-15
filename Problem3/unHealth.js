var bbDetail, bbOverview, dataSet, svg;

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 80
};

var width = 960 - margin.left - margin.right;

var height = 800 - margin.bottom - margin.top;

bbOverview = {
    x: 0,
    y: 10,
    w: width,
    h: 50
};

bbDetail = {
    x: 0,
    y: 100,
    w: width,
    h: 300
};


	
dataSet = [];

svg = d3.select("#visUN").append("svg").attr({
    width: width + margin.left + margin.right,
    height: height + margin.top + margin.bottom
}).append("g").attr({
        transform: "translate(" + margin.left + "," + margin.top + ")"
});

var detailFrame = svg.append("g").attr({
  "transform": "translate(" + bbDetail.x + "," + bbDetail.y + ")",
  "class": "detail-frame",
  "height": bbDetail.h
})

var overviewFrame = svg.append("g").attr({
  "transform": "translate(" + bbOverview.x + "," + bbOverview.y + ")",
  "class": "detail-frame",
  "height": bbOverview.h
})



d3.csv("data.csv", function(data) {
console.log(data[3])	



	var yOverview = d3.scale.linear()
	    .range([bbOverview.h, 0]);

	var xOverview = d3.time.scale()
	    .range([0, width]);

	var xAxisOverview = d3.svg.axis()
	    .scale(xOverview)
	    .orient("bottom");

	var yAxisOverview = d3.svg.axis()
		.tickValues([0, 100000, 200000, 300000])
	    .scale(yOverview)
	    .orient("left");



	var yDetail = d3.scale.linear()
	    .range([bbDetail.h, 0]);

	var xDetail = d3.time.scale()
	    .range([0, width]);

	var xAxisDetail = d3.svg.axis()
	    .scale(xDetail)
	    .orient("bottom");

	var yAxisDetail = d3.svg.axis()
	    .scale(yDetail)
	    .orient("left");

		var lineOverview = d3.svg.line()
			.x(function(d){
				return xOverview(format.parse(d["Analysis Date"]));
			})
			.y(function(d){
				return yOverview(d["Women's Health"]);
			})

	var lineDetail = d3.svg.line()
		.x(function(d){
			return xDetail(format.parse(d["Analysis Date"]));
		})
		.y(function(d){
			return yDetail(d["Women's Health"]);
		})
		
		var format = d3.time.format("%B %Y")
		var startDate = format(new Date("September 2009"))
		var endDate = format(new Date("January 2014"))
		
		console.log(startDate)
		xDetail.domain([format.parse("September 2009"), format.parse("January 2014")])
		yDetail.domain([0, 300000])
		
		xOverview.domain([format.parse("September 2009"), format.parse("January 2014")])
		yOverview.domain([0, 300000])
		
  	  detailFrame.append("g")
  	      .attr("class", "x axis")
  	      .attr("transform", "translate(0," + bbDetail.h + ")")
  	      .call(xAxisDetail);

  	  detailFrame.append("g")
  	      .attr("class", "y axis")
  	      .call(yAxisDetail)
  	      .append("text")
  	      .attr("transform", "rotate(-90)")
  	      .attr("y", 6)
  	      .attr("dy", ".71em")
  	      .style("text-anchor", "end");

  	  overviewFrame.append("g")
  	      .attr("class", "x axis")
  	      .attr("transform", "translate(0," + bbOverview.h + ")")
  	      .call(xAxisOverview);

  	  overviewFrame.append("g")
  	      .attr("class", "y axis")
  	      .call(yAxisOverview)
  	      .append("text")
  	      .attr("transform", "rotate(-90)")
  	      .attr("y", 6)
  	      .attr("dy", ".71em")
  	      .style("text-anchor", "end");

	function drawLine(data, line){
	  	  	detailFrame.append("path")
	  	 		  .datum(data)
	  		      .attr("d", lineDetail)
	  		  	  .attr("stroke-width", 1)
	  		  	  .attr("opacity", 1)
				  .attr("stroke", "black")
				  .attr("fill", "none");
				  console.log("drawline")


  	  	  	overviewFrame.append("path")
  	  	 		  .datum(data)
  	  		      .attr("d", lineOverview)
  	  		  	  .attr("stroke-width", 1)
  	  		  	  .attr("opacity", 1)
  				  .attr("stroke", "black")
  				  .attr("fill", "none");
  				  console.log("drawline")
		  }
	drawLine(data)
	
});

var convertToInt = function(s) {
    return parseInt(s.replace(/,/g, ""), 10);
};

