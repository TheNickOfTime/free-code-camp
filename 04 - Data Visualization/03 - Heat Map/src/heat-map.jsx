/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect} from "react";
import * as d3 from "d3";
import HeatMapSVG from "./heat-map-svg";
import "./styles.scss"

export default function HeatMap () {

    const [data, setData] = useState(null);
    const [base, setBase] = useState(0);
    const [current, setCurrent] = useState(null);
    const [position, setPosition] = useState({x: 0, y: 0})

    const dataURL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
    useEffect(() => {
        if (!data) {
            fetch(dataURL).then(data => data.json()).then(jsonData => {
                console.log(jsonData)
                setData(jsonData.monthlyVariance);
                setBase(jsonData.baseTemperature);
            });
        }
    }, [])

    const updateCurrent = (value, event) => {
        setCurrent(value);
        setPosition({x: event.pageX, y: event.pageY - 10})
        // console.log(value);
    }

    const tooltip = () => {
        return (
            <div id="tooltip" data-year={current.year} hidden={!current} style={{top: position.y, left: position.x}} className={`tooltip-${Math.floor(base + current.variance)}`}>
                <span>{new Date(new Date(0).setUTCMonth(current.month)).toLocaleDateString("en-US", {month: "long"})}</span> <span>{current.year}</span>
                <br />
                <span>{(base + current.variance).toFixed(1)}°</span>
            </div>
        )
    };

    return (
        <div id="chart-wrapper" >
            <h1 id="title">Monthly Global Land-Surface Temperature</h1>
            <h2 id="description">{data ? d3.min(data, d => d.year) : ""} - {data ? d3.max(data, d =>  d.year) : ""}</h2>
            {data && base ? <HeatMapSVG data={data} base={base} hoverEvent={updateCurrent} /> : null}
            {current ? tooltip() : null}
        </div>
    )

}