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
  const margin = { top: 20, right: 30, bottom: 40, left: 90 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  const svg = d3.select("#endangered_chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
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
      .range([0, height]);  // Flipping the chart by reversing the range

  // Vertebrates Bars
  svg.selectAll(".vertebrateBar")
      .data(endangeredSpeciesList)
      .enter()
      .append("rect")
      .attr("class", "vertebrateBar")
      .attr("x", d => x(d.Year))
      .attr("y", 0)  // Bars start from the top
      .attr("height", d => y(d.Vertebrates))  // Height is directly from the scale
      .attr("width", x.bandwidth())
      .attr("fill", "#e6e5a3");

  // Invertebrates Bars
  svg.selectAll(".invertebrateBar")
      .data(endangeredSpeciesList)
      .enter()
      .append("rect")
      .attr("class", "invertebrateBar")
      .attr("x", d => x(d.Year))
      .attr("y", 0)  // Bars start from the top
      .attr("height", d => y(d.Invertebrates))  // Height is directly from the scale
      .attr("width", x.bandwidth())
      .attr("fill", "#a9af7e");

      svg.selectAll(".yearLabel")
      .data(endangeredSpeciesList)
      .enter()
      .append("text")
      .attr("class", "yearLabel")
      .attr("x", d => x(d.Year) + x.bandwidth() / 2)  // Center the text within the bar
      .attr("y", 10)  // Positioning the label at the top of the bar
      .attr("text-anchor", "middle")  // Center the text
      .text(d => d.Year)
      .attr("fill", "black")  // Set the color of the text here
      .attr("font-size", "10px");  // Set the size of the text here

});