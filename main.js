const requestURL = './json/films.json'

// Función asíncrona

async function fetchMoviesJson() {
    const response = await fetch(requestURL);
    const movies = await response.json();
    return movies;
}

fetchMoviesJson().then(movies => {
    const movieSection = document.getElementById('movieSection');

    movies.films.forEach(movie => {
        movieSection.innerHTML += `
            <div class="col">
                <div class="card h-100" style="width: 100%;">
                    <img src="${movie.poster}" class="card-img-top" alt="${movie.title}">
                    <div class="card-body">
                        <h5 class="card-title">${movie.title}</h5>
                        <p class="card-text">
                            <span class="h6">${movie.year}</span> · ${movie.length}
                        </p>
                        <h6 class="card-title mb-4">${movie.director}</h6>
                        <p class="card-text">${movie.synopsis}</p>
                    </div>
                </div>
            </div>
        `;
    });
});