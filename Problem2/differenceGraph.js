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
		var averageLine = null
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
		  
		function CalculateDeviation(){
			function firstLastYear(columnName){
				var hasValue =[]
				data.forEach(function(d,i){
					if(!isNaN(parseInt(d[columnName]))){
						hasValue.push(parseInt(d.Year))
					}
				})
				return [d3.min(hasValue), d3.max(hasValue)]
			}

			function mapDataByYear(dataList) {
				var output = {}
				for(var i in dataList) {
					output[dataList[i].Year] = dataList[i]
				}
				return output
			}

			var mappedCensusData = mapDataByYear(censusData)
			var mappedPopRefData = mapDataByYear(popRefData)
			var mappedMaddisonData = mapDataByYear(maddisonData)
			var mappedSocialAffairsData = mapDataByYear(socialAffairsData)
			var mappedhydeData = mapDataByYear(hydeData)

  		 var censusDataFirstLast = firstLastYear("United States Census Bureau (2009) [4 ]")
		 var popRefFirstLast = firstLastYear("Population Reference Bureau")
		 var maddisonFirstLast = firstLastYear("Maddison (2003) [8 ]")
		 var socialAffairsFirstLast = firstLastYear("United Nations Department of Economic and Social Affairs (2008) [6 ]")
		 var hydeFirstLast = firstLastYear("HYDE (2006) [7 ]")
		 		  //console.log(popRefData)
				  var average = []
			data.forEach(function(d,i){
				var sum = 0
				var count = 0
				var year = d.Year
				
				function calculateAverage(mappedDataset){
					if(mappedDataset[year] == undefined ){
						if (d.Year < popRefFirstLast[0]){
							count++
							sum +=0
						} else if (d.Year > popRefFirstLast[1]){
							count++
							sum += mappedDataset[popRefFirstLast[1]].CurrentColumn
						}
					} else {
						count++
						sum+= mappedDataset[year].CurrentColumn
					}		
								
				}
				calculateAverage(mappedCensusData)
				calculateAverage(mappedPopRefData)
				calculateAverage(mappedMaddisonData)
				calculateAverage(mappedSocialAffairsData)
				calculateAverage(mappedhydeData)
				var mean = sum/count
				average.push([year, mean])
			
				//console.log(year, mean)
			})
			return average			
		}
		var average = CalculateDeviation();
		console.log(average)
	
		var averageLine = d3.svg.line()
			.x(function(d,i){return x(d[0]);})
			.y(function(d){return y(d[1])})
			
		  function drawLine(data, line, dataClass){
	  	  	svg.append("path")
	  	 		  .datum(data)
	  		      .attr("class", dataClass + " line")
	  		      .attr("d", line)
	  		  	  .attr("stroke-width", 1)
	  		  	  .attr("opacity", .5);
		  }
		  
		  drawLine(popRefData, popRefLine, "notAverage")
		  drawLine(censusData, censusLine, "notAverage")
		  drawLine(socialAffairsData, socialAffairsLine,"notAverage")
		  drawLine(hydeData, hydeLine, "notAverage")
		  drawLine(maddisonData, maddisonLine,"notAverage")
		  
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
   			 .attr("cx", (function(d,i) {return x(d.Year);}))
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
		  drawLine(average, averageLine, "Average")

      
    });