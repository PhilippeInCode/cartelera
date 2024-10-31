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
    const returnButtonContainer = document.getElementById('returnButtonContainer'); 
    movieSection.innerHTML = ''; 
    returnButtonContainer.style.display = 'none'; 

    // Mensaje si no hay películas que mostrar
    if (movies.length === 0) {
        movieSection.innerHTML = `
            <div class="col-12 d-flex justify-content-center align-items-center" style="height: 100px; white-space: nowrap; width: auto;">
                <p class="text-center mb-0" style="margin: 0;">You can only search by movie title, director or year of publication</p>
            </div>
        `;
        return;
    }

    // Renderizar cada película en la sección
    movies.forEach(movie => {
        movieSection.innerHTML += `
            <div class="col">
                <div class="card h-100 shadow transition" style="width: 100%; cursor: pointer;" onclick="redirectToMovieDetail('${movie.id}')">
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

// Función para filtrar las películas por rango de años
function filterMoviesByYearRange(startYear, endYear) {
    fetchMoviesJson().then(data => {
        const movies = data.films; 
        const filteredMovies = movies.filter(movie =>
            parseInt(movie.year) >= startYear && parseInt(movie.year) <= endYear 
        );

        // Mensaje si no hay resultados en la búsqueda avanzada
        const returnButtonContainer = document.getElementById('returnButtonContainer'); 
        if (filteredMovies.length === 0) {
            movieSection.innerHTML = `
                <div class="col-12 d-flex justify-content-center align-items-center" style="height: 100px; white-space: nowrap; width: auto;">
                    <p class="text-center mb-0" style="margin: 0;">Your search did not return any results</p>
                </div>
            `;
            returnButtonContainer.style.display = 'block'; 
        } else {
            renderMovies(filteredMovies); 
            returnButtonContainer.style.display = 'none'; 
        }
    });
}

// Evento para el botón Return
document.getElementById('returnButton').addEventListener('click', () => {
    fetchMoviesJson().then(data => {
        const movies = data.films; 
        renderMovies(movies); 
        document.getElementById('yearRangeContainer').style.display = 'none'; 
        document.getElementById('advancedSearchText').style.display = 'block'; 
    });
});

// Elementos del DOM
const advancedSearchText = document.getElementById('advancedSearchText');
const yearRangeContainer = document.getElementById('yearRangeContainer');
const yearRangeStart = document.getElementById('yearRangeStart');
const yearRangeEnd = document.getElementById('yearRangeEnd');
const yearRangeDisplay = document.getElementById('yearRangeDisplay');
const movieSection = document.getElementById('movieSection');

// Mostrar el buscador avanzado al hacer clic en "Advanced search"
advancedSearchText.addEventListener('click', () => {
    advancedSearchText.style.display = 'none';
    yearRangeContainer.style.display = 'block';
});

// Obtener películas y configurar el rango de años
fetchMoviesJson().then(data => {
    const movies = data.films;

    // Rango de años dinámico
    const years = movies.map(movie => parseInt(movie.year));
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);

    yearRangeStart.min = minYear;
    yearRangeStart.max = maxYear;
    yearRangeStart.value = minYear;

    yearRangeEnd.min = minYear;
    yearRangeEnd.max = maxYear;
    yearRangeEnd.value = maxYear;

    yearRangeDisplay.textContent = `${minYear} - ${maxYear}`;
    renderMovies(movies); 

    // Eventos para actualizar el rango dinámico y filtrar por rango de años
    yearRangeStart.addEventListener('input', updateYearRange);
    yearRangeEnd.addEventListener('input', updateYearRange);

    function updateYearRange() {
        if (parseInt(yearRangeStart.value) > parseInt(yearRangeEnd.value)) {
            yearRangeEnd.value = yearRangeStart.value;
        }

        yearRangeDisplay.textContent = `${yearRangeStart.value} - ${yearRangeEnd.value}`;
        filterMoviesByYearRange(yearRangeStart.value, yearRangeEnd.value);
    }
});

// Función para buscar y filtrar películas en el buscador principal
function filterMovies(movies, searchTerm) {
    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.year.toString().includes(searchTerm)
    );

    if (filteredMovies.length === 0) {
        movieSection.innerHTML = `
            <div class="col-12 d-flex justify-content-center align-items-center" style="height: 100px; white-space: nowrap; width: auto;">
                <p class="text-center mb-0" style="margin: 0;">You can only search by movie title, director or year of publication</p>
            </div>
        `;
    } else {
        renderMovies(filteredMovies);
    }
}

// Función para redirigir a la página de detalles de la película
function redirectToMovieDetail(movieId) {
    window.location.href = `movieDetail.html?id=${movieId}`;
}

// Evento para la barra de búsqueda principal
fetchMoviesJson().then(data => {
    const movies = data.films;
    renderMovies(movies); 

    const searchInput = document.querySelector('input[type="search"]');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value;
        filterMovies(movies, searchTerm); 
    });
});
