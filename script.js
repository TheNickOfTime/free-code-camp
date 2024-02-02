const baseURL = window.location.href;
const projects = [
    {
        course: "Responsive Web Design",
        projects: [
            {
                name: "Survey Form",
                relative_path: "01 - Responsive Web Design/01 - Survey Form"
            },
            {
                name: "Tribute Page",
                relative_path: "01 - Responsive Web Design/02 - Tribute Page"
            },
            {
                name: "Technical Documentation",
                relative_path: "01 - Responsive Web Design/03 - Technical Documentation"
            },
            {
                name: "Product Landing Page",
                relative_path: "01 - Responsive Web Design/04 - Product Landing Page"
            },
            {
                name: "Personal Portfolio",
                relative_path: "01 - Responsive Web Design/05 - Personal Portfolio"
            },
        ]
    },
    {
        course: "JavaScript Algorithms and Data Structures",
        projects: [
            {
                name: "Palindrome Checker",
                relative_path: "02 - JavaScript Algorithms and Data Structures/01 - Palindrome Checker"
            },
            {
                name: "Roman Numeral Converter",
                relative_path: "02 - JavaScript Algorithms and Data Structures/02 - Roman Numeral Converter"
            },
            {
                name: "Telephone Number Validator",
                relative_path: "02 - JavaScript Algorithms and Data Structures/03 - Telephone Number Validator"
            },
            {
                name: "Cash Register",
                relative_path: "02 - JavaScript Algorithms and Data Structures/04 - Cash Register"
            },
            {
                name: "Pokemon Search App",
                relative_path: "02 - JavaScript Algorithms and Data Structures/05 - Pokemon Search App"
            },
        ]
    },
    {
        course: "Front End Development Libraries",
        projects: [
            {
                name: "Random Quote Machine",
                relative_path: "03 - Front End Development Libraries/01 - Random Quote Machine"
            },
            {
                name: "Markdown Previewer",
                relative_path: "03 - Front End Development Libraries/02 - Markdown Previewer/dist"
            },
            {
                name: "Drum Machine",
                relative_path: "03 - Front End Development Libraries/03 - Drum Machine/dist"
            },
            {
                name: "JavaScript Calculator",
                relative_path: "03 - Front End Development Libraries/04 - JavaScript Calculator/dist"
            },
            {
                name: "25+5 Clock",
                relative_path: "03 - Front End Development Libraries/05 - 25 + 5 Clock/dist"
            },
        ]
    },
    {
        course: "Front End Development Libraries",
        projects: [
            {
                name: "Bar Chart",
                relative_path: "04 - Data Visualization/01 - Bar Chart/dist"
            },
            {
                name: "Scatterplot Graph",
                relative_path: "04 - Data Visualization/02 - Scatterplot Graph/dist"
            },
            {
                name: "Heat Map",
                relative_path: "04 - Data Visualization/03 - Heat Map/dist"
            },
            {
                name: "Choropleth Map",
                relative_path: "04 - Data Visualization/04 - Choropleth Map/dist"
            }
        ]
    },
]

$(document).ready(renderProjects);

function renderProjects () {
    for (let courseIndex in projects) {
        const course = projects[courseIndex];
        console.log(course);
        const courseName = course.course;
        const courseID = `course-${courseIndex}`
        let courseHTML = (
            `<div class="course">
                <h2>${courseName}</h2>
                <div class="projects-container" id="${courseID}">

                </div>
            </div>`
        )
        $("#courses-container").append(courseHTML);
        for (let projectIndex in course.projects) {
            const project = course.projects[projectIndex];
            const projectName = project.name;
            const projectPath = project.relative_path.replace(/\s/g, "%20");
            const projectURL = `${baseURL}${projectPath}`;
            const projectHTML = (
                `<div class="project">
                    <a href="${projectURL}">
                        <img class="project-thumb" src="${projectURL}/thumb.png">
                        <h3>${projectName}</h3>
                    </a>
                </div>`
            )
            $(`#${courseID}`).prepend(projectHTML)
        }
    }
}