/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import * as d3 from "d3";
import { useEffect } from "react";
import * as topojson from "topojson";

export default function ChoroplethMapSVG ({educationData, countyData, hoverAction}) {

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
		colors: [
			"#D1F2FA",
			"#1DBDE6",
		],
		range: {
			min: d3.min(educationData, e => e.bachelorsOrHigher),
			max: d3.max(educationData, e => e.bachelorsOrHigher),
			total: d3.max(educationData, e => e.bachelorsOrHigher) - d3.min(educationData, e => e.bachelorsOrHigher),
		}
    }

	const getInterpolatedColor = (input) => {
		return d3.interpolateRgb(graphConfig.colors[0], graphConfig.colors[1])(input / graphConfig.range.total)
	}

	const renderNation = () => {
		const path = d3.geoPath();
		const feature = topojson.feature(countyData, countyData.objects.nation).features[0];
		return (
			<path
				d={path(feature)}
				className="nation"
				fill="white"
				pointerEvents="none"
			/>
		)
	}

	const renderStates = () => {
		const path = d3.geoPath();
		const features = topojson.feature(countyData, countyData.objects.states).features;

		return (
			<g id="state-paths">
				{features.map((feature, index) => {
					return (
						<path
							key={index}
							d={path(feature)}
							className="state"
							fill="transparent"
							stroke="white"
							pointerEvents="none"
						/>
					)
				})}
			</g>
		)
	}

	const renderCounties = () => {
		const path = d3.geoPath();
		const features = topojson.feature(countyData, countyData.objects.counties).features;

		return (
			<g id="county-paths">
				{features.map((feature) => {
					const data = educationData.find(d => d.fips === feature.id)
					const stat = data.bachelorsOrHigher;
					const color = getInterpolatedColor(stat);
					// console.log(data);

					return (
						<path
							key={feature.id}
							d={path(feature)}
							className="county"
							data-fips={data.fips}
							data-education={stat}
							data-county={data.area_name}
							data-state={data.state}
							onMouseOver={hoverAction}
							onMouseOut={() => hoverAction(null)}
							fill={color}
						/>
					)
				})}
			</g>
		)
	}

	const getLegendScale = () => {
		const stepCount = 10;
		const step = graphConfig.range.total / stepCount;
		let steps = []
		for (let i = 0; i <= stepCount; i++) {
			steps.push(step * i + graphConfig.range.min);
		}

		// console.log(graphConfig.range);

		return d3.scaleBand(steps, [graphConfig.size.y / 2 / stepCount, graphConfig.size.y / 2])
	}
	const legendScale = getLegendScale();

	const renderLegend = () => {
		const scale = legendScale;
		const values = scale.domain();
		return (
			<g id="legend" transform={`translate(${-scale.bandwidth() * 2}, ${0})`}>
				{values.map((value, index) => (
					<rect
						key={index}
						height={scale.bandwidth()}
						width={scale.bandwidth()}
						y={scale(value)}
						fill={getInterpolatedColor(value)}
					/>
				))}
			</g>
		)
	}

	useEffect(() => {d3.select("#legend").call(
		d3.axisLeft(legendScale)
		.tickFormat(tick => `${parseFloat(tick).toFixed(0)}%`)
	)}, [])


	return (
		<svg
			id="map-svg"
			viewBox={`0 0 ${graphConfig.size.x} ${graphConfig.size.y}`}
			// preserveAspectRatio="xMinYMid"
			style={{overflow: "visible"}}
		>
			{renderNation()}
			{renderCounties()}
			{renderStates()}
			{renderLegend()}
		</svg>
	)
}