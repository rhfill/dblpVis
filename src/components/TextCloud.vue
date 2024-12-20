<!-- 研究热点发现：使用热力图或词云来展示研究主题的频率和热度。 -->

<template>
    <div>
        <div class="btn-group">
            <button v-for="y in years" :key="y" type="button" :onclick="() => updateWordCloud(y)">{{ y }}</button>
        </div>
        <svg id="svgRef" width="1200" height="700"></svg>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import * as d3 from "d3";
import * as d3cloud from 'd3-cloud'

const cloud = d3cloud.default;
const years = ref<number[]>([]);

function wordCloud(data: { text: string, size: number }[]) {
    const svg = d3.select("#svgRef");
    const g = svg.append("g");

    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", function (event) {
            // console.log("zoom", d);
            g.attr("transform", event.transform)
        });
        svg.call(zoom);

    const width = +svg.attr("width");
    const height = +svg.attr("height");

    var layout = cloud().size([width, height])
        .words(data) // 数据绑定
        .padding(5) // 单词间距
        .rotate(function () { return (Math.random() * 90) - 45; }) // 旋转角度
        .font("Arial")
        .fontSize(function (d) { return d.size; }) // 字体大小
        .on("end", draw);
    layout.start();

    function draw(words) {
        var cloud = g.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        cloud.selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function (d) { return d.size + "px"; })
            .style("font-family", "Arial")
            .style("fill", function (d, i) { return d3.schemeTableau10[i % 10] })
            .attr("text-anchor", "middle")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) { return d.text; });
    }
}

function cleanWordCloud() {
    d3.select("#svgRef").selectAll("*").remove();
}

function updateWordCloud(year: number) {
    fetch(`http://localhost:3000/Article200FromYear?year=${year}`)
        .then(res => res.json())
        .then(data => {
            cleanWordCloud();
            wordCloud(data);
        });
}

onMounted(() => {
    fetch(`http://localhost:3000/Article200FromYear`)
        .then(res => res.json())
        .then(data => {
            years.value = data.sort().reverse();
            const year = years.value[0];
            fetch(`http://localhost:3000/Article200FromYear?year=${year}`)
                .then(res => res.json())
                .then(data => {
                    cleanWordCloud();
                    wordCloud(data);
                });
        });
});

</script>


<style>
.btn-group {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
}

.btn-group::-webkit-scrollbar {
    display: none;
}

.btn-group>button {
    margin: 5px;
    cursor: pointer;
}
</style>