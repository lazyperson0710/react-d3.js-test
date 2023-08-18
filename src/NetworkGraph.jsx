import React, {Component} from 'react'
import * as d3 from 'd3'
import miserables from './miserables.json'

class NetworkGraph extends Component {
    componentDidMount() {
        this.drawChart();
    }

    drawChart() {
        const svg = d3
            .select("body")
            .append("svg")
            .attr("width", 900)
            .attr("height", 900);

        const color = d3.scaleOrdinal(d3.schemeCategory20);

        const simulation = d3
            .forceSimulation()
            .force(
                "link",
                d3.forceLink()
                    .id(function (d) {
                            return d.id;
                        }
                    )
            )
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(900 / 2, 900 / 2));

        dataf();
        function dataf() {
            const graph = miserables;
            const link = svg
                .append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(graph.links)
                .enter()
                .append("line")
                .attr("stroke-width", function (d) {
                    return Math.sqrt(d.value);
                });

            let node;
            node = svg
                .append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(graph.nodes)
                .enter()
                .append("circle")
                .attr("r", 5)
                .attr("fill", function (d) {
                    return color(d.group);
                })
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended)
                )
                .on("mouseover", function (e) {
                    console.log("ホバーしたよ");
                })
                .on("mouseout", function (e) {
                    console.log("離れたよ");
                })
                .on("click", function (e) {
                    console.log("クリックしたよ");
                });

            node.append("title")
                .text(function (d) {
                        return d.id;
                    }
                );

            simulation.nodes(graph.nodes)
                .on("tick", ticked);

            simulation.force("link",
                d3.forceLink()
                    .links(graph.links)
            )

            function ticked() {
                link
                    .attr("x1", function (d) {
                        return d.source.x;
                    })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    });

                node
                    .attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y;
                    });
            }
        }

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    }

    render() {
        return <svg></svg>
    }
}

export default NetworkGraph;
