const diagramm = document.getElementById('impactDiagramm');
const margin = { top: 50, left: 50, right: 50, bottom: 50 };

const visualisierung = d3.select(diagramm).append('svg');


//different values for diagramm sizes
const size = diagramm.clientWidth;
var circleRadius = [size * 0.25, size * 0.35, size * 0.5];

//creating svg image for diagramm
visualisierung
  .attr("width", size)
  .attr("height", size);

//creating groups for different graph parts
const outerGraph = visualisierung.append('g')
  .attr('id', 'outerGraph')
  .attr("transform", `translate(${size / 2},${size / 2})`);

const innerGraph = visualisierung.append('g')
  .attr('id', 'innerGraph')
  .attr("transform", `translate(${size / 2},${size / 2})`);

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
  .range(["#F4CA00", "#F38904", "#F33107"]);

var innerlabelScale = d3.scaleOrdinal()
  .domain(innerData)
  .range(["Niedrig", "Mittel", "Hoch"]);
var outerColor = d3.scaleOrdinal()
  .domain(outerData)
  .range(["#003f5c", "#444e86", "#955196", "#dd5182", "#ff6e54","#ffa600"]);


//on selecting the outer ring
function onSelectingBigGraphSegment(i){
  //updating the tooltip
  titel.textContent = String(i.data.impactType);
  description.textContent = String(i.data.description);
  let percentage = Math.round(i.data.total / totalSum * 10000)/ 100;
  tooltip.textContent = String("Prozent: " + percentage + "% Total: " + (i.data.total));

  //updating data
  selectedOuterTotal = Number(i.data.total);
  //creating second layer of visual
  innerData = [i.data.low, i.data.middle, i.data.high];
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
  .attr("transform", function(d) { console.log(d); return `translate(${arcGen.centroid(d)})`})
  .style("text-anchor", "middle")
  .style("font-size", 12)
}




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
  onSelectingBigGraphSegment(i);
  d3.select(this).transition()
         .duration('1000')
         .attr('opacity', 1)
         .attr('d', d3.arc()
         .innerRadius(circleRadius[1])         
         .outerRadius(circleRadius[2]));
  outerGraph.selectAll('path').filter((d,i) => this.__data__ != d).transition()
       .duration('1000')
       .attr('opacity', 0.4)
       .attr('d', d3.arc()
       .innerRadius(circleRadius[1])         
       .outerRadius(circleRadius[2] * 0.8));
});
