document.addEventListener('DOMContentLoaded', function() {
  const margin = { top: 20, right: 30, bottom: 40, left: 50 },
        width = diagramm.clientWidth - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

  const svgBarChart = d3.select("#bar-chart-container").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  var slider = document.getElementById("year-slider");
  slider.style.width = "80%";
  slider.style.height = "50px";
  slider.style.setProperty("--webkit-slider-thumb-width", "25px");
  slider.style.setProperty("--webkit-slider-thumb-height", "25px");

  // X axis
  const x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);
  svgBarChart.append("g")
    .attr("transform", `translate(0,${height})`)
    .attr("id", "x-axis");

  // Y axis
  const y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 50]);
  svgBarChart.append("g")
    .attr("id", "y-axis");

  // Initialize bar chart with first year
  updateBarChart('2020');

  // Slider interaction
  d3.select("#year-slider").on("input", function() {
      updateBarChart(this.value);
      document.getElementById("year-label").textContent = this.value;
  });

  // Update bar chart
  function updateBarChart(year) {
      // Filter data to selected year
      const currentData = data.map(d => ({ country: d.country, value: d.years[year] }));

      // Update X axis
      x.domain(currentData.map(d => d.country));
      svgBarChart.select("#x-axis")
        .call(d3.axisBottom(x));

      // Bind data to bars
      const bars = svgBarChart.selectAll(".bar")
        .data(currentData, d => d.country);

      // Remove bars
      bars.exit().remove();

      // Add/update bars with fade transition
      bars.enter().append("rect")
          .attr("class", "bar")
          .attr("fill-opacity", 0)  // Start fully transparent
        .merge(bars)
          .transition()
          .duration(1000)
          .attr("x", d => x(d.country))
          .attr("y", d => y(d.value))
          .attr("width", x.bandwidth())
          .attr("height", d => height - y(d.value))
          .attr("fill", "#7d8f69")
          .attr("fill-opacity", 1);  // Fade in to fully opaque

      // Select and update text elements for each bar
      const barTexts = svgBarChart.selectAll(".bar-text")
          .data(currentData, d => d.country);

      // Remove old text elements
      barTexts.exit().remove();

      // Add/update text elements inside the top of the bars with fade transition
      barTexts.enter().append("text")
          .attr("class", "bar-text")
          .attr("fill-opacity", 0)  // Start fully transparent
        .merge(barTexts)
          .transition()
          .duration(1000)
          .attr("x", d => x(d.country) + x.bandwidth() / 2)
          .attr("y", d => d.value === 0 ? y(d.value) - 5 : y(d.value) +20)  // Adjust text position
          .attr("text-anchor", "middle")
          .text(d => d.value)
          .attr("fill-opacity", 1)  // Fade in to fully opaque
          .attr("font-weight", "bold")
          .attr("fill", "#e6e5a3");
  }
});
