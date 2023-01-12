
// async function fetchPokemon() {
//     try {
//         const response = await fetch("https://pokeapi.co/api/v2/pokedex/2/");
//         const data = await response.json();

//         // Generate Random Pokemon
//         const randomIndex = Math.floor(Math.random() * data.pokemon_entries.length);
//         const pokemon = data.pokemon_entries[randomIndex];

//         // Get image and name
//         const name = pokemon.pokemon_species.name;
//         const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.entry_number}.png`;

//         // Pokemon's name and image
//         document.getElementById("pokemonName").innerHTML = name;
//         document.getElementById("pokemonImage").src = imageUrl;
//     } catch (error) {

//     }
// }

// setInterval(fetchPokemon, 1000);


// function searchPokemon() {
//     const input = document.getElementById("search-input").value;
//     const resultDiv = document.getElementById("result");
//     resultDiv.innerHTML = "";

//     fetch(`https://pokeapi.co/api/v2/pokemon/${input}`)
//       .then(response => response.json())
//       .then(data => {
//         const name = data.name;
//         const imageUrl = data.sprites.front_default;
//         const moves = data.moves.map(move => move.move.name).join(', ');
//         const stats = data.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`).join(', ');
//         resultDiv.innerHTML = `
//           <img src="${imageUrl}" alt="${name}">
//           <p>Name: ${name}</p>
//           <p>Moves: ${moves}</p>
//           <p>Stats: ${stats}</p>
//         `;
//       })
//       .catch(error => {
//         resultDiv.innerHTML = "Pokemon not found.";
//       });
// }

var modal = document.getElementById("modal");
var closeModal = document

document.getElementById("searchBtn").addEventListener("click", function(){
    // get the search input
    const searchValue = document.getElementById("search").value;
    // make an api call for pokemon details
    fetch(`https://pokeapi.co/api/v2/pokemon/${searchValue}`)
    .then(response => response.json())
    .then(data => {
      let output = "";
      output += `<img src='${data.sprites.front_default}' alt='${data.name}'/>`;
      output += `<p>Name: ${data.name}</p>`;
      output += `<p>Weight: ${data.weight}</p>`;
      output += `<p>Height: ${data.height}</p>`;
      output += `<p>Abilities: ${data.abilities.map(d=>d.ability.name).join(', ')}</p>`;
      output += `<p>Type: ${data.types.map(d=>d.type.name).join(', ')}</p>`;
      output += `<p>Stats: ${data.stats.map(d=>d.stat.name+ ' ' + d.base_stat).join(', ')}</p>`;
      // make another api call for species details
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${searchValue}`)
      .then(response => response.json())
      .then(data => {
        let flavor_text_entries = data.flavor_text_entries.filter(d=>d.language.name==='en');
        let randomIndex = Math.floor(Math.random() * flavor_text_entries.length);
        output += `<p>Description: ${flavor_text_entries[randomIndex].flavor_text}</p>`;
        let varieties = data.varieties;
        let randomIndexVariety = Math.floor(Math.random() * varieties.length);
        let randomVariety = varieties[randomIndexVariety];
        output += `<p>Name Variety: ${randomVariety.pokemon.name}</p>`;
        let pokedex_number = data.pokedex_numbers.filter(d=>d.pokedex.name === "national");
        output += `<p>Pokedex Number: ${pokedex_number[0].entry_number}</p>`;
        document.getElementById("modal-body").innerHTML = output;
        modal.style.display = "block";
      });
    })
    .catch(err => {
        document.getElementById("modal-body").innerHTML = "Pokemon not found";
        modal.style.display = "block";
    });
});

// Close the modal when the user clicks on the close button
closeModal.onclick = function() {
  modal.style.display = "none";
}

// Close the modal when the user clicks outside of the modal content
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}