
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


// Get the close buttons
const pokemonClose = document.getElementById("pokemonClose");
const cardClose = document.getElementById("cardClose");


// Get the search button and input
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");


const searchDropdown = document.getElementById("searchDropdown");
const searchList = document.getElementById("searchList");
let lastSearches = [];


searchInput.addEventListener("focus", function(){
  if(sessionStorage.getItem("lastSearches")) {
  lastSearches = JSON.parse(sessionStorage.getItem("lastSearches"));
  searchList.innerHTML = "";
  for (let i = 0; i < lastSearches.length; i++) {
    const listItem = document.createElement("li");
    listItem.innerText = lastSearches[i];
    listItem.addEventListener("click", function(){
      searchInput.value = listItem.innerText;
      searchDropdown.style.display = "none";
      searchBtn.click();
    });
    searchList.appendChild(listItem);
  }
  searchDropdown.style.display = "block";
}
});

searchInput.addEventListener("blur", function(){
  searchDropdown.style.display = "none";
});

searchBtn.addEventListener("click", function(){
  // Get the search value
  const searchValue = searchInput.value.toLowerCase();

  // Check if the search input is empty
  if(searchValue === "") {
    searchInput.value = "";
    searchInput.placeholder = "Search Pokémon ";
    return;
  }

  // Make API call for Pokemon details
  fetch(`https://pokeapi.co/api/v2/pokemon/${searchValue}`)
  .then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  })
  .then(data => {
    // If the search is successful, add it to the lastSearches array
    lastSearches.unshift(searchValue);

    // Keep the array at a maximum of 4 elements
    if(lastSearches.length > 4) {
      lastSearches.pop();
    }

    // Save the lastSearches array to session storage
    sessionStorage.setItem("lastSearches", JSON.stringify(lastSearches));
    searchInput.value ="";
    searchDropdown.style.display = "none";
  })
  .catch(error => {
    console.log(error);
  });
});




searchBtn.addEventListener("click", function(){
  // Get the search value
  const searchValue = searchInput.value.toLowerCase();

  // Check if the search input is empty
  if(searchValue === "") {
    searchInput.value = "";
    searchInput.placeholder = "Search Pokémon ";
    return;
  }

    // Make API call for Pokemon details
    fetch(`https://pokeapi.co/api/v2/pokemon/${searchValue}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    })
    .then(data => {
      let output = "";
      let imageOutput = `<img src='${data.sprites.front_default}' alt='${data.name}'/>`;
      let imagePokedexRandom = "";
      if(data.sprites.versions){
      let version_keys = Object.keys(data.sprites.versions);
      let randomVersionIndex = Math.floor(Math.random() * version_keys.length);
      let randomVersionKey = version_keys[randomVersionIndex];
      let randomVersion = data.sprites.versions[randomVersionKey];
      let pokeDexIndex = null;
      while(pokeDexIndex === null){
        pokeDexIndex = Object.keys(randomVersion)[Math.floor(Math.random() * Object.keys(randomVersion).length)];
      }
      imagePokedexRandom = `<img src='${randomVersion[pokeDexIndex].front_default}' alt='${data.name}'/>`;
    }
      
      let imageRandom = "";
      if(data.sprites.other){
        let other_sprites = Object.values(data.sprites.other);
        let randomVersionIndex = Math.floor(Math.random() * other_sprites.length);
        let randomVersion = other_sprites[randomVersionIndex];
        let randomSprite = null;
        while(randomSprite === null){
            randomSprite = Object.values(randomVersion)[Math.floor(Math.random() * Object.values(randomVersion).length)];
        }
        imageRandom = `<img src='${randomSprite}' alt='${data.name}'/>`;
    }

      output += imageOutput; 
      output += imagePokedexRandom;
      output += imageRandom;
      output += `<p>Name: <span>${data.name}</span></p>`;
      output += `<p>Weight: ${data.weight}</p>`;
      output += `<p>Height: ${data.height}</p>`;
      output += `<p>Abilities: ${data.abilities.map(d=>d.ability.name).join(', ')}</p>`;
      output += `<p>Type: ${data.types.map(d=>d.type.name).join(', ')}</p>`;
      output += `<p>Stats: ${data.stats.map(d=>d.stat.name+ ' ' + d.base_stat).join(', ')}</p>`;

    //Make API call for Pokemon-Species details
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${searchValue}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    })
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

      // Update the Pokemon modal body
      document.getElementById("pokemonModalBody").innerHTML = output;
      
      // Show the Pokemon modal
      pokemonModal.style.display = "block";
  })
  //Catch error
  .catch(err => {
    searchInput.value = "";
    searchInput.placeholder = "Pokemon not found";
  });

    // Make API call for card details
    fetch(`https://api.tcgdex.net/v2/en/cards/?name=${searchValue}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    })
    .then(data => {
      let output = "";
      const filteredData = data.filter(card => card.name.length === searchValue.length);
      if (filteredData.length > 0) {
        const matchedCards = filteredData.filter(card => card.name.toLowerCase() === searchValue.toLowerCase());
      if (matchedCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * matchedCards.length);
         fetch(`https://api.tcgdex.net/v2/en/cards/${matchedCards[randomIndex].id}`)
           .then(response => response.json())
           .then(res => {
              output += `<img src='${res.image}/high.webp' alt='${res.name}'/>`;
              output += `<p>Name: <span>${res.name}</span></p>`;
              output += `<p>Card Id: ${res.id}</p>`;
              // Update the card modal body
              document.getElementById("cardModalBody").innerHTML = output;
              // Show the card modal
              cardModal.style.display = "block";
            });
        } else {
          searchInput.value = "";
          searchInput.placeholder = "Pokemon not found";
        }
      } else {
        searchInput.value = "";
        searchInput.placeholder = "Pokemon not found";
      }
         })
    })
    //Catch error
    .catch(err => {
      searchInput.value = "";
      searchInput.placeholder = "Pokemon not found";
    });
});




// Close the Pokemon modal when the close button is clicked
pokemonClose.addEventListener("click", function() {
  pokemonModal.style.display = "none";
});

// Close the card modal when the close button is clicked
cardClose.addEventListener("click", function() {
  cardModal.style.display = "none";
});

// Close the modals when clicked outside of the modal content
window.addEventListener("click", function(event) {
  if (event.target === pokemonModal) {
    pokemonModal.style.display = "none";
  }
  if (event.target === cardModal) {
    cardModal.style.display = "none";
  }
});





// closeModal.onclick = function() {
//   modal.style.display = "none";
// }


// window.onclick = function(event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// }
