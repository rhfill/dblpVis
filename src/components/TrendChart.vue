<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import * as d3 from "d3";

export default defineComponent({
  name: "ResearchTrendChart",
  setup() {
    const startYear = ref(1950); // 响应式起始年份
    const endYear = ref(2024); // 响应式结束年份
    const data = ref<any[]>([]); // 数据存储

    onMounted(async () => {
      const rawData = await d3.csv(
        "/china_academy_papers.csv", // 确保文件路径正确
      );
      data.value = rawData.map((d: any) => ({
        year: +d.year,
        papers: +d.papers,
      }));
      drawChart(); // 绘制图表
    });

    const drawChart = () => {
      const margin = { top: 50, right: 50, bottom: 70, left: 80 };
      const width = 1200; // 图表总宽度
      const height = 500; // 图表总高度

      // 创建 SVG 容器
      const svg = d3
        .select("#research-trend-chart")
        .html("") // 清空之前的内容
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // X 轴比例尺
      const x = d3
        .scaleBand()
        .domain(
          data.value
            .filter((d) => d.year >= startYear.value && d.year <= endYear.value)
            .map((d) => d.year.toString()),
        )
        .range([0, width])
        .padding(0.1);

      // Y 轴比例尺
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data.value, (d) => d.papers) as number])
        .nice()
        .range([height, 0]);

      // 绘制 X 轴
      const xAxis = svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(
          d3.axisBottom(x).tickValues(x.domain().filter((_, i) => i % 5 === 0)), // 每 5 年显示一个标签
        )
        .selectAll("text")
        .attr("transform", "rotate(45)") // 旋转刻度文字
        .style("text-anchor", "start")
        .style("font-size", "12px"); // 增大字体大小

      // 绘制 Y 轴
      svg
        .append("g")
        .call(d3.axisLeft(y).ticks(10)) // Y 轴分成 10 个刻度
        .selectAll("text")
        .style("font-size", "12px"); // 增大字体大小

      // 绘制柱状图
      const bars = svg
        .selectAll(".bar")
        .data(
          data.value.filter(
            (d) => d.year >= startYear.value && d.year <= endYear.value,
          ),
        )
        .join("rect")
        .attr("class", "bar")
        .attr("x", (d) => x(d.year.toString())!)
        .attr("y", (d) => y(d.papers))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d.papers))
        .attr("fill", "steelblue");

      // 鼠标移入和移出效果
      bars
        .on("mouseover", function (event, d) {
          d3.select(this).attr("fill", "orange"); // 鼠标移入时变色
          const [xPos, yPos] = d3.pointer(event);
          svg
            .append("text")
            .attr("id", "tooltip")
            .attr("x", xPos + 10)
            .attr("y", yPos - 10)
            .attr("fill", "white")
            .style("font-size", "12px")
            .text(`Papers: ${d.papers}`); // 显示 papers 数量
        })
        .on("mouseout", function () {
          d3.select(this).attr("fill", "steelblue"); // 鼠标移出时恢复颜色
          svg.select("#tooltip").remove(); // 移除显示的 tooltip
        });
    };

    // 监听 startYear 和 endYear 的变化，重新绘制图表
    watch([startYear, endYear], () => {
      drawChart();
    });

    return { startYear, endYear }; // 返回起始年份和结束年份
  },
});
</script>

<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-x: auto;
      padding: 10px;
    "
  >
    <!-- 时间范围选择器 -->
    <div
      style="
        width: 100%;
        padding: 10px;
        background-color: inherit;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      "
    >
      <div>
        <label for="start-range" style="font-size: 14px; margin-right: 20px"
          >起始年份：</label
        >
        <input
          type="range"
          id="start-range"
          v-model="startYear"
          min="1950"
          max="2024"
          step="1"
          style="width: 150px"
        />
        <span style="font-size: 14px">{{ startYear }}年</span>
      </div>
      <div>
        <label for="end-range" style="font-size: 14px; margin-right: 20px"
          >结束年份：</label
        >
        <input
          type="range"
          id="end-range"
          v-model="endYear"
          min="1950"
          max="2024"
          step="1"
          style="width: 150px"
        />
        <span style="font-size: 14px">{{ endYear }}年</span>
      </div>
    </div>

    <!-- 图表容器 -->
    <div
      id="research-trend-chart"
      style="flex: 1; background-color: #222; overflow-x: auto"
    ></div>
  </div>
</template>

<style scoped>
.bar {
  transition: all 0.3s ease-in-out;
}

.RouterView-content {
  background-color: #222;
}

*::-webkit-scrollbar {
  display: none;
}
</style>
