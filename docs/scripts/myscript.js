// add your JavaScript/D3 to this file

// Define dimensions and margins for the chart
const width = 450,
    height = 450,
    margin = 40;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
const radius = Math.min(width, height) / 2 - margin;

// append the svg object to the div called 'plot'
const svg = d3.select("#plot")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", `translate(${width/2}, ${height/2})`);

// create 5 data sets
const data1 = {BURGLARY: 4, FELONY_ASSAULT: 26, GRAND_LARCENY:91, GRAND_LARCENY_MV:2, MURDER:1, RAPE: 3, ROBBERY: 16}
const data2 = {BURGLARY: 0, FELONY_ASSAULT: 6, GRAND_LARCENY:13, GRAND_LARCENY_MV:0, MURDER:1, RAPE: 0, ROBBERY: 31}
const data3 = {BURGLARY: 3, FELONY_ASSAULT: 35, GRAND_LARCENY:45, GRAND_LARCENY_MV:2, MURDER:0, RAPE: 0, ROBBERY: 13}
const data4 = {BURGLARY: 1, FELONY_ASSAULT: 43, GRAND_LARCENY:24, GRAND_LARCENY_MV:4, MURDER:0, RAPE: 1, ROBBERY: 21}
const data5 = {BURGLARY: 0, FELONY_ASSAULT: 16, GRAND_LARCENY:0, GRAND_LARCENY_MV:0, MURDER:0, RAPE: 1, ROBBERY: 0}

// set the color scale
const color = d3.scaleOrdinal()
  .domain(["BURGLARY", "FELONY_ASSAULT", "GRAND_LARCENY", "GRAND_LARCENY_MV", "MURDER", "RAPE", "ROBBERY"])
  .range(d3.schemeDark2);

function update(data) {

  // Compute the position of each group on the pie:
  const pie = d3.pie()
    .value(function(d) {return d[1]; })
    .sort(function(a, b) { return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
  const data_ready = pie(Object.entries(data))

  // map to data
  const u = svg.selectAll("path")
    .data(data_ready)

  // Build the pie chart:
  u
    .join('path')
    .transition()
    .duration(1000)
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
    )
    .attr('fill', function(d){ return(color(d.data[0])) })
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 1)

}

// Initialize the plot with the first dataset
update(data1)
