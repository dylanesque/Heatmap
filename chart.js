async function heatMap() {
  // 1. Access data
  const initialData = await d3.json(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
  );
    const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];


  const baseTemp = initialData.baseTemperature;
  const dataset = initialData.monthlyVariance;

  const parseYear = d3.timeParse('%Y');

  const xAccessor = (d) => parseYear(parseInt(d.year));
  const yAccessor = (d) => d.month;
  const varAccessor = (d) => d.variance;

  // 2. Create chart dimensions

  const width = window.innerWidth * 0.85;
  let dimensions = {
    width,
    height: width * 0.4,
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

  const cellWidth = dimensions.boundedWidth / (dataset.length / 12);
  const cellHeight = dimensions.boundedHeight / 12;

  // 4. Create scales
  const xScale = d3
    .scaleTime()
    // The complete set of values for the x range
    .domain(d3.extent(dataset, xAccessor))
    // sets the parameters that the domain needs to scale to
    .range([0, dimensions.boundedWidth]);

  const yScale = d3
    .scaleLinear()
    .domain([0, 12])
    .range([0, dimensions.boundedHeight]);

  const tooltip = d3
    .select('body')
    .append('div')
    .attr('id', 'tooltip')
    .style('visibility', 'hidden');

  // 5. Draw data

  const heat = bounds
    .selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('x', (d) => xScale(xAccessor(d)))
    .attr('y', (d) => yScale(yAccessor(d)) - cellHeight)
    .attr('width', cellWidth)
    .attr('height', cellHeight)
    .attr('class', 'cell')
    .attr('data-year', (d) => d.year)
    .attr('data-month', (d) => d.month - 1)
    .attr('data-temp', (d) => varAccessor(d))
    .attr('fill', (d) => mapColorToTemp(Math.round(baseTemp + varAccessor(d))))
    .on('mouseover', onMouseOver)
    .on('mouseleave', onMouseLeave);
  
  function onMouseOver(d) {
     tooltip.transition().duration(200).style('visibility', 'visible');
     tooltip
       .html(d.year + '-' + months[d.month - 1] + '<br>' + baseTemp + '<br>' + d.variance)
       .style('left', d3.event.pageX + 'px')
       .style('top', d3.event.pageY - 28 + 'px')
       .attr('data-year', d.year)
       .attr('data-month', d.month - 1)
       .attr('data-temp', varAccessor(d));
   }

   function onMouseLeave() {
     tooltip.transition().duration(200).style('visibility', 'hidden');
   }


  function mapColorToTemp(temp) {
    if (temp < 3.9) {
      return 'darkblue';
    } else if (temp >= 3.9 && temp < 5.0) {
      return 'blue';
    } else if (temp >= 5.0 && temp < 6.1) {
      return 'aqua';
    } else if (temp >= 6.1 && temp < 7.2) {
      return 'lightcyan';
    } else if (temp >= 7.2 && temp < 8.3) {
      return 'gold';
    } else if (temp >= 8.3 && temp < 9.5) {
      return 'darkorange';
    } else if (temp >= 9.5 && temp < 10.6) {
      return 'orangered';
    } else if (temp >= 10.6 && temp < 11.7) {
      return 'red';
    } else {
      return 'darkred';
    }
  }

  // 6. Draw Peripherals

  const xAxisGenerator = d3.axisBottom().scale(xScale);
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

  const yAxisGenerator = d3
    .axisLeft()
    .scale(yScale)
    .tickFormat((d, i) => months[i] );

  const yAxis = bounds.append('g').attr('id', 'y-axis').call(yAxisGenerator);

  const yAxisLabel = yAxis
    .append('text')
    .attr('x', -dimensions.boundedHeight / 2)
    .attr('y', -dimensions.margin.left + 10)
    .attr('fill', 'black')
    .style('font-size', '1.4em')
    .text('Months')
    .style('transform', 'rotate(-90deg)')
    .style('transform', `translateY(${-(cellHeight / 2)}px)`)
    .style('text-anchor', 'middle');
  
  
}

heatMap();
