/*
document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("searchButton");
    const searchInput = document.getElementById("searchInput");
    const resultsContainer = document.getElementById("albums-grid");
  
    searchButton.addEventListener("click", () => {
      const query = searchInput.value.trim();
      if (!query) return;
  
      fetch(`http://localhost:3000/search?q=${query}`)
        .then((res) => res.json())
        .then((data) => {
          resultsContainer.innerHTML = ""; // Limpa resultados anteriores
          data.tracks.items.forEach((track) => {
            const trackElement = document.createElement("div");
            trackElement.innerHTML = `
              <img src="${track.album.images[0].url}" alt="${track.name}" width="100">
              <p>${track.name} - ${track.artists[0].name}</p>
              <a href="${track.external_urls.spotify}" target="_blank">Ouvir no Spotify</a>
              <hr>
            `;
            resultsContainer.appendChild(trackElement);
          });
        })
        .catch((err) => console.error("Erro ao buscar dados:", err));
    });
  });
  
*/
  document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const resultsContainer = document.getElementById("albums-grid");
  
    let debounceTimer;
    searchInput.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const query = searchInput.value.trim();
        if (!query) {
          resultsContainer.innerHTML = "";
          return;
        }
  
        fetch(`http://localhost:3000/search?q=${query}`)
          .then((res) => res.json())
          .then((data) => {
            resultsContainer.innerHTML = ""; // Limpa resultados anteriores
            data.tracks.items.forEach((track) => {
              // Cria um card para cada track
              const card = document.createElement("div");
              card.className = "card";
              card.innerHTML = `
                <img src="${track.album.images[0].url}" alt="${track.name}">
                <p>${track.name}</p>
                <p>${track.artists[0].name}</p>
                <a href="${track.external_urls.spotify}" target="_blank">Ouvir</a>
              `;
              resultsContainer.appendChild(card);
            });
          })
          .catch((err) => console.error("Erro ao buscar dados:", err));
      }, 300); // Aguarda 300ms após o usuário parar de digitar
    });
  });