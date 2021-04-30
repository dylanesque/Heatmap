async function heatMap() {
  // 1. Access data
  const initialData = await d3.json(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
  );

  const baseTemp = initialData.baseTemperature;
  // Heat maps have three dimensions: x, y, and a color scale.
  // x equals year
  // y equals month

  // 2. Create chart dimensions

  // 3. Draw canvas

  // 4. Create scales

  // 5. Draw data
}

heatMap();
