const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const pokemonName = document.getElementById("pokemon-name");
const pokemonId = document.getElementById("pokemon-id");
const weightText = document.getElementById("weight");
const heightText = document.getElementById("height");
const typesDiv = document.getElementById("types");
const metricsDiv = document.getElementById("metrics-table");
const statsDiv = document.getElementById("stats-div");
const hpText = document.getElementById("hp");
const attackText = document.getElementById("attack");
const defenseText = document.getElementById("defense");
const specialAttackText = document.getElementById("special-attack");
const specialDefenseText = document.getElementById("special-defense");
const speedText = document.getElementById("speed");
const sprite = document.getElementById("sprite");
const keyboardButtons = document.getElementsByClassName("keyboard-key");
const leftScreen = document.getElementById("left-screen");

searchButton.addEventListener("click", onSearch);
[...keyboardButtons].forEach((key) => {
    key.addEventListener("click", (key) => {
        searchInput.value += key.target.textContent;
    })
})

const apiURL = "https://pokeapi-proxy.freecodecamp.rocks/api/pokemon";

toggleFields(false);

async function onSearch(e) {
    const pokemon = searchInput.value.toLowerCase();
    pokemon.replace(/\s/, "-");
    pokemon.replace("♀", "f");
    pokemon.replace("♂", "m");
    const query = `${apiURL}/${pokemon}`;

    toggleFields(false);

    try {
        const request = await fetch(query);
        const data = await request.json();
        // console.log(data)
        populateFields(await data);
        setTimeout(toggleFields(true), 1000);
    } catch (error) {
        alert("Pokémon not found");
        return;
    }
}

function toggleFields (toggle) {
    // metricsDiv.style.visibility = "hidden";
    // statsDiv.style.visibility = "hidden";
    [...leftScreen.children].forEach((element) => {
        element.style.visibility = toggle ? "visible" : "hidden";
    });
    metricsDiv.style.backgroundColor = toggle ? "transparent" : "black";
    statsDiv.style.backgroundColor = toggle ? "transparent" : "black";
}

function populateFields(data) {
    const {id, name, types, height, weight, stats, sprites} = data;
    const spriteURL = sprites["front_default"];
    const formattedStats = {};
    stats.map((stat) => {
        const statName = stat.stat.name.replace(" ", "-").toLowerCase();
        const statValue = stat.base_stat;
        formattedStats[statName] = statValue;
    })

    pokemonId.textContent = id;
    pokemonName.textContent = name.toUpperCase();
    typesDiv.innerHTML = types.map(entry => `<span class="type ${entry.type.name.toLowerCase()}">${entry.type.name.toUpperCase()}</span>`);
    weightText.textContent = `${weight}`;
    heightText.textContent = `${height}`;
    hpText.textContent = formattedStats["hp"];
    attackText.textContent = formattedStats["attack"];
    defenseText.textContent = formattedStats["defense"];
    speedText.textContent = formattedStats["speed"];
    specialAttackText.textContent = formattedStats["special-attack"];
    specialDefenseText.textContent = formattedStats["special-defense"];
    // console.log(sprite);
    sprite.src = spriteURL;
}