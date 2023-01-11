
async function fetchPokemon() {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokedex/2/");
        const data = await response.json();

        // Generate Random Pokemon
        const randomIndex = Math.floor(Math.random() * data.pokemon_entries.length);
        const pokemon = data.pokemon_entries[randomIndex];

        // Get image and name
        const name = pokemon.pokemon_species.name;
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.entry_number}.png`;

        // Pokemon's name and image
        document.getElementById("pokemonName").innerHTML = name;
        document.getElementById("pokemonImage").src = imageUrl;
    } catch (error) {

    }
}

