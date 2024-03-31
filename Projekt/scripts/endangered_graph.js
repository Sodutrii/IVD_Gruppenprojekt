const endangeredSpeciesList = [
  { Year: '2000', Vertebrates: 3507, Invertebrates: 1928 },
  { Year: '2002', Vertebrates: 3521, Invertebrates: 1932 },
  { Year: '2003', Vertebrates: 3524, Invertebrates: 1959 },
  { Year: '2004', Vertebrates: 5188, Invertebrates: 1992 },
  { Year: '2006', Vertebrates: 5622, Invertebrates: 2102 },
  { Year: '2007', Vertebrates: 5742, Invertebrates: 2109 },
  { Year: '2008', Vertebrates: 5966, Invertebrates: 2496 },
  { Year: '2009', Vertebrates: 6143, Invertebrates: 2639 },
  { Year: '2010', Vertebrates: 6714, Invertebrates: 2904 },
  { Year: '2011', Vertebrates: 7108, Invertebrates: 3297 },
  { Year: '2012', Vertebrates: 7250, Invertebrates: 3570 },
  { Year: '2013', Vertebrates: 7390, Invertebrates: 3822 },
  { Year: '2014', Vertebrates: 7678, Invertebrates: 4140 },
  { Year: '2015', Vertebrates: 7781, Invertebrates: 4201 },
  { Year: '2016', Vertebrates: 8160, Invertebrates: 4470 },
  { Year: '2017', Vertebrates: 8374, Invertebrates: 4893 },
  { Year: '2018', Vertebrates: 8442, Invertebrates: 5040 },
  { Year: '2019', Vertebrates: 9013, Invertebrates: 5221 },
  { Year: '2020', Vertebrates: 9677, Invertebrates: 5489 },
  { Year: '2021', Vertebrates: 10437, Invertebrates: 6042 },
  { Year: '2022', Vertebrates: 10739, Invertebrates: 6161 },
  { Year: '2023', Vertebrates: 11195, Invertebrates: 6221 }
];


document.addEventListener('DOMContentLoaded', function() {
  
  const margin = { top: 0, right: 50, bottom: 40, left: 50 },
        width = parseInt(d3.select('#endangered_chart').style('width')) - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;


        const svg = d3.select("#endangered_chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

  // X axis - Band scale for years
  const x = d3.scaleBand()
      .domain(endangeredSpeciesList.map(d => d.Year))
      .range([0, width])
      .padding(0.1);

  // Y axis - Linear scale for counts, flipped
  const y = d3.scaleLinear()
      .domain([0, d3.max(endangeredSpeciesList, d => Math.max(d.Vertebrates, d.Invertebrates))])
      .range([0, height]);

  // Vertebrates Bars
  svg.selectAll(".vertebrateBar")
      .data(endangeredSpeciesList)
      .enter()
      .append("rect")
      .attr("class", "vertebrateBar")
      .attr("x", d => x(d.Year))
      .attr("y", 0)
      .attr("height", d => y(d.Vertebrates))
      .attr("width", x.bandwidth())
      .attr("fill", "#e6e5a3");

  // Invertebrates Bars
  svg.selectAll(".invertebrateBar")
      .data(endangeredSpeciesList)
      .enter()
      .append("rect")
      .attr("class", "invertebrateBar")
      .attr("x", d => x(d.Year))
      .attr("y", 0)
      .attr("height", d => y(d.Invertebrates))
      .attr("width", x.bandwidth())
      .attr("fill", "#7d8f69");

  svg.selectAll(".yearLabel")
      .data(endangeredSpeciesList)
      .enter()
      .append("text")
      .attr("class", "yearLabel")
      .attr("x", d => x(d.Year) + x.bandwidth() / 2)
      .attr("y", 10)
      .attr("text-anchor", "middle")
      .text(d => d.Year)
      .attr("fill", "#e6e5a3")
      .attr("font-weight", "bold");

      svg.selectAll(".vertebrateText")
      .data(endangeredSpeciesList)
      .enter()
      .append("text")
      .attr("class", "vertebrateText")
      .attr("x", d => x(d.Year) + x.bandwidth() / 2)
      .attr("y", d => y(d.Vertebrates) - 5)
      .attr("text-anchor", "middle")
      .text(d => d.Vertebrates)
      .attr("fill", "#5e705d")
      .style("font-size", "calc(10px + 0.1vw)")
      .attr("font-weight", "bold")
      .style("opacity", 0);

      svg.selectAll(".invertebrateText")
      .data(endangeredSpeciesList)
      .enter()
      .append("text")
      .attr("class", "invertebrateText")
      .attr("x", d => x(d.Year) + x.bandwidth() / 2)
      .attr("y", d => y(d.Invertebrates) - 5)
      .attr("text-anchor", "middle")
      .text(d => d.Invertebrates)
      .attr("fill", "#e6e5a3")
      .style("font-size", "calc(10px + 0.1vw)")
      .attr("font-weight", "bold")
      .style("opacity", 0);
  
      let visibleStates = {};

      // Initialize state to false for each year
      endangeredSpeciesList.forEach(d => {
        visibleStates[d.Year] = false;
      });
      
      // Mouseover function to fade in text
      function mouseover(event, d) {
        if (!visibleStates[d.Year]) {  // Only run if the text is not set to be always visible
          d3.selectAll('.vertebrateText, .invertebrateText')
            .filter(dd => dd.Year === d.Year)
            .transition()
            .duration(200)
            .style("opacity", 1);
        }
      }
      
      // Mouseout function to fade out text
      function mouseout(event, d) {
        if (!visibleStates[d.Year]) {  // Only run if the text is not set to be always visible
          d3.selectAll('.vertebrateText, .invertebrateText')
            .filter(dd => dd.Year === d.Year)
            .transition()
            .duration(200)
            .style("opacity", 0);
        }
      }
      
      // Click function to toggle visibility state
      function click(event, d) {
        visibleStates[d.Year] = !visibleStates[d.Year];  // Toggle the state
        d3.selectAll('.vertebrateText, .invertebrateText')
          .filter(dd => dd.Year === d.Year)
          .transition()
          .duration(200)
          .style("opacity", visibleStates[d.Year] ? 1 : 0);
      }
      
      // Apply the mouseover, mouseout, and click functions to the bars
      svg.selectAll(".vertebrateBar, .invertebrateBar")
          .on("mouseover", mouseover)
          .on("mouseout", mouseout)
          .on("click", click);
      
      // Initial setup to hide all texts
      svg.selectAll(".vertebrateText, .invertebrateText")
          .style("opacity", 0);



  
});


function resize() {
  const newSvgWidth = parseInt(d3.select('#endangered_chart').style('width'));

  const newFontSize = `calc(10px + ${newSvgWidth * 0.001}vw)`;
  const newStrokeWidth = Math.max(1, newSvgWidth * 0.001);

  svg.selectAll(".vertebrateText")
        .attr("x", d => x(d.Year) + x.bandwidth() / 2)
        .attr("y", d => y(d.Vertebrates) - 5)
        .style("font-size", `calc(10px + ${newWidth * 0.001}vw)`); // Update responsive font size

    // Update invertebrate text positions
    svg.selectAll(".invertebrateText")
        .attr("x", d => x(d.Year) + x.bandwidth() / 2)
        .attr("y", d => y(d.Invertebrates) - 5)
        .style("font-size", `calc(10px + ${newWidth * 0.001}vw)`); // Update responsive font size

  svg.selectAll(".yearLabel")
    .style("font-size", newFontSize);

  svg.selectAll(".my-line")
    .style("stroke-width", newStrokeWidth);

}

d3.select(window).on('resize', resize);