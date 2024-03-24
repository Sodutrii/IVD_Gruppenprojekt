// Assuming you have included the D3.js library in your HTML

// Prepare the data
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
  // Set dimensions and margins for the graph
  const margin = { top: 20, right: 20, bottom: 30, left: 40 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

  // Create SVG element
  const svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");

  // Scale for the bands
  const x = d3.scaleBand()
      .range([0, width])
      .padding(0.1)
      .domain(endangeredSpeciesList.map(d => d.Year));

  // Maximum value to define y scale
  const maxValue = d3.max(endangeredSpeciesList, d => d.Vertebrates + d.Invertebrates);

  // Scale for vertical positioning (flipped)
  const y = d3.scaleLinear()
      .range([0, height])
      .domain([0, maxValue]);

  // Adding rectangles for Vertebrates
  svg.selectAll(".bar-vertebrates")
      .data(endangeredSpeciesList)
    .enter().append("rect")
      .attr("class", "bar-vertebrates")
      .attr("x", d => x(d.Year))
      .attr("width", x.bandwidth())
      .attr("y", 0) // Starting from top
      .attr("height", d => y(d.Vertebrates))
      .attr("fill", "steelblue");

  // Adding rectangles for Invertebrates stacked on top of Vertebrates
  svg.selectAll(".bar-invertebrates")
      .data(endangeredSpeciesList)
    .enter().append("rect")
      .attr("class", "bar-invertebrates")
      .attr("x", d => x(d.Year))
      .attr("width", x.bandwidth())
      .attr("y", d => y(d.Vertebrates)) // Stacked on top of the Vertebrates bar
      .attr("height", d => y(d.Invertebrates))
      .attr("fill", "orange");

  // Optionally, you can add text labels inside or on top of the bars here
});