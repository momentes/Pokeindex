

////////////////////////////////////////

// Variables

// Get the close buttons
const pokemonClose = document.getElementById("pokemonClose");
const cardClose = document.getElementById("cardClose");


// Get the search button and input
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");


const searchDropdown = document.getElementById("searchDropdown");
const searchList = document.getElementById("searchList");


//////////////////////////////////////////////

// Session Storage

let lastSearches = [];
let timeoutId; //I cant believe timeoutID and not using trigger! brilliant!//

searchInput.addEventListener("focus", function(){
  clearTimeout(timeoutId);
  if(sessionStorage.getItem("lastSearches")) {
    lastSearches = JSON.parse(sessionStorage.getItem("lastSearches"));
    searchList.innerHTML = "";
    for (let i = 0; i < lastSearches.length; i++) {
      const listItem = document.createElement("li");
      listItem.innerText = lastSearches[i];
      listItem.addEventListener("click", function(){
        searchInput.value = listItem.innerText;
        searchBtn.click();
        searchDropdown.style.display = "none";
      });
      searchList.appendChild(listItem);
    }
    searchDropdown.style.display = "block";
  }
});

searchInput.addEventListener("blur", function(){
  timeoutId = setTimeout(() => {
    searchDropdown.style.display = "none";
  }, 200);
});

searchBtn.addEventListener("click", function(){
  // Get the search value
  const searchValue = searchInput.value.toLowerCase();


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
    // If the search is successful, add lastSearches array
    lastSearches.unshift(searchValue);

    // Keep search at 5 elements
    if(lastSearches.length > 5) {
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


/////////////////////////////////////////////

// Pokemon Search

// Search on Enter
searchInput.addEventListener("keydown", function(event){
  if(event.keyCode === 13){
    searchBtn.click();
  }
});

searchBtn.addEventListener("click", function(){

  const searchValue = searchInput.value.toLowerCase();

  // Check if the search input is empty
  if(searchValue === "") {
    searchInput.value = "";
    searchInput.placeholder = "Search Pokémon ";
    return;
  }


/////////////////////////////////////////////

    // Make API call for Pokemon Pokedex details
    fetch(`https://pokeapi.co/api/v2/pokemon/${searchValue}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    })
    .then(data => {
      let output = "";
      let imageOutput = `<img src='${data.sprites.front_default}' alt='${data.name}' class='modalImage'/>`;
      
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
      imagePokedexRandom = `<img src='${randomVersion[pokeDexIndex].front_default}' alt='${data.name}' class='modalImage'/>`;
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
        imageRandom = `<img src='${randomSprite}' alt='${data.name}'class='modalImageB'/>`;
    }

    let moveRandom = "";
    let moves = data.moves;
    let randomMoves = [];
    while(randomMoves.length < 6) {
      let randomMoveIndex = Math.floor(Math.random() * moves.length);
      let randomMove = moves[randomMoveIndex].move;
      if(!randomMoves.includes(randomMove)) {
        randomMoves.push(randomMove);

        // Itemized Move Line
        // moveRandom += `<p>Move: ${randomMove.name}</p>`;

        // Upper Case
        // moveRandom += `<p>Move: ${randomMove.name.charAt(0).toUpperCase() + randomMove.name.slice(1)}</p>`;

         // Itemized Move to Single Line
        //Upper Case
        // moveRandom = `<p>Moves: ${randomMoves.map(move => move.name).join(', ')}</p>`;
        moveRandom = `<p class="FontStyle1"><span class="FontStyle2">Moves: </span> ${randomMoves.map(move => capitalize(move.name)).join(', ')}</p>`;
        
      }
    }

    function capitalize(str) {
      return str.replace(/\b[a-z]/g, (x) => x.toUpperCase());
      }

      output += imageOutput; 
      output += imagePokedexRandom;
      output += imageRandom;
      output += `<p class="FontStyle1"><span class="FontStyle2">Name: </span> ${capitalize(data.name)}</p>`;
      output += `<p class="FontStyle1"><span class="FontStyle2">Type: </span>${data.types.map(d=> capitalize(d.type.name)).join(', ')}</p>`;
      output += `<p class="FontStyle1"><span class="FontStyle2">Weight: </span> <span ">${data.weight} kg</span></p>`; //No Caps on Numbers
      output += `<p class="FontStyle1"><span class="FontStyle2">Height: </span>${data.height} cm</p>`; //No Caps on Numbers
      output += `<p class="FontStyle1"><span class="FontStyle2">Stats: </span> ${data.stats.map(d=> capitalize(d.stat.name) + ' ' + d.base_stat).join(', ')}</p>`;
      output += `<p class="FontStyle1"><span class="FontStyle2">Abilities: </span> ${data.abilities.map(d=> capitalize(d.ability.name)).join(', ')}</p>`;
      output += moveRandom;

    //Make API call for Pokemon-Species Pokedex details
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
      output += `<p class="FontStyle1"><span class="FontStyle2">Description: </span> ${flavor_text_entries[randomIndex].flavor_text}</p>`;
      let varieties = data.varieties;
      let randomIndexVariety = Math.floor(Math.random() * varieties.length);
      let randomVariety = varieties[randomIndexVariety];
      output += `<p class="FontStyle1"> <span class="FontStyle2">Name Variety: </span> ${capitalize(randomVariety.pokemon.name)}</p>`;
      let pokedex_number = data.pokedex_numbers.filter(d=>d.pokedex.name === "national");
      output += `<p class="FontStyle1"> <span class="FontStyle2">Pokedex Number: </span> ${pokedex_number[0].entry_number}</p>`;

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


//////////////////////////////////////////////


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
              //output += `<p>Name:${res.name}</p>`;
              output += `<p class="FontStyle2">Card Id: ${res.id}</p>`;
              // Update the card modal body
              document.getElementById("cardModalBody").innerHTML = output;
              // Show the card modal
              cardModal.style.display = "block";
            });
        } else {
          searchInput.value = "";
          searchInput.placeholder = "Pokémon not found";
        }
      } else {
        searchInput.value = "";
        searchInput.placeholder = "Pokémon not found";
      }
         })
    })
    .catch(err => {
      searchInput.value = "";
      searchInput.placeholder = "Pokémon not found";
    });
});


//////////////////////////////////////////////


// Modal Image Function
// Close the Pokemon modal clicking button close
pokemonClose.addEventListener("click", function() {
  pokemonModal.style.display = "none";
});

// Close the card modal clicking button close
cardClose.addEventListener("click", function() {
  cardModal.style.display = "none";
});

// Close the modals when clicked outside content
window.addEventListener("click", function(event) {
  if (event.target === pokemonModal) {
    pokemonModal.style.display = "none";
  }
  if (event.target === cardModal) {
    cardModal.style.display = "none";
  }
});


////////////////////////
let idle = false;
let idleInterval = setInterval(timerIncrement, 35000); // check for idle every 3.5 minute

// Check for user activity
document.addEventListener("mousemove", resetIdleTimer);
document.addEventListener("keypress", resetIdleTimer);

function resetIdleTimer() {
  idle = false;
}

function timerIncrement() {
  if (idle) {
    fetch("https://aws.random.cat/meow")
    .then(response => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const catModal = document.createElement("div");
        catModal.id = "catModal";
        catModal.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 999;
        `;
        catModal.innerHTML = `<img src='${data.file}' alt='cat'/>`;
        document.body.appendChild(catModal);
        setTimeout(() => {
            catModal.remove();
        }, 3000); // remove the cat modal after 3.0 seconds
    })
    .catch(error => {
        console.log(error);
    });
  } else {
    idle = true;
  }
}


