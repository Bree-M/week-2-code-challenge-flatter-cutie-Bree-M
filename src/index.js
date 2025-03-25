const API_URL = 'http://localhost:3000';

async function fetchCharacters() {
  try {
    const response = await fetch(`${API_URL}/characters`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching characters:", error);
    return []; 
  }
}

async function updateCharacterOnServer(character) {
  try {
    const response = await fetch(`${API_URL}/characters/${character.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ votes: character.votes })
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating character:", error);
  }
}

async function saveCharacterToServer(character) {
  try {
    const response = await fetch(`${API_URL}/characters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(character)
    });
    return await response.json();
  } catch (error) {
    console.error("Error saving character:", error);
  }
}
      document.addEventListener('DOMContentLoaded', function() {
        const characterBar = document.getElementById('character-bar');
        const detailedInfo = document.getElementById('detailed-info');
        const characterForm = document.getElementById('character-form');
        
        
        let characters = [
          {
            id: 1,
            name: "Mr. Cute",
            image: "https://i.pinimg.com/originals/e1/43/92/e14392b3bb9f745025a5cf6a9abe11be.gif",
            votes: 0
          },
          {
            id: 2,
            name: "Mx. Monkey",
            image: "https://i.pinimg.com/originals/44/26/3f/44263f7426263e2a0ca9d77aa6aae3d8.gif",
            votes: 0
          },
          {
            id: 3,
            name: "Ms. Zebra",
            image: "https://media2.giphy.com/media/20G9uNqE3K4dRjCppA/source.gif",
            votes: 0
          },
          {
            id: 4,
            name: "Dr. Lion",
            image: "https://i.pinimg.com/originals/b5/0f/d7/b50fd77c6d9645526a57ffdd22d73fa3.gif"
          },
          {
            id: 5,
            name: "Mme. Panda",
            image: "https://i.pinimg.com/originals/cc/ed/be/ccedbe54dd06be82fb01295ec6074844.gif",
            votes: 0
          }
        ];
        
        let currentCharacter = null;

         
         function saveCharacters() {
          localStorage.setItem('flatacuties-characters', JSON.stringify(characters));
        }

       
        async function init() {
  
  const serverCharacters = await fetchCharacters();
  if (serverCharacters && serverCharacters.length > 0) {
    characters = serverCharacters;
  }
  renderCharacterBar();
  if (characters.length > 0) {
    displayCharacterDetails(characters[0].id);
  }
}

       
        function renderCharacterBar() {
          characterBar.innerHTML = '';
          characters.forEach(character => {
            const tab = document.createElement('div');
            tab.className = 'character-tab';
            tab.textContent = character.name;
            tab.dataset.id = character.id;
            
            tab.addEventListener('click', () => {
              displayCharacterDetails(character.id);
            });
            
            characterBar.appendChild(tab);
          });
        }

        
        function displayCharacterDetails(characterId) {
          const character = characters.find(c => c.id == characterId);
          if (character) {
            currentCharacter = character;
            renderCharacterDetails();
          }
        }

       
        function renderCharacterDetails() {
          detailedInfo.innerHTML = `
            <h2>${currentCharacter.name}</h2>
            <img src="${currentCharacter.image}" alt="${currentCharacter.name}">
            <h3>Total Votes: <span id="vote-count">${currentCharacter.votes}</span></h3>
            <form id="votes-form">
              <input type="number" id="votes-input" placeholder="Enter votes" name="votes" min="1" required>
              <input type="submit" value="Add Votes">
              <button type="button" id="reset-btn">Reset Votes</button>
            </form>
          `;


          
          
          document.getElementById('votes-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            const votesToAdd = parseInt(document.getElementById('votes-input').value);
            if (!isNaN(votesToAdd) && votesToAdd > 0) {
              currentCharacter.votes += votesToAdd;
              await updateCharacterOnServer(currentCharacter); 
              saveCharacters();
              renderCharacterBar();
              renderCharacterDetails();
              document.getElementById('votes-input').value = '';
            }
          });
          
          
          document.getElementById('reset-btn').addEventListener('click', async function() {
            currentCharacter.votes = 0;
            await updateCharacterOnServer(currentCharacter); 
            document.getElementById('vote-count').textContent = currentCharacter.votes;
          });
        }


        
        function getTotalVotes() {
          return characters.reduce((total, character) => total + character.votes, 0);
        }

        
        characterForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          const name = document.getElementById('name').value.trim();
          const imageUrl = document.getElementById('image-url').value.trim();
          
          if (name && imageUrl) {
            const newId = characters.length > 0 ? Math.max(...characters.map(c => c.id)) + 1 : 1;
            const newCharacter = {
              id: newId,
              name: name,
              image: imageUrl,
              votes: 0
            };
            
            characters.push(newCharacter);
            saveCharacters();
            renderCharacterBar();
            displayCharacterDetails(newCharacter.id);

            characterForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const imageUrl = document.getElementById('image-url').value.trim();
  
  if (name && imageUrl) {
    const newCharacter = {
      name: name,
      image: imageUrl,
      votes: 0
    };
    
    const savedCharacter = await saveCharacterToServer(newCharacter);
    characters.push(savedCharacter);
    saveCharacters();
    renderCharacterBar();
    displayCharacterDetails(savedCharacter.id);
    characterForm.reset();
  }
});
            
          
            characterForm.reset();
          }
        });
        

        
        init();
      });