/**
 * Created by hen on 2/20/14.
 */
    var bbVis, brush, createVis, dataSet, handle, height, margin, svg, svg2, width;

    margin = {
        top: 0,
        right: 50,
        bottom: 50,
        left: 100
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
		
		var popRefLine = null
		var maddisonLine = null
		var hydeLine = null
		var socialAffairsLine = null
		var censusLine = null
		
		function interpolate(data, column, columnData){
			var interpolated = []
			var range = null;
			var startyear = null;
			var startvalue = null;
			var endvalue = null;
			var startyear = null;
			var endyear = null;
			var hasValue = []
			//console.log(data, column, columnData)
			data.forEach(function(d,i){
				d.CurrentColumn = parseInt(d[column]);
				
				if(!isNaN(d.CurrentColumn)){
					hasValue.push(i)
				}
			})
			var firstValueIndex = d3.min(hasValue);
			
			data.forEach(function(dataitem,i){
				var d = {}
				d.Year = parseInt(dataitem.Year);
				d.CurrentColumn = parseInt(dataitem[column]);
				
				if(range == null){
					if(!isNaN(d.CurrentColumn)){
						columnData.push({
							Year: d.Year,
							CurrentColumn: d.CurrentColumn,
							inter: false
						})
						startvalue = d.CurrentColumn
						startyear = d.Year
					}else{
						if(i>=firstValueIndex){
						range = {start:i}
					}
						//interpolated.push(range, startvalue)
						//console.log("pushed " + d.Year +" "+ startvalue)
					}
				}
				else{
					if(!isNaN(d.CurrentColumn)){
						
						range.end = i
						endvalue = d.CurrentColumn
						var slope = (endvalue - startvalue) / (d.Year - startyear)
						var interpolateCount = parseInt(i) - parseInt(range.start);
						for(var i = 0; i < interpolateCount-1; i++){						
							var tempYear = parseInt(data[range.start + i].Year);
							var offset = tempYear - startyear
							columnData.push({
								Year: tempYear,
								CurrentColumn: startvalue + (slope * offset),
								inter: true
							})
							//console.log("pushed interpolated "+ tempYear)
						}
						columnData.push({
							Year: d.Year,
							CurrentColumn: d.CurrentColumn,
							inter: false
						})
						startvalue = d.CurrentColumn
						startyear = d.Year
						range = null
					}
				}
			})
		}


				
		interpolate(data,"Population Reference Bureau", popRefData)
		var popRefLine = d3.svg.line()
			    .x(function(d) { return x(d.Year); })
			    .y(function(d) {return y(d.CurrentColumn); });
					
		interpolate(data,"United States Census Bureau (2009) [4 ]", censusData)
		var censusLine = d3.svg.line()
				    .x(function(d) { return x(d.Year); })
				    .y(function(d) { return y(d.CurrentColumn); });
		
		interpolate(data,"United Nations Department of Economic and Social Affairs (2008) [6 ]", socialAffairsData)
		var socialAffairsLine = d3.svg.line()
			    .x(function(d) { return x(d.Year); })
			    .y(function(d) { return y(d.CurrentColumn); });
		
		interpolate(data,"HYDE (2006) [7 ]", hydeData)
		var hydeLine = d3.svg.line()
			    .x(function(d) { return x(d.Year); })
			    .y(function(d) { return y(d.CurrentColumn); });
				
		interpolate(data,"Maddison (2003) [8 ]", maddisonData)
		var maddisonLine = d3.svg.line()
		    .x(function(d) { return x(d.Year); })
		    .y(function(d) { return y(d.CurrentColumn); });

		//x.domain(d3.extent(data, function(d) { return d.Year; }));
		x.domain([0, 2050])
		///y.domain([0, d3.max(data, function(d) { return d.Census; })]);
		y.domain([0, 9500000000])
		
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
	
		  function drawLine(data, line, dataClass){
	  	  	svg.append("path")
	  	 		  .datum(data)
	  		      .attr("class", dataClass + " line")
	  		      .attr("d", line)
	  		  	  .attr("stroke-width", 1)
	  		  	  .attr("opacity", 1);
		  }
		  
		  drawLine(popRefData, popRefLine, "PopRef")
		  drawLine(censusData, censusLine, "Census")
		  drawLine(socialAffairsData, socialAffairsLine, "SocialAffairs")
		  drawLine(hydeData, hydeLine, "Hyde")
		  drawLine(maddisonData, maddisonLine, "Maddison")
		  function drawDots(dataClass, data){
			  svg.selectAll("."+dataClass +" .Inter")
			  .data(data)
			  .enter()
			  .append("circle")
 			  .attr("class", (function(d,i){
 				 if (d.inter == true){
 					  return dataClass +" Inter";
 		 			}else{
 		 				return dataClass;
 		 			}}))
   			 .attr("cx", (function(d,i) { console.log(d.Year); return x(d.Year);}))
   		  	 .attr("cy",(function(d) { return y(d.CurrentColumn);}))
   			 .attr("r",2)
			 .on("mouseover", function(d){
			  if (d.inter == true){
				  d3.select("#label")
			  	.html(dataClass + " estimated the population at year "+ d.Year+" to be "+ d.CurrentColumn);
				}else{
	  			  d3.select("#label")
				.html(dataClass + " has no estimates at year "+ d.Year+", the interpolated value is "+ d.CurrentColumn);
				}})
		.on("mouseout", function(d){
		  d3.select("#label")
		  .html("");
		});
		  
	}

		  drawDots("Census", censusData)
		  drawDots("SocialAffairs", socialAffairsData)
		  drawDots("PopRef", popRefData)
		  drawDots("Hyde", hydeData)
		  drawDots("Maddison", maddisonData)

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