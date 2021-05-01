async function heatMap() {
  // 1. Access data
  const initialData = await d3.json(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
  );

  const baseTemp = initialData.baseTemperature;

  const xAccessor = (d) => d.monthlyVariance.year;
  const yAccessor = (d) => d.monthlyVariance.month;
  const varAccessor = (d) => d.monthlyVariance.variance;
  // Heat maps have three dimensions: x, y, and a color scale.

  // 2. Create chart dimensions
  // returns the minimum value from the iterable given as an argument
  const width = d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9]);
  let dimensions = {
    height: width,
    width,
    margin: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50,
    },
  };
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  // 3. Draw canvas
  const wrapper = d3
    .select('#wrapper')
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height);

  const bounds = wrapper
    .append('g')
    .style(
      'transform',
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );

  // 4. Create scales
    const xScale = d3
      .scaleTime()
      // The complete set of values for the x range
      .domain(d3.extent(initialData, xAccessor))
      // sets the parameters that the domain needs to scale to
      .range([0, dimensions.boundedWidth]);

    const yScale = d3
      .scaleTime()
      .domain(d3.extent(initialData, yAccessor))
    .range([0, dimensions.boundedHeight]);
  
  const tooltip = d3
    .select('body')
    .append('div')
    .attr('id', 'tooltip')
    .style('visibility', 'hidden');


  // 5. Draw data

  // 6. Draw Peripherals

   const xAxisGenerator = d3.axisBottom().scale(xScale).ticks(12, 'y');
   const xAxis = bounds
     .append('g')
     .call(xAxisGenerator)
     .attr('id', 'x-axis')
     .style('transform', `translateY(${dimensions.boundedHeight}px)`);

   const xAxisLabel = xAxis
     .append('text')
     .attr('x', dimensions.boundedWidth / 2)
     .attr('y', dimensions.margin.bottom - 10)
     .attr('fill', 'black')
     .style('font-size', '1.4em')
     .text('Years');
  
  const yAxisGenerator = d3.axisLeft().scale(yScale).ticks(12, '%b');

  const yAxis = bounds.append('g').attr('id', 'y-axis').call(yAxisGenerator);

  const yAxisLabel = yAxis
    .append('text')
    .attr('x', -dimensions.boundedHeight / 2)
    .attr('y', -dimensions.margin.left + 10)
    .attr('fill', 'black')
    .style('font-size', '1.4em')
    .text('Months')
    .style('transform', 'rotate(-90deg)')
    .style('text-anchor', 'middle');
}

heatMap();
