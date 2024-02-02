import * as d3 from "d3";
import { useEffect, useState } from "react";
import TreemapSVG from "./treemap-svg";
import "./styles.scss";

export default function Treemap() {

	const dataURLs = {
		kickstarter: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json",
		movies: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json",
		games: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json",
	}

	const titleData = {
		"kickstarter": {
			title: "The 100 Most Funded Kickstarter Campaigns",
			description: "Grouped by Kind"
		},
		"movies": {
			title: "The 100 Highest Grossing Films",
			description: "Grouped by Genre"
		},
		"games": {
			title: "The 100 Most Purchased Video Games",
			description: "Grouped by Platform"
		}
	}

	const [kickstarterData, setKickstarterData] = useState(null);
	const [moviesData, setMoviesData] = useState(null);
	const [gamesData, setGamesData] = useState(null)
	const [currentData, setCurrentData] = useState(null);
	const [current, setCurrent] = useState(null);
	const [mouse, setMouse] = useState({x: 0, y: 0})

	useEffect(() => {
		if (!kickstarterData) {
			d3.json(dataURLs.kickstarter).then(data =>{
				setKickstarterData(data);
				console.log(data);
			});
		}
		if (!moviesData) {
			d3.json(dataURLs.movies).then(data => {
				setMoviesData(data);
				console.log(data);
				if (!currentData) {
					setCurrentData(data);
				}
			});
		}
		if (!gamesData) {
			d3.json(dataURLs.games).then(data => {
				setGamesData(data);
				console.log(data);
			});
		}
	}, [])

	useEffect(() => {
		document.addEventListener("mousemove", (e) => {setMouse({x: e.pageX, y: e.pageY})})
	}, [])

	const updateCurrent = (event) => {
        if (event) {
			setCurrent(event.target);
			// setPosition({x: event.pageX, y: event.pageY - 10});
		} else {
			setCurrent(null)
		}
    }

	const renderTreemap = () => {
		if (currentData) {
			return (
				<TreemapSVG 
					data={currentData}
					hoverAction={updateCurrent}
				/>
			)
		}
	}

	const renderTooltip = () => {

		const value = current ? current.getAttribute("data-value") : "";
		const name = current ? current.getAttribute("data-name") : "";

        return (
            <div
				id="tooltip"
				style={{
					visibility: current ? "visible" : "hidden",
					top: mouse.y - 10,
					left: mouse.x,
				}}
				data-value={value}
			>
                <p>{name}</p>
				<p>${parseInt(value).toLocaleString("en-US")}</p>
            </div>
        )
    };

	const name = currentData ? () => {
		console.log(currentData.name)
		switch (true) {
			case /movie/gi.test(currentData.name):
				return "movies";
			case /game/gi.test(currentData.name):
				return "games";
			case /kickstart/gi.test(currentData.name):
				return "kickstarter";
			default:
				return "something went wrong";
		}
	} : "";
	// console.log(name);
	const title = currentData ? titleData[name()].title : "";
	const description = currentData ? titleData[name()].description : "";
	const onChange = event => {
		switch (event.target.value) {
			case "movies":
				setCurrentData(moviesData);
				break;
			case "games":
				setCurrentData(gamesData);
				break;
			case "kickstarter":
				setCurrentData(kickstarterData);
				break;
		}
	}


	return (
		<div id="treemap-wrapper">
			<div id="header">
				<h1 id="title">{title}</h1>
				<h2 id="description">{description}</h2>
				<div>
					<span>Other Data -{'>'} </span>
					<select defaultValue={"movies"} onChange={onChange}>
						<option value="movies">Movies</option>
						<option value="games">Games</option>
						<option value="kickstarter">Kickstarters</option>
					</select>
				</div>
			</div>
			{renderTreemap()}
			{renderTooltip()}
		</div>
	)
}