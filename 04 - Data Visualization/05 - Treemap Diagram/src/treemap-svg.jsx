/* eslint-disable react/prop-types */
import * as d3 from "d3";

export default function TreemapSVG({data, hoverAction}) {
	const graphConfig = {
        size: {
            x: 960,
            y: 600,
        },
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        },
    }

	const colorScale = d3.scaleOrdinal(d3.schemeSet3);
	const treemap = d3.treemap().size([graphConfig.size.x, graphConfig.size.y]);
	const root = d3.hierarchy(data).sum(d => d.value).sort((a, b) => b.value - a.value);
	const nodes = root.leaves();
	treemap(root);

	const renderNodes = () => {
		return (
			<g id="nodes">
				{nodes.map((node, index) => {
					return (
						<g key={index} transform={`translate(${node.x0}, ${node.y0})`}>
							<rect
								width={node.x1 - node.x0}
								height={node.y1 - node.y0}
								fill={colorScale(node.data.category)}
								stroke="black"
								className="tile"
								data-name={node.data.name}
								data-category={node.data.category}
								data-value={node.data.value}
								onMouseOver={hoverAction}
								onMouseOut={() => hoverAction(null)}
							/>
							{/* <text y={10}>
								{wrapText(node.data.name)}
							</text> */}
						</g>
					)
				})}
			</g>
		)
	}

	const renderLegend = () => {

		const categories = [...new Set(nodes.map(node => node.data.category))]
		const width = graphConfig.size.x;
		const height = graphConfig.size.y / 20;

		return (
			<g
				id="legend"
				width={width}
				height={height}
				transform={`translate(0, ${graphConfig.size.y + 32})`}
			>
				{categories.map((category, index) => {
					return (
						<g
							key={index}
							width={width / categories.length}
							transform={`translate(${(width / categories.length) * index}, 0)`}
						>
							<rect fill={colorScale(category)} height={height} width={height} className="legend-item" />
							<text x={height + 5} y={height / 1.5} fill="white">{category}</text>
						</g>
					)
				})}
			</g>
		)
	}


	return (
		<svg id="treemap-svg" viewBox={`0 0 ${graphConfig.size.x} ${graphConfig.size.y}`}>
			{renderNodes()}
			{renderLegend()}
		</svg>
	)
}