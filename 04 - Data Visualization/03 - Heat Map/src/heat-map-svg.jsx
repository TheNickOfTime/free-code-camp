/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import * as d3 from "d3";
import { useEffect} from "react";

export default function HeatMapSVG ({data, base, hoverEvent}) {

    const graphConfig = {
        size: {
            x: 960,
            y: 540,
        },
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        },
        min: {
            x: d3.min(data, d => d.year),
            y: d3.min(data, d => d.month - 1),
            temp: d3.min(data, d => base + d.variance),
        },
        max: {
            x: d3.max(data, d =>  d.year),
            y: d3.max(data, d => d.month - 1),
            temp: d3.max(data, d => base + d.variance),
        },
    }

    const ranges = {
        x: [...new Set(data.map(entry => entry.year))],
        y: [...new Set(data.map(entry => entry.month - 1))],
        temp: [...new Set(data.map(entry => Math.floor(base + entry.variance)))].sort((a, b) => b - a)
    }

    const graphScale = {
        x: d3.scaleBand(ranges.x, [graphConfig.padding.left, graphConfig.size.x - graphConfig.padding.right]),
        y: d3.scaleBand(ranges.y, [graphConfig.size.y - graphConfig.padding.top, graphConfig.padding.bottom]),
        temp: d3.scaleBand(ranges.temp, [graphConfig.size.x / 2, graphConfig.size.x / 2 / ranges.temp.length]),
    }

    useEffect(() => {
        d3.select("#x-axis").call(
            d3.axisBottom(graphScale.x)
            .tickValues(ranges.x.filter(year => year % 10 === 0))
        );
        d3.select("#y-axis").call(
            d3.axisLeft(graphScale.y)
            .tickFormat(tick => {
                return new Date(new Date().setUTCMonth(tick + 1)).toLocaleDateString("en-us", {month: "long"})
            })
        );
        d3.select("#legend-axis").call(
            d3.axisBottom(graphScale.temp)
            .tickFormat(tick => `${tick}°`)
        );
    }, [graphScale.x, graphScale.y])

    return (
        <svg id="chart-svg" viewBox={`0 0 ${graphConfig.size.x} ${graphConfig.size.y}`}>
            <g id="x-axis" transform={`translate(0, ${graphConfig.size.y})`} />
            <g id="y-axis" />
            <g id="cells">
                {data.map((d, i) => {
                    const width = graphScale.x.bandwidth();
                    const height = graphScale.y.bandwidth();
                    const dataMonth = d.month - 1;
                    const dataYear = d.year;
                    const dataTemp = base + d.variance;
                    const colorClass = Math.floor(dataTemp);

                    return (<rect
                        key={i}
                        className={`cell map-${colorClass}`}
                        width={width}
                        height={height}
                        x={graphScale.x(dataYear)}
                        y={graphScale.y(dataMonth)}
                        data-month={dataMonth}
                        data-year={dataYear}
                        data-temp={dataTemp}
                        onMouseOver={(e) => hoverEvent(d, e)}
                        onMouseLeave={(e) => hoverEvent(null, e)}
                    />)
                })}
            </g>
            <g id="legend">
                <g id="legend-axis" transform={`translate(${graphConfig.size.x / 4}, ${graphConfig.size.y + 70})`} />
                {ranges.temp.map((temp, index) => {
                    const size = graphConfig.size.x / 2 / ranges.temp.length;
                    const x = graphScale.temp(temp) + (graphConfig.size.x / 4);
                    const y = graphConfig.size.y + 70 - size;

                    return (
                        <rect
                            key={index}
                            width={size}
                            height={size}
                            x={x}
                            y={y}
                            className={`map-${temp}`}
                        />  
                    )
                })}
            </g>
        </svg> 
    )
}