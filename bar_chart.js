// Bar graph 

var w = 500;
var h = 150;
var padding = {left: 30, right: 10, top: 10, bottom: 30};
var barPadding = 1;
var max_val;
var barHeightFactor;
var barWidth;
var x;
var y;
var xAxis;
var yAxis;
var yAxisMinor;
var chartContainer;
var borderPath;
var barsContainer;

var incoming_runs_data = [[-21, 2], [-13, 2], [-12, 24], [-11, 3], [0,1]];
var incoming_error_data = [[-21, 1], [-13, 1], [-12, 26],[-11, 3]];
var formatted_runs_data = Array.apply(null, new Array(24)).map(Number.prototype.valueOf,0);
var formatted_error_data = Array.apply(null, new Array(24)).map(Number.prototype.valueOf,0);

function formatData(){
	for (var i=0; i<incoming_runs_data.length; i++){
		var loc = incoming_runs_data[i][0] * (-1); 	// location
		var val = incoming_runs_data[i][1]; 		// value
		formatted_runs_data[loc] = val;
	}
	for (var i=0; i<incoming_error_data.length; i++){
		var loc = incoming_error_data[i][0] * (-1);	// location
		var val = incoming_error_data[i][1];		// value
		formatted_error_data[loc] = val;
	}
}		
function calcBarHeightFactor(){
	var max_run = Math.max.apply(Math, formatted_runs_data);
	var max_error = Math.max.apply(Math, formatted_error_data);
	max_val = Math.max(max_run, max_error);
	barHeightFactor = (h) / max_val;
	console.log("barHeightFactor: " + barHeightFactor);
}
function calcBarWidth(){
	barWidth = (w / formatted_runs_data.length);
}

formatData();
calcBarHeightFactor();
calcBarWidth();

console.log(formatted_runs_data);
console.log(formatted_error_data);

chartContainer = d3.select("div").append("svg")
		.attr("width", w)
		.attr("height", h)
		.style("padding-left", padding.left)
		.style("padding-right", padding.right)
		.style("padding-top", padding.top)
		.style("padding-bottom", padding.bottom);
			
borderPath = chartContainer.append("g")
		.attr("class", "chart_border")
		.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("height", h)
		.attr("width", w-barPadding)
		.style("stroke", "#000")
		.style("fill", "none")
		.style("stroke-width", "none")
		.style("shape-rendering", "crispEdges");

barsContainer = chartContainer.append("g")
		.attr("class", "bar_group");
			



x = d3.scale.linear().range([w - barPadding, 0]);
y = d3.scale.linear().range([h, 0]);
//console.log("y: " + y);
x.domain([0, formatted_runs_data.length*(-1)]);
y.domain([0, max_val]);
xAxis = d3.svg.axis().scale(x).orient("bottom");
yAxis = d3.svg.axis().scale(y).orient("left");
//yAxisMinor = d3.svg.axis().scale(y).orient("left").ticks(4).tickSize(3,3).tickSubdivide(2).tickFormat('');
	 
var runs = barsContainer.append("g")
		.attr("class", "run_bars")
		.selectAll(".bars")
		.data(formatted_runs_data)
		.enter()
		.append("rect")
		.attr("x", function(d, i){
			return w - ((i+1) * barWidth); // start from the right
		})
		.attr("y", function(d){
			return h - (d * barHeightFactor)
		})
		.attr("width", barWidth - barPadding)
		.attr("height", function(d){
			return d * barHeightFactor;
		})
		.attr("fill", "#C3E4ED")
		.attr("opacity", "0.4");

var errors = barsContainer.append("g")
		.attr("class", "error_bars")
		.selectAll(".bars")
		.data(formatted_error_data)
		.enter()
		.append("rect")
		.attr("x", function(d, i){
			return w - ((i+1) * barWidth); // start from the right
		})
		.attr("y", function(d){
			return h - (d * barHeightFactor);
		})
		.attr("width", barWidth - barPadding)
		.attr("height", function(d){
			return d * barHeightFactor;
		})
		.attr("fill", "#ED5B4B")
		.attr("opacity", "0.4");
		 
var placeholders = barsContainer.append("g")
		.attr("class", "placeholder_bars")
		.selectAll(".bars")
		.data(formatted_runs_data)
		.enter()
		.append("rect")
		.attr("x", function(d, i){
			return  w - ((i+1) * barWidth); // start from the right
		})
		.attr("y", function(d){
			return 1;
		})
		.attr("width", barWidth - barPadding)
		.attr("height", function(d){
			return h;
		})
		.attr("fill", "#888")
		.attr("opacity", "0");
		 
		 

d3.select("svg").append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + h + ")")
		.call(xAxis);
d3.select("svg").append("g")
		.attr("class", "y axis")
		.call(yAxis);
//chartContainer.append("g")
		//.attr("class", "grid")
		//.
		 
    // Tooltip obj
    var tooltip = d3.select("body")
					.append("text")
					.attr("class", "tooltip")
					.style("position", "absolute")
					.style("z-index", "2010")
					.style("visibility", "hidden")
					.style("color", "black");

	d3.selectAll(".placeholder_bars rect")
		.on("mouseover", function(d, i){
			mouseover(d, i, this); 
			//console.log("after mouseover: " + this);
		})
		.on("mousemove", function(d, i){
			mousemove(d, i, this); 
		})
		.on("mouseout", function(d, i){ 
			mouseout(d, i, this); 
		});
		
    function mouseover(d, i, t){
		var id
		if (i>=formatted_runs_data.length){
			id = i-formatted_runs_data.length;
		}
		else{
			id = i;
		}
		//console.log("in mouseover: " + t);
		ith_child = parseInt(i+1);
		console.log("in mouseover: " + i);
		//console.log("in mouseover: " + runs[i]);
		
		//d3.select(t).attr("opacity", "0.7");
		d3.select("g.run_bars rect:nth-child(" + ith_child + ")").attr("opacity", "0.9");
		d3.select("g.error_bars rect:nth-child(" + ith_child + ")").attr("opacity", "0.7");
		//d3.select("g.placeholder_bars rect:nth-child(" + ith_child + ")").attr("opacity", "0.7");
		//d3.select(t).attr("opacity", "0.7");
		return tooltip.style("visibility", "visible");
    }
    function mousemove(d, i, t){
		//console.log("in mousemove: " + i);
		//console.log("in mousemove: " + d);
		tooltip.text(d); 
		return tooltip.style("top", (event.pageY-10)+"px")
						.style("left",(event.pageX+10)+"px");
    }
    function mouseout(d, i, t){
		ith_child = parseInt(i+1);
		d3.select("g.run_bars rect:nth-child(" + ith_child + ")").attr("opacity", "0.4");
		d3.select("g.error_bars rect:nth-child(" + ith_child + ")").attr("opacity", "0.4");
		//d3.select("g.placeholder_bars rect:nth-child(" + ith_child + ")").attr("opacity", "0");
		//d3.select(t).attr("opacity", "0.5");
		return tooltip.style("visibility", "hidden");
    }
