<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import * as d3 from "d3";
import { transformInstitution, Institution } from "../components/dataTransform";

export default defineComponent({
  name: "InfluenceChart",
  setup() {
    const institutions = ref<Institution[]>([]); // 保存解析后的数据

    // 加载数据
    onMounted(async () => {
      const rawData = await d3.csv(
        "/Institutions%20-%20Top%20paper%20-%20CS.csv",
      );
      institutions.value = transformInstitution(rawData); // 转换为 Institution 类型
      drawChart(); // 数据加载后绘制图表
    });

    // 图表绘制函数
    const drawChart = () => {
      const margin = { top: 50, right: 50, bottom: 20, left: 500 }; // 增大左侧边距
      const width = window.innerWidth - margin.left - margin.right; // 自适应窗口宽度
      const height = institutions.value.length * 35; // 增加每个机构的高度，间距更大

      // 创建 SVG
      const svg = d3
        .select("#influence-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // 按照原始顺序排列数据
      const sortedData = institutions.value;

      // 设置 x 轴的范围（Cites），将最大值设置为 260000
      const x = d3
        .scaleLinear()
        .domain([0, 260000]) // 设置最大值为 260000
        .range([0, width]);

      // 设置 y 轴的范围（每个机构都有一个位置）
      const y = d3
        .scaleBand()
        .domain(sortedData.map((d) => d.name)) // 以机构名作为 y 轴的刻度
        .range([0, height])
        .padding(0.5); // 增大间距

      // 添加 x 轴
      svg
        .append("g")
        .attr("transform", `translate(0,0)`) // 顶部显示 x 轴
        .call(d3.axisTop(x).ticks(20).tickSizeOuter(0)) // 设置刻度数量为 20，增加刻度数量来减小间距
        .call((g) => g.select(".domain").remove()) // 移除 x 轴主轴线
        .append("text") // 添加 x 轴标题
        .attr("x", width / 2)
        .attr("y", -30)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text("Cites");

      // 添加 y 轴
      svg
        .append("g")
        .call(d3.axisLeft(y).tickSize(0)) // 移除 y 轴刻度线
        .call(
          (g) =>
            g
              .selectAll(".tick text") // 设置 y 轴刻度文本样式
              .attr("font-size", "14px") // 修改字体大小
              .attr("font-weight", "bold")
              .style("white-space", "pre-line"), // 允许换行
        );

      // 绘制散点图（圆点）
      svg
        .selectAll("circle")
        .data(sortedData)
        .join("circle")
        .attr("cx", (d) => x(d.cites)) // 每个点的横向位置根据引用量动态设置
        .attr("cy", (d) => y(d.name)! + y.bandwidth() / 2) // 纵向位置为机构名所在的中心
        .attr("r", 12) // 圆点的大小
        .attr("fill", "steelblue")
        .on("click", (event, d) => {
          alert(
            `机构: ${d.name}\n国家: ${d.country}\n引用量: ${d.cites}\n论文数量: ${d.webOfScienceDocuments}`,
          );
        });
    };

    return {};
  },
});
</script>

<template>
  <div>
    <div id="influence-chart" style="
        overflow-y: auto;
        height: 100vh;
        width: 100vw;
        background-color: #222;
      "></div>
  </div>
</template>

<style scoped>
#influence-chart {
  margin: 0;
  /* 去掉外边距 */
  padding: 0;
  /* 去掉内边距 */
}

.RouterView-content {
  background-color: #222;
}

*::-webkit-scrollbar {
  display: none;
}
</style>
