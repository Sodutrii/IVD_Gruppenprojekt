// Assuming you have included the D3.js library in your HTML

// Prepare the data
let endangeredSpeciesList = [
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
  
  // Set the dimensions and margins of the graph
  const margin = {top: 20, right: 30, bottom: 40, left: 90},
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;
  
  // Append the svg object to the body of the page
  const svg = d3.select("body")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
  // X axis
  const x = d3.scaleLinear()
    .domain([0, d3.max(endangeredSpeciesList, d => Math.max(d.Vertebrates, d.Invertebrates))])
    .range([0, width]);
  
  // Y axis
  const y = d3.scaleBand()
    .range([0, height])
    .domain(endangeredSpeciesList.map(d => d.Year))
    .padding(.1);
  
  //Bars
  svg.selectAll("rect")
    .data(endangeredSpeciesList)
    .join("rect")
    .attr("x", x(0) )
    .attr("y", d => y(d.Year))
    .attr("width", d => x(d.Vertebrates))
    .attr("height", y.bandwidth())
    .attr("fill", "#69b3a2");
  
  // Add labels for the Vertebrates
  svg.selectAll("text.vertebrate-label")
    .data(endangeredSpeciesList)
    .join("text")
    .attr("class", "vertebrate-label")
    .attr("x", d => x(d.Vertebrates) - 4)
    .attr("y", d => y(d.Year) + y.bandwidth() / 2)
    .attr("dy", ".35em")
    .attr("text-anchor", "end")
    .text(d => d.Vertebrates);
  
  // Overlay bars for Invertebrates with different color
  svg.selectAll("rect.invertebrate")
    .data(endangeredSpeciesList)
    .join("rect")
    .attr("x", x(0) )
    .attr("y", d => y(d.Year))
    .attr("width", d => x(d.Invertebrates))
    .attr("height", y.bandwidth())
    .attr("fill", "#ff6347");
  
  // Add labels for the Invertebrates
  svg.selectAll("text.invertebrate-label")
    .data(endangeredSpeciesList)
    .join("text")
    .attr("class", "invertebrate-label")
    .attr("x", d => x(d.Invertebrates) - 4)
    .attr("y", d => y(d.Year) + y.bandwidth() / 2)
    .attr("dy", ".35em")
    .attr("text-anchor", "end")
    .text(d => d.Invertebrates);
  
  // Notice that the bars are drawn from left to right.
  // To invert them to draw from right to left (extend downward),
  // you can transform the SVG and
  