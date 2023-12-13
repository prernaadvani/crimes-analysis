// add your JavaScript/D3 to this file

// Define dimensions and margins for the chart
const margin = { top: 20, right: 20, bottom: 60, left: 40 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

// Append the svg object to the div with id="plot"
const svg = d3.select("#objects")
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Load the data
d3.json("../crime_stats.json").then(function(data) {
  // Group the data by Time_Period
  const sumByPeriod = d3.group(data, d => d.Time_Period);

  // Extract a list of boroughs
  const boroughs = [...new Set(data.map(d => d.BOROUGH))];

  // Create a color scale
  const color = d3.scaleOrdinal()
    .domain(boroughs)
    .range(d3.schemeCategory10);

  // Create a scale for the x-axis
  const x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1)
    .domain(Array.from(sumByPeriod.keys()));

  const x1 = d3.scaleBand()
    .padding(0.05)
    .domain(boroughs)
    .rangeRound([0, x0.bandwidth()]);

  // Create a scale for the y-axis
  const y = d3.scaleLinear()
    .rangeRound([height, 0])
    .domain([0, d3.max(data, d => d.Total_Crimes)]).nice();

  // Add the x-axis
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x0));

  // Add the y-axis
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add the bars
  const period = svg.selectAll(".period")
    .data(Array.from(sumByPeriod))
    .join("g")
      .attr("class", "period")
      .attr("transform", d => `translate(${x0(d[0])},0)`);

  period.selectAll("rect")
    .data(d => d[1])
    .join("rect")
      .attr("x", d => x1(d.BOROUGH))
      .attr("y", d => y(d.Total_Crimes))
      .attr("width", x1.bandwidth())
      .attr("height", d => height - y(d.Total_Crimes))
      .attr("fill", d => color(d.BOROUGH));

  // Add a legend
  const legend = svg.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "end")
    .selectAll("g")
    .data(boroughs.slice().reverse())
    .join("g")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

  legend.append("rect")
    .attr("x", width - 19)
    .attr("width", 19)
    .attr("height", 19)
    .attr("fill", color);

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9.5)
    .attr("dy", "0.32em")
    .text(d => d);
});

