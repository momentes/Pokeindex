
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

function searchPokemon() {
    const input = document.getElementById("search-input").value;
    const modal = document.getElementById("myModal");
    const modalContent = document.querySelector(".modal-content");
    const span = document.querySelector(".close");

    modalContent.innerHTML = "";
    
    fetch(`https://pokeapi.co/api/v2/pokemon/${input}`)
      .then(response => response.json())
      .then(data => {
        const name = data.name;
        const imageUrl = data.sprites.front_default;
        const moves = data.move-category.map(move => move.move.name).join(', ');
        const stats = data.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`).join(', ');
        modalContent.innerHTML = `
          <img src="${imageUrl}" alt="${name}">
          <p>Name: ${name}</p>
          <p>Moves: ${moves}</p>
          <p>Stats: ${stats}</p>
        `;
        modal.style.display = "block";
      })
      .catch(error => {
        modalContent.innerHTML = "Pokemon not found.";
        modal.style.display = "block";
      });

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
}
