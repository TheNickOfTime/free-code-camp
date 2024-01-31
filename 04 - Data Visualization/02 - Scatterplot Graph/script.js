import * as d3 from "d3";

const dataURL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
let data = {}
document.addEventListener("DOMContentLoaded", () => {
    fetch(dataURL).then(data => data.json()).then((jsonData) => {
        console.log(jsonData);
        data = jsonData;
        renderGraph();
    })
})

const svg = d3.select("#chart-svg");
const tooltip = d3.select("#tooltip");

const timeStringToDate = (timeString) => {
    const [minutes, seconds] = timeString.split(":");
    let date = new Date().setMinutes(minutes, seconds);
    date = new Date(date);

    return date;
}

const onMouseOver = (event, d) => {
    tooltip.select("#name").text(d.Name);
    tooltip.select("#country").text(d.Nationality);
    tooltip.select("#place").text(`${d.Place}${nthNumber(d.Place)}`)
    tooltip.select("#year").text(d.Year);
    tooltip.select("#time").text(d.Time);
    tooltip.select("#dope-info").text(d.Doping);
    tooltip.attr("data-year", event.target.getAttribute("data-xvalue"));
    tooltip.style("top", (event.pageY - 20) + "px");
    tooltip.style("left", event.pageX + "px");
    tooltip.style("visibility", "visible");
    console.log(event.target.getAttribute("cx"));
}

const nthNumber = (number) => {
    if (number > 3 && number < 21) return "th";
    switch (number % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };  

function renderGraph() {
    const x = {
        min: d3.min(data, d => new Date(Date.parse(d.Year - 1))),
        max: d3.max(data, d => new Date(Date.parse(d.Year + 1))),

    }
    const y = {
        min: timeStringToDate("36:45"),
        // min: d3.min(data, d => timeStringToDate(d.Time)),
        max: d3.max(data, d => timeStringToDate(d.Time)),
    }

    const size = {
        x: 960,
        y: 540,
    }

    const margin = {
        x: 50,
        y: 25,
    }

    const scale = {
        x: d3.scaleTime([x.min, x.max], [margin.x, size.x]),
        y: d3.scaleTime([y.min, y.max], [size.y - margin.y, 0]),
    }

    console.log(timeStringToDate(data[0].Time));
    // console.log(x.min);

    const axis = {
        x: svg.append("g").call(d3.axisBottom(scale.x))
            .attr("id", "x-axis")
            .attr("transform", `translate(0, ${size.y - margin.y})`),
        y: svg.append("g").call(d3.axisLeft(scale.y).tickFormat(d3.timeFormat('%M:%S')))
            .attr("id", "y-axis")
            .attr("transform", `translate(${margin.x}, 0)`),
    }

    svg.attr("viewBox", `0 0 ${size.x} ${size.y}`);
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => scale.x(new Date(Date.parse(d.Year))))
        .attr("cy", d => scale.y(timeStringToDate(d.Time)))
        .attr("r", 4)
        .attr("class", d => d.Doping ? "dot doper" : "dot clean")
        .attr("data-xvalue", d => new Date(Date.parse(d.Year)))
        .attr("data-yvalue",d => timeStringToDate(d.Time))
        .on("mouseover", (event, d) => {onMouseOver(event, d)})
        .on("mouseleave", () => {tooltip.style("visibility", "hidden");});
    
    const legend = svg.append("g")
        .attr("id", "legend")
        .attr("transform", `translate(${size.x / 2}, ${size.y + 25})`)

    legend.append("g").attr("id", "legend-dope")
        .attr("transform", `translate(-75, 0)`);
    legend.append("g").attr("id", "legend-clean")
        .attr("transform", `translate(75, 0)`);
    
    legend.select("#legend-dope")
        .append("rect")
        .attr("x", -20)
        .attr("y", -9)
    legend.select("#legend-dope")
        .append("text")
        .text("Doping (Allegedlys)");
    
    legend.select("#legend-clean")
        .append("rect")
        .attr("x", -20)
        .attr("y", -9)
    legend.select("#legend-clean")
        .append("text")
        .text("Clean (Allegedlys)");
}
