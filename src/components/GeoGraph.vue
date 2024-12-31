<script lang="ts">
import { defineComponent, onMounted, ref} from "vue";
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

    interface Institution {
      Longitude: number;
      Latitude: number;
      name: string;
    }

    const drawMap = async () => {
      // Load map and institution data
      const world: any = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/land-50m.json');
      const institutions = await d3.csv('/Institutions%20location.csv', d3.autoType);
      mapData.value = world;
      instData.value = institutions;

      // Calculate height 
      const [[x0,y0],[x1,y1]] = path.bounds(outline);
      const dy = Math.ceil(y1-y0);
      const l = Math.min(Math.ceil(x1-x0), dy);
      projection.scale(projection.scale() * (l-1) / l).precision(0.2);
      height.value = dy;

      const land = topojson.feature(world, world.objects.land);

      // Create SVG
      const svg = d3.select('#map')
        .append('svg')
        .attr('viewBox', [0, 0, width.value, height.value])
        .attr('width', '100%')
        .attr('height', '100%');
      
      const container = svg.append('g');
      
      const zoom = d3.zoom()
        .extent([[0,0],[width.value, height.value]])
        .scaleExtent([1,8])
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

      // Draw institutions
      g.append('g')
        .selectAll('circle')
        .data(institutions)
        .join('circle')
        .attr('transform', (d: Institution) => `translate(${projection([d.Longitude, d.Latitude])})`)
        .attr('r', 0.5)
        .append('title')
        .text((d: Institution) => d.name);
    };

    onMounted(() => {
      drawMap();
    });

    return {
      width,
      height
    };
  }
}); 
</script>

<template>
    <div id="map" class="map-container"></div>
</template>

<style scoped>
.map-container{
  width: 100%;
  height: 100vh;
  background-color: #222;
}
</style>