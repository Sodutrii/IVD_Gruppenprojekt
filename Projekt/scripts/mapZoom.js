const mapMargin = 10;
const height = 80;
const width = 40;

//handles the zoom for the minus & plus button
function handleButtonZoom(change){
  visualisierung.call(zoom.scaleBy, change);
}

//----------------------------------------------------------------------------
//Legend vor Habitats
const legendData = ['A','N','P','T','O','X',''];
const legende = visualisierung.append('g')
  .attr('id', 'legende')
  .attr("transform", `translate(${svgSize.width - mapMargin + 100},${svgSize.height - 167 - mapMargin})`)

  const legendeToggle = visualisierung.append('g')
  .attr('id', 'legendeToggle')
  .attr("transform", `translate(${svgSize.width - 40 - mapMargin},${mapMargin})`)

//add background to legende
legende.append('rect')
  .attr('width', 250)
  .attr('height', 170)
  .attr('fill', 'black')
  .attr('opacity', 0.5)
  .attr('rx', 4)
  .attr('ry', 4)

//handle the toggling of the legend
let legendIsVisible = false;
function toggleLegend(){
  console.log("toggle")
  if(legendIsVisible){
    //turn of legend
    legendIsVisible = false;
    legende.transition()
    .duration(1000)
    .attr('transform', `translate(${svgSize.width - mapMargin + 100},${svgSize.height - 167 - mapMargin})`)
  }
  else{
    //turn legend on
    legendIsVisible = true;
    legende.transition()
    .duration(1000)
    .attr('transform', `translate(${svgSize.width - 295 - mapMargin},${svgSize.height - 167 - mapMargin})`)
  }
}
//creating the legende
const legendUnits = legende.selectAll('g')
  .data(legendData)//TODO: creat data
  .enter()
  .append('g')
  .attr('transform', (d,i) => `translate(${15},${i * 25 + 15})`);

//Legende: adds the color circle to the legende
legendUnits.data(outerData)
  .append('circle')
  .attr('r', 4)
  .attr('fill', (d) => outerColor(d))
  .attr('transform', (d,i) => `translate(${0},${7})`);
//Legende: adds the text to the legende
legendUnits.data(outerData)
  .append('text')
  .attr('x', 10)
  .attr('y', 12.5)
  .attr('fill', 'white')
  .text( (d) => d.impactType)
