const mapMargin = 10;
const height = 80;
const width = 40;

const zoomButton = visualisierung.append('g')
  .attr('id', 'zoomButton')
  .attr("transform", `translate(${svgSize.width - width - mapMargin},${svgSize.height - height - mapMargin})`);

//creat rectangular background
/*zoomButton.append('rect')
  .attr('width', width)
  .attr('height', height)
  .attr('rx', 10)
  .attr('ry', 10)
  .attr('fill', '#5E705D')
//creat divider
zoomButton.append('line')
  .attr('x1', 0)
  .attr('y1', height * 0.5)
  .attr('x2', width)
  .attr('y2', height * 0.5)
  .style('stroke-width', 2)
  .style('stroke', '#546554')

//creat plus symbol
zoomButton.append('text')
  .attr('class', 'material-icons-round')
  .attr('fill', '#E6E5A3')
  .attr('y', 36)
  .attr('x', width * 0.5 - 18)
  .style('font-size', 36)
  .text('add')
  .on('click', function(){handleButtonZoom(1.25)});

//creat minus symbol
zoomButton.append('text')
  .attr('class', 'material-icons-round')
  .attr('fill', '#E6E5A3')
  .attr('y', height * 0.5 + 36)
  .attr('x', width * 0.5 - 18)
  .style('font-size', 36)
  .text('remove')
  .on('click', function(){handleButtonZoom(0.75)});*/
//handles the zoom for the minus & plus button
function handleButtonZoom(change){
  visualisierung.call(zoom.scaleBy, change);
}

//----------------------------------------------------------------------------
//Legend vor Habitats
const legendData = ['A','N','P','T','O','X',''];
const legende = visualisierung.append('g')
  .attr('id', 'legende')
  .attr("transform", `translate(${svgSize.width - 295 - mapMargin},${svgSize.height - 167 - mapMargin})`)

  const legendeToggle = visualisierung.append('g')
  .attr('id', 'legendeToggle')
  .attr("transform", `translate(${svgSize.width - 40 - mapMargin},${mapMargin})`)

//add background to legende
legende.append('rect')
  .attr('width', 250)
  .attr('height', 170)
  .attr('fill', 'black')
  .attr('opacity', 0.2)
  .attr('rx', 4)
  .attr('ry', 4)

//creating legend toggle:
//the background
/*legendeToggle.append('rect')
  .attr('width', 40)
  .attr('height', 40)
  .attr('fill', '#5E705D')
  .attr('rx', 10)
  .attr('ry', 10)
//the symbol
legendeToggle.append('text')
  .attr('class', 'material-icons-round')
  .attr('fill', '#E6E5A3')
  .attr('y', 37)
  .attr('x', 2)
  .style('font-size', 35)
  .text('legend_toggle')
  .on('click', toggleLegend)*/
//handle the toggling of the legend
let legendIsVisible = true;
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