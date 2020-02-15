/* Dataset */
let dataset = [];

/* Get data */
let getData = (() => {
  let dataUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      dataset = JSON.parse(this.responseText);
      main(dataset);
    }
  }
  xhttp.open("GET", dataUrl, true);
  xhttp.send();
})()

/* Main Function */
let main = (data) => {

  /* Constants */
  const MARGIN = { top: 100, right: 50, bottom: 30, left: 80 };
  const W = 920 - MARGIN.left - MARGIN.right;
  const H = 630 - MARGIN.top - MARGIN.bottom;
  const PADDING = 60;

  /* Define the div for the tooltip */
  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .attr("id", "tooltip")
    .style("opacity", 0);

  /* Change data */
  data.forEach(d => {
    let time = d.Time.split(':');
    d.Time = new Date(1970, 0, 1, 0, time[0], time[1]);
  })

  /* SVG */
  const svg = d3.select("body")
    .append("svg")
    .attr("width", W + MARGIN.left + MARGIN.right)
    .attr("height", H + MARGIN.top + MARGIN.bottom)
    .attr("transform", "translate(" + 300 + "," + 50 + ")");

  /* Scale */
  const xScale = d3.scaleLinear()
    .domain([d3.min(data, (d) => d.Year - 1), d3.max(data, (d) => d.Year + 1)])
    .range([PADDING, W - PADDING]);

  const yScale = d3.scaleTime()
    .domain([d3.max(data, d => d.Time), d3.min(data, d => d.Time)])
    .range([H, 0]);


  /* Axis */
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  svg.append("g")
    .attr('id', 'x-axis')
    .attr("transform", "translate(0," + (H) + ")")
    .call(xAxis);

  svg.append("g")
    .attr('id', 'y-axis')
    .attr("transform", "translate(" + PADDING + ", 0)")
    .call(yAxis);

  svg.append('text')
    .attr("transform", "rotate(-90)")
    .attr('x', -250)
    .attr('y', 15)
    .style('font-size', 6)
    .text('Time in Minutes');

  /* Legend */
  svg.append('text')
    .attr('id', 'legend')
    .attr('x', 550)
    .attr('y', 315)
    .style('font-size', 6)
    .text('No doping allegations');

  svg.append("rect")
    .attr("x", 520)
    .attr('y', 300)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", "crimson");

  svg.append('text')
    .attr('id', 'legend')
    .attr('x', 550)
    .attr('y', 345)
    .style('font-size', 6)
    .text('Riders with doping allegations');

  svg.append("rect")
    .attr("x", 520)
    .attr('y', 330)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", "cadetblue");

  /* Circles */
  svg.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => xScale(d.Year))
    .attr("cy", (d) => yScale(d.Time))
    .attr("r", (d) => 5)
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => d.Time.toISOString())
    .style("fill", d => d.Doping !== "" ? "cadetblue" : "crimson")

    .on("mouseover", function (d) {
      div.style("opacity", .9);
      div.attr("data-year", d.Year)
      div.attr('x', 200)
      svg.selectAll(".dot").append('title').text(d =>
        `${d.Name}: ${d.Nationality}\n Year: ${d.Year}, Time: ${d.Time.getMinutes()}:${d.Time.getSeconds()}\n ${d.Doping}`
      );
    })
    .on("mouseout", function (d) {
      div.style("opacity", 0);
    });
}// End main function