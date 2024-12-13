<template>
  <div>
    <svg ref="svgRef" :style="{ width: '50vw', height: '90vh' }">
      <g
        class="force"
        :transform="`translate(${margin.left + 200}, ${margin.top + 300})`"
      ></g>
      <g
        class="main"
        :transform="`translate(${margin.left}, ${margin.top})`"
      ></g>
    </svg>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import * as d3 from "d3";
import { transformJ, type Journal } from "@/components/dataTransform.ts";

const svgRef = ref();
const margin = { left: 30, right: 10, top: 10, bottom: 20 };

onMounted(() => {
  d3.text("Journals - Top paper - CS.csv").then((d) => {
    const data = transformJ(d3.csvParse(d));
    console.log(data);
    drawScatter(data);
  });
});

function drawScatter(data: Journal[]) {
  const width = svgRef.value.clientWidth;
  const height = svgRef.value.clientHeight;
  const clipWidth = width - margin.left - margin.right;
  const clipheight = height - margin.top - margin.bottom;
  const svg = d3.select(svgRef.value).select(".main");

  // 设置x和y的比例尺，x轴是标签
  let xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.name))
    .range([0, clipWidth]);
  let yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data.map((d) => d.cites))])
    .range([clipheight, 0]);

  // 设置x轴和y轴
  let xAxis = svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + clipheight + ")")
    .call(d3.axisBottom(xScale));
  let yAxis = svg.append("g").attr("class", "axis").call(d3.axisLeft(yScale));

  let padding = { left: 0, top: 0, right: 0, bottom: 0 };
  let g = svg
    .append("g")
    .attr("transform", "translate(" + padding.left + "," + padding.top + ")");
  // 绘制直方图
  g.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d: Journal) => xScale(d.name))
    .attr("y", (d: Journal) => yScale(d.cites))
    .attr("width", xScale.bandwidth() - 2)
    .attr("height", (d: Journal) => clipheight - yScale(d.cites))
    .attr("fill", "steelblue");
  return () => {
    svg.selectAll("*").remove();
  };
}
</script>

<style scoped>
.s1 {
  width: "50vw";
  height: "100vh";
}
</style>
