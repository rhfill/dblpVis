研究热点发现：使用热力图或词云来展示研究主题的频率和热度。

<template>
    <div>
        <svg ref="svgRef" width="1400" height="700"></svg>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import * as d3 from "d3";
import * as d3cloud from 'd3-cloud'
import { Article200, transformArticle200 } from "./dataTransform";

const cloud = d3cloud.default;
const svgRef = ref();

function wordCloud(data: { text: string, size: number }[]) {
    const svg = d3.select(svgRef.value);

    const width = +svg.attr("width");
    const height = +svg.attr("height");

    var layout = cloud().size([width, height])
        .words(data) // 数据绑定
        .padding(5) // 单词间距
        .rotate(function () { return ~~(Math.random() * 2) * 30; }) // 旋转角度
        .font("Arial")
        .fontSize(function (d) { return d.size; }) // 字体大小
        .on("end", draw);
    layout.start();

    function draw(words) {
        var cloud = svg.append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

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

    return draw;
}

function processData2Weight(data: Article200[]) {
    const segmenterFr = new Intl.Segmenter('en', { granularity: 'word', localeMatcher: 'best fit' });
    let weight = new Map<string, number>();
    data.forEach((d) => {
        const iterator = segmenterFr.segment(d.title);
        for (let { segment } of iterator) {
            segment = segment.toLowerCase()
            if (segment.length < 2) {
                continue;
            }
            if (weight.has(segment)) {
                weight.set(segment, weight.get(segment) + 1);
            } else {
                weight.set(segment, 1);
            }
        }
    });
    return weight;
}

const getRidOf = [
    "the", 'of', 'with', 'and', 'or', 'in'
]

onMounted(() => {
    d3.csv("Article200.csv").then((_data) => {
        const data = transformArticle200(_data.slice(0, 1000));
        const realData = processData2Weight(data);

        const realCloudData = Array.from(realData).map(([text, size]) => ({ text, size }));
        const okFine = realCloudData.filter(d => {
            if (getRidOf.includes(d.text)) {
                return false;
            }
            return true;
        });
        console.log(okFine)
        wordCloud(okFine);
    });
});

</script>
