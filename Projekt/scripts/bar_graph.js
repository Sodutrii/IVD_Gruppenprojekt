document.addEventListener('DOMContentLoaded', function() {
    const data = [
        {
          country: 'Germany',
          years: {
            '2010': 48, '2011': 47, '2012': 47, '2013': 46, '2014': 46, '2015': 45,
            '2016': 45, '2017': 44, '2018': 44, '2019': 43, '2020': 43, '2021': 42,
            '2022': 42
          }
        },
        {
          country: 'France',
          years: {
            '2010': 13, '2011': 14, '2012': 16, '2013': 17, '2014': 19, '2015': 20,
            '2016': 22, '2017': 23, '2018': 25, '2019': 26, '2020': 28, '2021': 29,
            '2022': 31
          }
        },
        {
          country: 'Spain',
          years: {
            '2010': 13, '2011': 12, '2012': 11, '2013': 11, '2014': 10, '2015': 10,
            '2016': 9, '2017': 8, '2018': 8, '2019': 7, '2020': 7, '2021': 6,
            '2022': 6
          }
        },
        {
          country: 'Italy',
          years: {
            '2010': 9, '2011': 9, '2012': 9, '2013': 9, '2014': 9, '2015': 9,
            '2016': 9, '2017': 9, '2018': 9, '2019': 9, '2020': 9, '2021': 9,
            '2022': 9
          }
        },
        {
          country: 'Poland',
          years: {
            '2010': 15, '2011': 17, '2012': 20, '2013': 23, '2014': 26, '2015': 29,
            '2016': 32, '2017': 34, '2018': 37, '2019': 40, '2020': 43, '2021': 46,
            '2022': 49
          }
        },
        {
          country: 'Netherlands',
          years: {
            '2010': 33, '2011': 30, '2012': 27, '2013': 24, '2014': 22, '2015': 19,
            '2016': 16, '2017': 13, '2018': 11, '2019': 8, '2020': 5, '2021': 2,
            '2022': 0
          }
        },
        {
          country: 'Belgium',
          years: {
            '2010': 40, '2011': 38, '2012': 36, '2013': 34, '2014': 33, '2015': 31,
            '2016': 29, '2017': 27, '2018': 26, '2019': 24, '2020': 22, '2021': 20,
            '2022': 19
          }
        },
        {
          country: 'Greece',
          years: {
            '2010': 26, '2011': 27, '2012': 28, '2013': 29, '2014': 30, '2015': 31,
            '2016': 32, '2017': 33, '2018': 34, '2019': 35, '2020': 36, '2021': 37,
            '2022': 38
          }
        }]
  
    // Set the dimensions and margins of the graph
    const margin = { top: 20, right: 30, bottom: 40, left: 50 },
          width = diagramm.clientWidth - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;
  
    // Append the SVG object to the bar chart container
    const svgBarChart = d3.select("#bar-chart-container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
  
    // X axis
    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.1);
    svgBarChart.append("g")
      .attr("transform", `translate(0,${height})`)
      .attr("id", "x-axis");
  
    // Y axis
    const y = d3.scaleLinear()
      .range([height, 0]);
    svgBarChart.append("g")
      .attr("id", "y-axis");
  
    // Initialize the bar chart with the first year
    updateBarChart('2020');
  
    // Slider interaction
    d3.select("#year-slider").on("input", function() {
      updateBarChart(this.value);
      document.getElementById("year-label").textContent = this.value;
    });
  
    // Function to update the bar chart
    function updateBarChart(year) {
      // Filter the data to include only the selected year
      const currentData = data.map(d => ({ country: d.country, value: d.years[year] }));
  
      // Update the X axis
      x.domain(currentData.map(d => d.country));
      svgBarChart.select("#x-axis")
        .call(d3.axisBottom(x));
  
      // Update the Y axis
      const maxValue = d3.max(currentData, d => d.value);
      y.domain([0, maxValue]);
      svgBarChart.select("#y-axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y));
  
      // Bind the data to the bars
      const bars = svgBarChart.selectAll(".bar")
        .data(currentData);
  
      // Remove the bars that are not needed anymore
      bars.exit().remove();
  
      // Add new bars or update existing ones
      bars.enter().append("rect")
        .attr("class", "bar")
        .merge(bars)
        .transition()
        .duration(1000)
        .attr("x", d => x(d.country))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", "#69b3a2");
    }
  });
  