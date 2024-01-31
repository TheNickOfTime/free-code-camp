import * as d3 from "d3"
import { useEffect, useRef, useState } from "react";

export default function BarChart () {

    const dataURL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

    let [data, setData] = useState({});
    let [current, setCurrent] = useState(null);
    let [mousePosition, setMousePosition] = useState({})


    const fetchData = async () => {
        const request = await fetch(dataURL);
        const jsonData = await request.json();

        // console.log(jsonData);

        setData(jsonData);
    }
    useEffect(() => {
        fetchData();
    }, [])

    const xAxis = useRef();
    const yAxis = useRef();
    
    const xMin = data.data ? d3.min(data.data, d => new Date(Date.parse(d[0]))) : 0;
    const xMax = data.data ? d3.max(data.data, d => new Date(Date.parse(d[0]))) : 0;
    const yMax = data.data ? d3.max(data.data, d => d[1]) : 0;

    const size = {
        x: 960,
        y: 480,
    }

    const margin = {
        x: 50,
        y: 20,
    }

    const scale = {
        x: d3.scaleTime([xMin, xMax], [margin.x, size.x]),
        y: d3.scaleLinear([0, yMax], [size.y - margin.y, 5]),
    }

    useEffect(() => {d3.select(xAxis.current).call(d3.axisBottom(scale.x))}, [data, scale.x, xAxis]);
    useEffect(() => {d3.select(yAxis.current).call(d3.axisLeft(scale.y))}, [data, scale.y, yAxis]);

    const renderGraph = () => {
        if (!data.data) return null;

        return (
            <svg id="chart-svg" viewBox={`0 0 ${size.x} ${size.y}`}>
                <text id="y-label" transform="rotate(-90)" x={size.y / -2} y={margin.x + 25} >GDP (Billions)</text>
                <text id="x-label" x={size.x / 2} y={size.y + margin.y + 15}>Year</text>
                <g ref={xAxis} id="x-axis" transform={`translate(0, ${size.y - margin.y})`}>

                </g>
                <g ref={yAxis} id="y-axis" transform={`translate(${margin.x}, 0)`}>

                </g>
                {data.data.map((d, i) =>
                    <rect
                        className="bar"
                        key={i}
                        height={size.y - scale.y(d[1]) - margin.y}
                        width={size.x / data.data.length}
                        x={scale.x(new Date(Date.parse(d[0])))}
                        y={scale.y(d[1])}
                        data-date={d[0]}
                        data-gdp={d[1]}
                        onMouseOver={(e) => setCurrent(e.target)}
                        onMouseLeave={() => setCurrent(null)}
                    />
                )}
            </svg>
        )
    }

    useEffect(() => {
        window.addEventListener("mousemove", (event) => {
            setMousePosition({x: event.clientX, y: event.clientY})
        })
    })

    const renderTooltip = () => {
        if(!current) return null;

        let date = new Date(Date.parse(current.getAttribute("data-date").replace("-", " ")));
        date = date.toLocaleDateString('en-US', {month: "long", year: "numeric"});

        let gdp = current.getAttribute("data-gdp") * 1000000000;
        gdp = gdp.toLocaleString('en-US')

        return (
            <div id="tooltip" hidden={!current} data-date={current.getAttribute("data-date")} style={{left: mousePosition.x, top: mousePosition.y - 25}} >
                <p id="tooltip-date">{date}</p>
                <p id="tooltip-gdp">${gdp}</p>
            </div>
        )
    }

    return (
        <div id="chart-wrapper">
            <h1 id="title">United States GDP ({data.data ? xMin.getFullYear() : ""} - {data.data ? xMax.getFullYear() : ""})</h1>
            {renderGraph()}
            {renderTooltip()}
        </div>
    )
}