const requestURL = './json/films.json';

// Función asíncrona para obtener las películas
async function fetchMoviesJson() {
    const response = await fetch(requestURL);
    const movies = await response.json();
    return movies;
}

// Función para renderizar películas
function renderMovies(movies) {
    const movieSection = document.getElementById('movieSection');
    movieSection.innerHTML = ''; 

    if (movies.length === 0) {
        movieSection.innerHTML = `
            <div class="col-12 d-flex justify-content-center align-items-center" style="height: 100px; white-space: nowrap; width: auto;">
                <p class="text-center mb-0" style="margin: 0;">Solo puedes hacer búsqueda por título de película, por director o por año de publicación</p>
            </div>
        `;
        return;
    }
    
    movies.forEach(movie => {
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
}

function filterMovies(movies, searchTerm) {
    return movies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.year.toString().includes(searchTerm) 
    );
}

fetchMoviesJson().then(data => {
    const movies = data.films;
    renderMovies(movies); 

    const searchInput = document.querySelector('input[type="search"]');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value;
        const filteredMovies = filterMovies(movies, searchTerm); 
        renderMovies(filteredMovies); 
    });
});
