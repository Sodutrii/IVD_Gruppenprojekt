
const diagramm = document.getElementById('naturschutzDiagramm');
const margin = { top: 50, left: 50, right: 50, bottom: 50 };

const visualisierung = d3.select(diagramm).append('svg');


//different values for diagramm sizes
const size = diagramm.clientWidth;

//creating svg image for diagramm
visualisierung
  .attr("width", size)
  .attr("height", size * 0.6);

visualisierung.append('rect')
  .attr('width', size)
  .attr('height', size)
  .attr('fill', 'black')
  .attr('opacity', 0.1)

//creating groups for different graph parts
const countries = visualisierung.append('g')
  .attr('id', 'countries')
  .attr("transform", `translate(${0},${0})`);

const habitats = visualisierung.append('g')
  .attr('id', 'habitats')
  .attr("transform", `translate(${0},${0})`);

//sizes where calculated before and saved as Varaibles to save computing time
const maxSize = 7186094;
const minSize = 1;

//variables for filtering habitatMap
var selectedYear = 'all';
var selectedCountry = 'all';
var selectedRegion = 'all';
var onlyImpacted = false;

//returns true or false depending on the selection of filters to determin if habitat should be included
function filterHabitats(habitat){
    
    //check year
    if(selectedYear != 'all'){
      year = habitat.DATE.split(' ')[0].slice(-4);
      if(selectedYear != year) return false;
    }

    //check country
    if(selectedCountry != 'all'){
      country = habitat.SITECODE.slice(0,2);
      //console.log(country);
      if(selectedCountry != country) return false;
    } 
    //check biographicregion
    if(selectedRegion != 'all'){
      region = habitat.REGION;
      if(selectedRegion != region) return false;
    }
    //check impact
    if(onlyImpacted){
      pollution = habitat.POLLUTION;
      console.log(pollution);
      if(pollution == 'P' || pollution == 'N' || pollution == 'T' || pollution == 'O' || pollution == 'X' || pollution == 'A') return true;
      else return false;
    };
    return true;
}


//scales
var sizeScale = d3.scaleLinear()
    .domain([minSize,maxSize])
    .range([1,8]);

var pollutionColorScale = d3.scaleOrdinal()
    .domain(['A','N','P','T','O','X',''])
    .range(["#2b7cff", "#c268e8", "#ff57b9", "#ff6582", "#ff8d4f","#ffb82b", "#A9AF7E"]);


//handle zoom of the map
var scalingFactor = 1;
const zoom = d3.zoom()
    .scaleExtent([.8, 50])
    .translateExtent([[-diagramm.clientWidth, -diagramm.clientHeight],[1.5 * diagramm.clientWidth, 1.5 * diagramm.clientHeight]])
    .on('zoom', zoomed);
    

function zoomed({ transform}){
    countries.attr('transform', transform);
    habitats.attr('transform', transform);
    drawHabitats();
    scalingFactor = transform.k;
}
visualisierung.call(zoom);

//data set up for europe map
const projection = d3.geoMercator()
    .scale((diagramm.clientWidth * 4.8) / (2*Math.PI))
    .translate([diagramm.clientHeight / 2, diagramm.clientHeight / 2])
    .center([13,55]);

const mapPathBuilder = d3.geoPath(projection);

//drawing the eu map
d3.json('./data/europe.geojson').then(mapData =>{
    const pathBuilder = d3.geoPath(projection);
    countries.selectAll('path')
        .data(mapData.features)
        .enter()
        .append('path')
        .attr('opacity', '1')
        .attr('stroke', '#AAAAAA')
        .attr('fill' , '#E6E5A3')
        .attr('stroke-width', '.1px')
        .attr('d', (features) =>{ return pathBuilder(features);})
})

//drawing Habitats as circles
var habitatSelection;
d3.dsv(';','./data/naturschutzGebiete.csv').then(Data =>{
  habitatSelection = habitats.selectAll('circle')
    .data(Data.filter(filterHabitats))
    .join(
      function(enter){
        return enter
        .append('circle')
        .attr('cx', function (element){return projection([Number(element.LONGITUDE.replace(',','.')),Number(element.LATITUDE.replace(',','.'))])[0]})
        .attr('cy', element => projection([Number(element.LONGITUDE.replace(',','.')),Number(element.LATITUDE.replace(',','.'))])[1])
        .attr('r',  element => sizeScale(Number(element.AREAHA.replace(',','.'))/ scalingFactor))
        .attr('fill',element => pollutionColorScale(element.POLLUTION))
        .attr('opacity', 1);
      },
      function(update){ return update; },
      function(exit){ return exit.remove(); }
    )


//HABITATS: onclick event for habitats
habitatSelection.on('click', function(d, i){updateTooltip(this.__data__);});})

//Legend vor Habitats
const legendData = ['','']
const legende = visualisierung.append('g')
  .attr('id', 'legende')
  .attr("transform", `translate(${100},${10})`)
  .attr('width', 200)
  .attr('height', 400)
  .attr('fill', 'grey')

//creating the legende
const legendUnits = legende.selectAll('g')
  .data()//TODO: creat data
  .enter()
  .append('g')
  .attr('transform', (d,i) => `translate(${200},${i * 25})`);

//Legende: adds the color square to the legende
legendUnits.data(outerData)
  .append('rect')
  .attr('width', 15)
  .attr('height', 15)
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



//Update Impact-Table
function updateImpactTable(data){
  var table = document.getElementById('habitatImpactTable');
  //clear old entries
  while (table.firstChild) {
    table.firstChild.remove();
}
  var impacts = data.IMPACT.split('|');
  //creat one row for each species entry
  impacts.forEach(element => {

    //add species name
    row = table.insertRow(-1);
    species = (element.split(':')[0] != undefined ? element.split(':')[0] : '-');
    row.insertCell(-1).innerHTML = species;
    
    //handle impactType
    typeSymbol = document.createElement('span');
    typeSymbol.style.color = "green";
    console.log(typeSymbol.style.color);
    typeSymbol.classList.add("material-icons-round");

    type = 'remove';
    if(element.split(':')[1] == 'P'){
      //Postitive Type
      type = 'thumb_up';
      typeSymbol.style.color = "green";
    }
    else if(element.split(':')[1] == 'N'){
      //negative Type
      type = 'thumb_down';
      typeSymbol.style.color = 'red';
    }

    typeSymbol = document.createElement('span');
    typeSymbol.classList.add("material-icons-round");
    typeSymbol.innerHTML = type;

    row.insertCell(-1).appendChild(typeSymbol);
  });

}
//updates the table for species
function updateSpeciesTable(data){

  var table = document.getElementById('habitatSpeciesTable');
  //clear old entries
  while (table.firstChild) {
    table.firstChild.remove();
}
  var species = data.SPECIES.split(',');
  //creat one row for each species entry
  species.forEach(element => {

    //add species name
    row = table.insertRow(-1);
    species = (element.split(':')[0] != undefined ? element.split(':')[0] : '-');
    row.insertCell(-1).innerHTML = species;
    
    //handle impactType
    typeSymbol = document.createElement('span');
    typeSymbol.style.color = "green";
    console.log(typeSymbol.style.color);
    typeSymbol.classList.add("material-icons-round");

    type = 'remove';
    populationTrend = element.split(':')[1];
    if(populationTrend == 'c' || populationTrend == 'c'){
      //going up
      type = 'trending_up';
      typeSymbol.style.color = "green";
    }
    else if(populationTrend == 'p'){
      //staying
      type = 'trending_flat';
      typeSymbol.style.color = 'red';
    }
    else if(populationTrend == 'w'){
      //going down
      type = 'trending_down';
    }
    else{
      //unkonwn
    }

    typeSymbol = document.createElement('span');
    typeSymbol.classList.add("material-icons-round");
    typeSymbol.innerHTML = type;

    row.insertCell(-1).appendChild(typeSymbol);})
}

//Updates the Tooltip to the side of the map
function updateTooltip(data){
  //console.log(data);
  updateImpactTable(data);
  updateSpeciesTable(data);
  //tooltip to the side:
  document.getElementById('Habitat_Name').textContent = data.SITENAME;
  document.getElementById('Habitat_Country').textContent = data.COUNTRY.toUpperCase();
  document.getElementById('Habitat_Size').textContent = data.AREAHA + "Ha";
  document.getElementById('Habitat_Date').textContent = data.DATE.split(' ')[0].slice(-4);
  document.getElementById('Habitat_Region').textContent = data.REGION;
  document.getElementById('Habitat_Class').textContent = data.HABITATCLASS;
  document.getElementById('Habitat_Pollution').textContent = data.IMPACT_TYPE;
  M.Modal.getInstance(document.getElementById('habitatModal')).open();
}

function drawHabitats(){
  d3.dsv(';','./data/naturschutzGebiete.csv').then(Data =>{
    habitatSelection = habitats.selectAll('circle')
      .data(Data.filter(filterHabitats))
      .join(
        function(enter){
          return enter
          .append('circle')
          .attr('cx', function (element){return projection([Number(element.LONGITUDE.replace(',','.')),Number(element.LATITUDE.replace(',','.'))])[0]})
          .attr('cy', element => projection([Number(element.LONGITUDE.replace(',','.')),Number(element.LATITUDE.replace(',','.'))])[1])
          .attr('r',  element => sizeScale(Number(element.AREAHA.replace(',','.'))/ scalingFactor))
          .attr('fill',element => pollutionColorScale(element.POLLUTION))
          .attr('opacity', 1);
        },
        function(update){ 
          return update
          .attr('cx', function (element){return projection([Number(element.LONGITUDE.replace(',','.')),Number(element.LATITUDE.replace(',','.'))])[0]})
          .attr('cy', element => projection([Number(element.LONGITUDE.replace(',','.')),Number(element.LATITUDE.replace(',','.'))])[1])
          .attr('r',  element => sizeScale(Number(element.AREAHA.replace(',','.'))/ scalingFactor))
          .attr('fill',element => pollutionColorScale(element.POLLUTION))
          .attr('opacity', 1);
         },
        function(exit){ 
          return exit.
          transition()
          .duration(1000)
          .attr('r', 0)
          .remove(); 
        }
      )
})
habitatSelection.on('click', function(d, i){
  //update ui
  updateTooltip(this.__data__);
});
}
//functions to set filters for the map
function filterYear(year){
  selectedYear = year;
  drawHabitats();
}

function filterCountry(country){
  selectedCountry = country;
  console.log(selectedCountry);
  drawHabitats();
}
function filterBioRegion(region){
  selectedRegion = region;
  console.log("selected" + selectedRegion);
  drawHabitats();
}

function filterOnlyPollution(){
  if(onlyImpacted) {
    onlyImpacted = false;
  }
  else{
    onlyImpacted = true;
  }
  console.log(onlyImpacted);
  drawHabitats();
}

