
const diagramm = document.getElementById('naturschutzDiagramm');
const margin = { top: 50, left: 50, right: 50, bottom: 50 };

const visualisierung = d3.select(diagramm).append('svg');
visualisierung.attr('id', 'HabitatMap');
visualisierung.style('border-radius', '4px')

//different values for diagramm sizes
const svgSize = {width: diagramm.clientWidth, height: window.innerHeight};

//creating svg image for diagramm
visualisierung
  .attr("width", svgSize.width)
  .attr("height", svgSize.height);

//add background
visualisierung.append('rect')
  .attr('width', svgSize.width)
  .attr('height', svgSize.height)
  .attr('fill', 'black')
  .attr('opacity', 0.05)

//creating groups for different graph parts
const countries = visualisierung.append('g')
  .attr('id', 'countries')
  .attr("transform", `translate(${0},${0})`);

const habitats = visualisierung.append('g')
  .attr('id', 'habitats')
  .attr("transform", `translate(${0},${0})`);

//sizes where calculated before and saved as Varaibles to save computing time
const maxSize = 7186094;
const minSize = 0.01;

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
    .range([1,5]);

var pollutionColorScale = d3.scaleOrdinal()
    .domain(['A','N','P','T','O','X',''])
    .range(["#4fc3f7", "#9575cd", "#e57373", "#ff8a65", "#fff176", "#81c784", "#c3c991"]);

//dictionaries
const countryDict = {
  BE : "Belgien",
  BG : "Bulgarien",
  DK : "Dänemark",
  DE : "Deutschland",
  EE : "Estland",
  FI : "Finnland",
  FR : "Frankreich",
  GR : "Griechenland",
  IE : "Irland",
  IT : "Italien",
  HR : "Kroatien",
  LV : "Lettland",
  LT : "Litauen",
  LU : "Luxemburg",
  MT : "Malta",
  NL : "Niederlande",
  AT : "Österreich",
  PL : "Polen",
  RO : "Rumänien",
  SE : "Schweden",
  SK : "Slowakei",
  SI : "Slowenien",
  ES : "Spanien",
  CZ : "Tschechien",
  HU : "Ungarn",
  CY : "Zypern"
}
const pollutionDict = {
  N : "Stickstoffbelastung",
  A : "Versauerung",
  P : "Phosphor- & Phospatbelastung",
  O : "Organische Chemikalien",
  X : "Gemischtee Verschmutzung",
  T : "Anorganische Chemikalien",
  '' : "keine"
}
//handle zoom of the map
var scalingFactor = 1;
const zoom = d3.zoom()
    .scaleExtent([.8, 50])
    .translateExtent([[-0.25 * diagramm.clientWidth, -0.25 * diagramm.clientHeight],[1.25 * diagramm.clientWidth, 1.25 * diagramm.clientHeight]])
    .on('zoom', zoomed);
    

function zoomed({transform}){
    countries.attr('transform', transform);
    habitats.attr('transform', transform);
    drawHabitats();
    scalingFactor = transform.k;
}
visualisierung.call(zoom);

//data set up for europe map
const projection = d3.geoMercator()
    .scale((diagramm.clientWidth * 4) / (2*Math.PI))
    .translate([svgSize.width / 2, svgSize.height / 2])
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
        .attr('fill' , '#f7fccf')
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
        .attr('r',  element => sizeScale(Number(element.AREAHA.replace(',','.'))/ (2 * scalingFactor)))
        .attr('fill',element => pollutionColorScale(element.POLLUTION))
        .attr('opacity', 1);
      },
      function(update){ return update; },
      function(exit){ return exit.remove(); }
    )


//HABITATS: onclick event for habitats
habitatSelection.on('click', function(d, i){updateTooltip(this.__data__);});})




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
    d3.select(typeSymbol).attr('color', 'green')
    type = 'remove';
    if(element.split(':')[1] == 'P'){
      //Postitive Type
      type = 'thumb_up';
      typeSymbol.style.color = "green";
      d3.select(typeSymbol).attr('background-color', 'green')
    }
    else if(element.split(':')[1] == 'N'){
      //negative Type
      type = 'thumb_down';
      typeSymbol.style.color = 'red';
      d3.select(typeSymbol).style('fill', 'green')
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
  document.getElementById('Habitat_Country').textContent = countryDict[data.COUNTRY.toUpperCase()];
  document.getElementById('Habitat_Size').textContent = data.AREAHA + "Ha";
  document.getElementById('Habitat_Date').textContent = data.DATE.split(' ')[0].slice(-4);
  document.getElementById('Habitat_Region').textContent = data.REGION;
  document.getElementById('Habitat_Class').textContent = data.HABITATCLASS;
  document.getElementById('Habitat_Pollution').textContent = pollutionDict[data.POLLUTION];
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
          .attr('r',  element => sizeScale(Number(element.AREAHA.replace(',','.'))/ (2 * scalingFactor)))
          .attr('fill',element => pollutionColorScale(element.POLLUTION))
          .attr('opacity', 1);
        },
        function(update){ 
          return update
          .attr('cx', function (element){return projection([Number(element.LONGITUDE.replace(',','.')),Number(element.LATITUDE.replace(',','.'))])[0]})
          .attr('cy', element => projection([Number(element.LONGITUDE.replace(',','.')),Number(element.LATITUDE.replace(',','.'))])[1])
          .attr('r',  element => sizeScale(Number(element.AREAHA.replace(',','.'))/ (2 * scalingFactor)))
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

//------------------------
//handle color change for only imacted button
function changeColor(){
  if(onlyImpacted){
    d3.select('#pollutionButton').style('color', '#C3C991')
  }
  else{
    d3.select('#pollutionButton').style('color', 'white')
  }
}

