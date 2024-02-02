/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect} from "react";
// import * as d3 from "d3";
import ChoroplethMapSVG from "./choropleth-map-svg";
import "./styles.scss"

export default function HeatMap () {

    const [educationData, setEducationData] = useState(null);
	const [countyData, setCountyData] = useState(null);
    const [current, setCurrent] = useState(null);

    const educationDataURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
	const countyDataURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
    useEffect(() => {
		document.addEventListener("DOMContentLoaded", () => {
			if (!educationData) {
				fetch(educationDataURL).then(data => data.json()).then(jsonData => {
					setEducationData(jsonData);
					console.log(jsonData);
				});
			}

			if (!countyData) {
				fetch(countyDataURL).then(data => data.json()).then(jsonData => {
					setCountyData(jsonData);
					console.log(jsonData);
				})
			}
		})
    }, [])

	const renderSVG = () => {
		if (countyData && educationData) {
			return (
				<ChoroplethMapSVG
					educationData={educationData}
					countyData={countyData}
					hoverAction={updateCurrent}
				/>
			)
		}
	}

	const updateCurrent = (event) => {
        if (event) {
			setCurrent(event.target);
			// setPosition({x: event.pageX, y: event.pageY - 10});
		} else {
			setCurrent(null)
		}
    }

	const renderTooltip = () => {
		const countyName = current ? current.getAttribute("data-county") : "";
		const stateName = current ? current.getAttribute("data-state") : "";
		const stat = current ? current.getAttribute("data-education") : "";
		// const color = current ? current.getAttribute("fill") : "transparent";

        return (
            <div
				id="tooltip"
				style={{
					// border: `5px solid ${color}`,
					// color: color,
					visibility: current ? "visible" : "hidden",
				}}
				data-education={stat}
			>
                <span style={{}}>{stat}% of people in {countyName}, {stateName} have a college degree</span>
            </div>
        )
    };

	return (
		<div id="map-wrapper">
			<div id="upper">
				<h1 id="title">
					United States College Graduation Rate
				</h1>
				<h2 id="description">
					Percentage of adults who have obtained at least a bachelors degree, by county.
				</h2>
				{renderTooltip()}
			</div>
			{renderSVG()}
		</div>
	)
}