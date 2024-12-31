<script lang="ts">
import { defineComponent, onMounted, ref, watch} from "vue";
import * as d3 from "d3";
import * as topojson from "topojson-client";

export default defineComponent({
  name: "GeoGraphic",
  setup() {
    const width = ref(960);
    const height = ref(10);
    const mapData = ref(null);
    const instData = ref(null);

    const projection = d3.geoNaturalEarth1();
    const path = d3.geoPath(projection)
    const outline= {type: "Sphere", geometries: []};
    const graticule = d3.geoGraticule10();

    const selectedMetric = ref("Cites")
    const metricOptions = [
      { value: 'Cites', label: 'Total Citations' },
      { value: 'Cites/Paper', label: 'Citations per Paper' },
      { value: 'Top Papers', label: 'Top Papers' },
      { value: 'Web of Science Documents', label: 'Number of Papers' }
    ]

    interface Institution {
      Longitude: number;
      Latitude: number;
      Institutions: string;
      Cites: number;
      'Cites/Paper': number; 
      'Top Papers': number; 
      'Web of Science Documents': number;
    }

    const drawMap = async () => {
      // Load map and institution data
      const world: any = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json');
      const institutions = await d3.csv('/Institutions%20location.csv', d3.autoType);
      mapData.value = world;
      instData.value = institutions;

      //Normailized Scaling
      const getScalingFactor = (metric: string) => {
        const maxValues = {
          'Cites': d3.max(institutions, (d: Institution) => d.Cites),
          'Cites/Paper': d3.max(institutions, (d: Institution) => d['Cites/Paper']),
          'Top Papers': d3.max(institutions, (d: Institution) => d['Top Papers']),
          'Web of Science Documents': d3.max(institutions, (d: Institution) => d['Web of Science Documents'])
        }
        return 400000 / maxValues[metric];
      }

      // Calculate height 
      const [[x0,y0],[x1,y1]] = path.bounds(outline);
      const dy = Math.ceil(y1-y0);
      const l = Math.min(Math.ceil(x1-x0), dy);
      projection.scale(projection.scale() * (l-1) / l).precision(0.2);
      height.value = dy;

      const land = topojson.feature(world, world.objects.land);
      const border = topojson.feature(world, world.objects.countries);

      const spike = (length: number, width = 1.5) => `M${-width / 2},0L0,${-length}L${width / 2},0`

      // Create SVG
      const svg = d3.select('#map')
        .append('svg')
        .attr('viewBox', [0, 0, width.value, height.value])
        .attr('width', '100%')
        .attr('height', '100%');
      
      const container = svg.append('g');
      
      const zoom = d3.zoom()
        .extent([[0,0],[width.value, height.value]])
        .scaleExtent([1,20])
        .on('zoom', (event) => {
          container.attr('transform', event.transform.toString());
      });
      
      svg.call(zoom);

      const defs = container.append('defs');
      defs.append('path')
        .attr('id', 'outline')
        .attr('d', path(outline));

      defs.append('clipPath')
        .attr('id', 'clip')
        .append('use')
        .attr('xlink:href', '#outline');

      // Create main group
      const g = container.append('g')
        .attr('clip-path', 'url(#clip)');

      // Draw map elements
      g.append('use')
        .attr('xlink:href', '#outline')
        .attr('fill', '#fff');

      g.append('path')
        .attr('d', path(graticule))
        .attr('stroke', '#ddd')
        .attr('fill', 'none');

      g.append('path')
        .attr('d', path(land))
        .attr('fill', '#ddd');

      g.append('path')
        .attr('d', path(border))
        .attr('fill', '#ddd')
        .attr('stroke', 'black')
        .attr('stroke-width', 0.05);

      // Draw institutions
      g.append('g')
          .attr("fill", "red")
          .attr("fill-opacity", 0.2)
          .attr("stroke", "red")
          .attr("stroke-width", 0.1)
        .selectAll()
        .data(institutions)
        .join("path")
          .attr("transform", (d: Institution) => `translate(${projection([d.Longitude, d.Latitude])})`)
          .attr("d", (d: Institution) => {
            const scalingFactor = getScalingFactor(selectedMetric.value);
            return spike(Math.sqrt(d[selectedMetric.value] * scalingFactor) / 20);
          })
        .append("title")
          .text((d: Institution) => 
          `Institution name: ${d.Institutions}\n${metricOptions.find(o => o.value === selectedMetric.value)?.label}: ${d[selectedMetric.value]}`
          );
    };

    onMounted(() => {
      drawMap();
    });

    watch(selectedMetric, () => {
      //Clear previous map
      d3.select('#map svg').remove();
      drawMap();
    });

    return {
      width,
      height,
      selectedMetric,
      metricOptions
    };
  }
}); 
</script>

<template>
  <div class="container">
    <div class="controls">
      <select v-model="selectedMetric" class="metric-select">
        <option v-for="option in metricOptions" 
                :key="option.value" 
                :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
    <div id="map" class="map-container"></div>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #222;
}

.controls {
  position: absolute;
  top: 10px;
  left: 12px;
  z-index: 100;
}

.map-container {
  width: 100%;
  height: 100vh;
  background-color: #222;
}

.metric-select {
  padding: 5px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
}
</style>