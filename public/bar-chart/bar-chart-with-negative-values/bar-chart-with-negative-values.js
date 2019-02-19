let margin = {top: 20, right: 30, bottom: 40, left: 30};
let width = 960 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;

let x = d3.scale.linear ().range ([0, width]);

let y = d3.scale.ordinal ().rangeRoundBands ([0, height], 0.1);

let xAxis = d3.svg.axis ().scale (x).orient ('bottom');

let yAxis = d3.svg
  .axis ()
  .scale (y)
  .orient ('left')
  .tickSize (0)
  .tickPadding (6);

let svg = d3
  .select ('body')
  .append ('svg')
  .attr ('width', margin.left + margin.right + width)
  .attr ('height', margin.top + margin.right + height)
  .append ('g')
  .attr ('transform', 'translate(' + margin.left + ',' + margin.right + ')');

d3.tsv ('data/data.tsv', type, (error, data) => {
  x.domain (
      d3.extent (data, d => {
        return d.value;
      })
    )
    .nice ();
  y.domain (
    data.map (d => {
      return d.name;
    })
  );

  svg
    .selectAll ('.bar')
    .data (data)
    .enter ()
    .append ('rect')
    .attr ('class', d => {
      return 'bar bar--' + (d.value < 0 ? 'negative' : 'positive');
    })
    .attr ('x', d => {
      return x (Math.min (0, d.value));
    })
    .attr ('y', d => {
      return y (d.name);
    })
    .attr ('width', d => {
      return Math.abs (x (d.value) - x (0));
    })
    .attr ('height', y.rangeBand ());

  svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

svg.append("g")
  .attr("class", "y axis")
  .attr("transform", "translate(" + x(0) + ",0)")
  .call(yAxis);
});

function type (d) {
  d.value = +d.value;
  return d;
}
