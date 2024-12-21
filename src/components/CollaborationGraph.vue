<!-- 合作关系网络分析：使用力导向图来展示机构和作者之间的合作关系。使用不同的节点大小和颜色来表示影响力和合作强度。 -->
<template>
    <div>
        <svg id="my_svgCollaborationGraph" width="1600"  height="800"></svg>
    </div>
</template>

<script lang="ts" setup>
import * as d3 from 'd3';
import { onMounted, onUnmounted } from 'vue';

type Node = {
	id: string,
	name: string,
	group: string,
} & d3.SimulationNodeDatum

type Link = {
	id: string,
	source: Node,
	target: Node,
} & d3.SimulationLinkDatum<Node>

function load(nodes: Node[], links: Link[]) {
    const svg = d3.select('#my_svgCollaborationGraph');
    const width = +svg.attr('width');
    const height = +svg.attr('height');

	const graph_g = svg.append('g')
		.attr('id', 'graph_g')
		.attr('transform', `translate(${width / 2}, ${height / 2})`);

	const link = graph_g.append("g")
		.attr('id', 'links_g')
		.selectAll("line")
		.data(links)
		.enter().append('line')
		.attr('id', (d: any) => d.id)
		.attr('stroke', '#ccc');

	const drag = (simulation: d3.Simulation<Node, d3.SimulationLinkDatum<Node>>) => {
		function dragstarted(event: any, d: any) {
			if (!event.active) simulation.alphaTarget(0.3).restart();
			d.fx = d.x;
			d.fy = d.y;
		}

		function dragged(event: any, d: any) {
			d.fx = event.x;
			d.fy = event.y;
		}

		function dragended(event: any, d: any) {
			if (!event.active) simulation.alphaTarget(0);
			d.fx = null;
			d.fy = null;
		}

		return d3.drag()
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended);
	}

	const node = graph_g.append("g")
		.attr('id', 'circles_g')
		.selectAll("circle")
		.data(nodes)
		.enter().append('circle')
		.attr('id', (d: Node) => d.id)
		.attr("stroke", '#fff')
		.attr('fill', (d: Node) => {
			if (d.group === 'author') {
				return 'red';
			} else {
				return 'blue';
			}
		})
		.attr("r", 5);

	// 添加文字
	const text = graph_g.append("g")
		.attr('id', 'texts_g')
		.selectAll("text")
		.data(nodes)
		.enter().append('text')
		.attr('id', (d: Node) => d.id)
		.text((d: Node) => d.name)
		.attr('font-size', 10)
		.style('cursor', 'pointer')
		.attr('fill', '#000')
		.attr('dx', 12)
		.attr('dy', 5);

	node.on("mouseover", function (event, d) { // 鼠标移入事件
		d3.select(this).attr("r", 10); // 增大节点半径以高亮显示
	})
		.on("mouseout", function (event, d) { // 鼠标移出事件
			d3.select(this).attr("r", 5); // 恢复节点半径
		});

	const simulation = d3.forceSimulation(nodes)
		.force("link", d3.forceLink(links))
		.force("charge", d3.forceManyBody())
		.force("x", d3.forceX())
		.force("y", d3.forceY())
		.on("tick", ticked);
	
	node.call(drag(simulation));
	text.call(drag(simulation));

	const zoom = d3.zoom()
		.scaleExtent([1, 10])
		.on("zoom", function (event) {
			graph_g.attr("transform", event.transform);
		});
	svg.call(zoom);

	function ticked() {
		link
			.attr("x1", (d: any) => d.source.x)
			.attr("y1", (d: any) => d.source.y)
			.attr("x2", (d: any) => d.target.x)
			.attr("y2", (d: any) => d.target.y);
		node
			.attr("cx", (d: any) => d.x)
			.attr("cy", (d: any) => d.y);
		text
			.attr("x", (d: any) => d.x)
			.attr("y", (d: any) => d.y);
	}
}

onMounted(() => {
    fetch('http://localhost:3000/CollaborationGraph')
        .then(response => response.json())
        .then((data: {nodes: Node[], links: Link[] }) => {
            const { nodes, links } = data;
			console.log(nodes, links);
			const realLink = links.map((d) => {
				const source = nodes.find((n) => n.id === d.source);
				const target = nodes.find((n) => n.id === d.target);
				return {
					id: d.id,
					source: source,
					target: target,
				}
			});
			console.log(realLink);
            load(nodes, realLink)
        });
});

onUnmounted(() => {
	const svg = d3.select('#my_svgCollaborationGraph');
	svg.selectAll('*').remove();
});

</script>

<style lang="scss" scoped>

</style>