{
const diagramm = document.getElementById('impactDiagramm');
const margin = { top: 50, left: 50, right: 50, bottom: 50 };

const visualisierung = d3.select(diagramm).append('svg');


//different values for diagramm sizes
const svgSize ={width: diagramm.clientWidth, height: window.innerHeight};
const size = Math.min(svgSize.width, svgSize.height) - 125;
var circleRadius = [size * 0.25, size * 0.35, size * 0.5];

//creating svg image for diagramm
visualisierung
  .attr("width", svgSize.width)
  .attr("height", size * 1.3)
  .style("overflow", 'visible');

//creating groups for different graph parts
const outerGraph = visualisierung.append('g')
  .attr('id', 'outerGraph')
  .attr("transform", `translate(${svgSize.width / 2},${size / 2})`);

const innerGraph = visualisierung.append('g')
  .attr('id', 'innerGraph')
  .attr("transform", `translate(${svgSize.width / 2},${size / 2})`);

const legende = visualisierung.append('g')
  .attr('id', 'legende')
  .attr("transform", `translate(${size * 0.5 - 150},${size * 1.05})`)



//data
var outerData = impactData;
var innerData = [2, 5, 10];
var selectedOuterTotal = -1;
const totalSum = impactData.map(d => Number(d.total)).reduce((a,b) => a+b, 0);

//handling description & titel
const titel = document.getElementById('titel');
const description = document.getElementById('description');
const tooltip = document.getElementById('tooltip');

//handling pie generation
var outerPie = d3.pie().value((d)=>d.total);
var innerPie = d3.pie();
var outerArcs = outerPie(outerData);
var innerArcs = innerPie(innerData);

//Scales: color & labels
var innerColor = d3.scaleOrdinal()
  .domain(innerData)
  .range(["#fff176", "#ff8a65", "#e57373"]);

var innerlabelScale = d3.scaleOrdinal()
  .domain(innerData)
  .range(["Niedrig", "Mittel", "Hoch"]);

var outerColor = d3.scaleOrdinal()
  .domain(outerData)
  .range(["#4fc3f7", "#9575cd", "#e57373", "#ff8a65", "#fff176", "#81c784"]);


//on selecting the outer ring
function onSelectingBigGraphSegment(data){
  //updating the tooltip
  titel.textContent = String(data.impactType);
  description.textContent = String(data.description);
  let percentage = Math.round(data.total / totalSum * 10000)/ 100;
  tooltip.textContent = String("Prozent: " + percentage + "% Total: " + (data.total));

  //updating data
  selectedOuterTotal = Number(data.total);
  //creating second layer of visual
  innerData = [data.low, data.middle, data.high];
  innerArcs = innerPie(innerData);

  var arcGen = d3.arc()
    .innerRadius(0)
    .outerRadius(circleRadius[0]);

  innerGraph.selectAll('path').transition()
  .duration(250)
  .attr('opacity', 0)
  .remove()
  
  innerGraph.selectAll('path').exit().remove();

  innerGraph.selectAll('path')
  .data(innerArcs)
  .enter()
  .append('path')
  .merge(innerGraph.selectAll('path')
  .data(innerArcs))
  .attr('opacity', 0)
  .attr('fill', (d) => innerColor(d))
  .attr('d', d3.arc()
    .innerRadius(0)       
    .outerRadius(1))
  .transition()
  .duration(1000)
  .attr('opacity', 1)
  .attr('d', arcGen)
//innerGraph: setting the labels
  innerGraph.selectAll('text')
  .data(innerArcs)
  .join('text')
  .text((d) => innerlabelScale(d) + " " + Math.round(d.value / selectedOuterTotal * 100) + "%")
  .attr("transform", function(d) {return `translate(${arcGen.centroid(d)})`})
  .style("text-anchor", "middle")
  .style("font-size", 14)
  .style('fill', '#333333')
}
//handles the selection Animation vor outerGraph Segments
function outerGraphSelectAnimation(data){
  outerGraph.selectAll('path').each(function(d,i){
    if(data != this.__data__.data) return; //filters to play animation only on clicked Segment

    //expands selected Segement and turns fully opaque
    d3.select(this).transition()
    .duration('1000')
    .attr('opacity', 1)
    .attr('d', d3.arc()
    .innerRadius(circleRadius[1])         
    .outerRadius(circleRadius[2]));

  //shrinks & reduces opacity for all other Segments
  outerGraph.selectAll('path').filter((d,i) => this.__data__ != d).transition()
    .duration('1000')
    .attr('opacity', 0.4)
    .attr('d', d3.arc()
    .innerRadius(circleRadius[1])         
    .outerRadius(circleRadius[2] * 0.8));
    })

}
//creating the legende
const legendUnits = legende.selectAll('g')
  .data(outerData)
  .enter()
  .append('g')
  .attr('transform', (d,i) => `translate(${(i % 2) * 200},${legendHelper(i) * 30})`)

//add outline for legende
legende.selectAll('g')
  .append('rect')
  .attr('stroke', '#7D8F69')
  .attr('stroke-width', 1.5)
  .attr('width', (d,i) => (i % 2) * 55 + 195)
  .attr('height', 24)
  .attr('rx', 4)
  .attr('x', -5)
  .attr('y', -4)
  .attr('fill', 'transparent')
//helps with calculating the index for alignment
function legendHelper(i){
  if(i % 2 == 0) return (i / 2);
  else return ((i - 1) / 2);
}
//Legende: adds the color square to the legende
legendUnits.data(outerData)
  .append('rect')
  .attr('width', 15)
  .attr('height', 15)
  .attr('rx', 4)
  .attr('fill', (d) => outerColor(d));
//Legende: adds the text to the legende
legendUnits.data(outerData)
  .append('text')
  .attr('x', 20)
  .attr('y', 12.5)
  .attr('fill', 'white')
  .text( (d) => d.impactType)
//Legende: add onClick event (same effect as clicking on outerGraph segement)
.on('click', function (d, i) {
  onSelectingBigGraphSegment(i)
outerGraphSelectAnimation(i)})

//creating the outerGraph
outerGraph.selectAll('path')
  .data(outerArcs)
  .enter()
  .append('path')
  .attr('fill', (d) => outerColor(d))
  .attr('opacity', 1)
  .attr('d', d3.arc()
    .innerRadius(1)         
    .outerRadius(2));

//outerGraph: start animation
outerGraph.selectAll('path').transition()
  .duration(1000)
  .attr('d', d3.arc()
  .innerRadius(circleRadius[1])
  .outerRadius(circleRadius[2]));

//outerGraph: clicking on a Element
outerGraph.selectAll('path').on('click', function (d, i) {
  onSelectingBigGraphSegment(i.data);
  outerGraphSelectAnimation(i.data);
});

}
