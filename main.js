const requestURL = './json/films.json';
const moviesPerPage = 8;
let currentPage = 1;
let allMovies = [];
let displayedMovies = [];

// Variables para el rango de años
let minYear = Number.MAX_SAFE_INTEGER;
let maxYear = 0;

// Elementos del DOM
const advancedSearchText = document.getElementById('advancedSearchText');
const yearRangeContainer = document.getElementById('yearRangeContainer');
const yearRangeStart = document.getElementById('yearRangeStart');
const yearRangeEnd = document.getElementById('yearRangeEnd');
const yearRangeDisplay = document.getElementById('yearRangeDisplay');
const movieSection = document.getElementById('movieSection');
const returnButtonContainer = document.getElementById('returnButtonContainer'); // Contenedor del botón "Return" de búsqueda principal
const paginationContainer = document.getElementById('paginationContainer'); // Contenedor de la paginación

// Elementos de la barra de búsqueda principal
const searchInput = document.getElementById('searchInput');
const searchReturnButton = document.getElementById('searchReturnButton'); // Botón de "Return" específico de la búsqueda principal

// Función para obtener películas del JSON
async function fetchMoviesJson() {
    const response = await fetch(requestURL);
    const movies = await response.json();
    return movies.films;
}

// Mostrar el buscador avanzado al hacer clic en "Advanced search"
advancedSearchText.addEventListener('click', () => {
    advancedSearchText.style.display = 'none';
    yearRangeContainer.style.display = 'block';
});

// Configurar rango de años y cargar películas iniciales
fetchMoviesJson().then(movies => {
    allMovies = movies;
    displayedMovies = shuffleMovies([...allMovies]);

    const years = movies.map(movie => parseInt(movie.year));
    minYear = Math.min(...years);
    maxYear = Math.max(...years);

    // Configurar los límites del rango de años
    yearRangeStart.min = minYear;
    yearRangeStart.max = maxYear;
    yearRangeStart.value = minYear;

    yearRangeEnd.min = minYear;
    yearRangeEnd.max = maxYear;
    yearRangeEnd.value = maxYear;

    yearRangeDisplay.textContent = `${minYear} - ${maxYear}`;
    renderMovies(currentPage); // Renderizar todas las películas inicialmente

    // Eventos para actualizar el rango dinámico y filtrar por rango de años
    yearRangeStart.addEventListener('input', updateYearRange);
    yearRangeEnd.addEventListener('input', updateYearRange);
});

// Función para actualizar el rango de años
function updateYearRange() {
    if (parseInt(yearRangeStart.value) > parseInt(yearRangeEnd.value)) {
        yearRangeEnd.value = yearRangeStart.value;
    }

    yearRangeDisplay.textContent = `${yearRangeStart.value} - ${yearRangeEnd.value}`;
    filterMoviesByYearRange(yearRangeStart.value, yearRangeEnd.value);
}

// Filtrar películas por rango de años (Advanced Search)
function filterMoviesByYearRange(startYear, endYear) {
    const filteredMovies = allMovies.filter(movie =>
        parseInt(movie.year) >= startYear && parseInt(movie.year) <= endYear
    );

    if (filteredMovies.length === 0) {
        // Mostrar mensaje de "No hay resultados" y el botón "Return" debajo
        movieSection.innerHTML = `
            <div class="col-12 d-flex flex-column align-items-center" style="height: 100px; white-space: nowrap;">
                <p class="text-center mb-2">Your search did not return any results</p>
                <button id="advancedReturnButton" class="btn btn-primary mt-3">Return</button>
            </div>
        `;
        paginationContainer.style.display = 'none'; // Ocultar la paginación
        returnButtonContainer.style.display = 'none'; // Ocultar el botón "Return" de la barra de búsqueda principal

        // Evento para el botón "Return" de búsqueda avanzada
        document.getElementById('advancedReturnButton').addEventListener('click', () => {
            resetMoviesAndAdvancedSearch();
        });
    } else {
        displayedMovies = filteredMovies;
        renderMovies(1);
    }
}

// Función para restaurar todas las películas y ocultar el buscador avanzado
function resetMoviesAndAdvancedSearch() {
    displayedMovies = shuffleMovies([...allMovies]);
    renderMovies(1);
    window.history.pushState({}, '', '?page=1'); // Restablecer a la primera página en la URL
    advancedSearchText.style.display = 'block';
    yearRangeContainer.style.display = 'none';
}

// Renderizar películas en la página
function renderMovies(page = 1) {
    movieSection.innerHTML = ''; // Limpiar el contenedor de películas
    returnButtonContainer.style.display = 'none';
    paginationContainer.style.display = 'block';

    const startIndex = (page - 1) * moviesPerPage;
    const endIndex = Math.min(startIndex + moviesPerPage, displayedMovies.length);
    const paginatedMovies = displayedMovies.slice(startIndex, endIndex);

    if (paginatedMovies.length === 0) {
        movieSection.innerHTML = `
            <div class="col-12 d-flex justify-content-center align-items-center" style="height: 100px;">
                <p class="text-center mb-0">You can only search by movie title, director or year of publication</p>
            </div>
        `;
        paginationContainer.style.display = 'none';
        return;
    }

    paginatedMovies.forEach(movie => {
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

    renderPagination(displayedMovies.length, page);
}

// Filtrar películas usando la barra de búsqueda principal
function filterMoviesBySearchTerm(searchTerm) {
    const filteredMovies = allMovies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.year.toString().includes(searchTerm)
    );

    if (filteredMovies.length === 0) {
        movieSection.innerHTML = `
            <div class="col-12 d-flex justify-content-center align-items-center" style="height: 100px;">
                <p class="text-center mb-0">No results found. You can only search by title, director, or publication year.</p>
            </div>
        `;
        paginationContainer.style.display = 'none';
        searchReturnButton.style.display = 'block'; // Mostrar el botón "Return" de búsqueda principal
    } else {
        displayedMovies = filteredMovies;
        renderMovies(1);
        searchReturnButton.style.display = 'block';
    }
}

// Evento de la barra de búsqueda principal
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        filterMoviesBySearchTerm(searchTerm);
    } else {
        displayedMovies = shuffleMovies([...allMovies]);
        renderMovies(1);
        searchReturnButton.style.display = 'none'; // Ocultar el botón "Return" cuando no hay término de búsqueda
    }
});

// Evento para restaurar todas las películas al hacer clic en el botón "Return" de búsqueda principal
searchReturnButton.addEventListener('click', () => {
    searchInput.value = '';
    displayedMovies = shuffleMovies([...allMovies]);
    renderMovies(1);
    searchReturnButton.style.display = 'none';
});

// Función para mezclar las películas aleatoriamente
function shuffleMovies(movies) {
    for (let i = movies.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [movies[i], movies[j]] = [movies[j], movies[i]];
    }
    return movies;
}

// Renderizar la paginación
function renderPagination(totalMoviesCount, currentPage) {
    const paginationContainer = document.getElementById('paginationContainer').querySelector('.pagination');
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(totalMoviesCount / moviesPerPage);

    for (let page = 1; page <= totalPages; page++) {
        const li = document.createElement('li');
        li.className = `page-item ${page === currentPage ? 'active' : ''}`;
        
        const a = document.createElement('a');
        a.className = 'page-link';
        a.textContent = page;
        a.href = `?page=${page}`;
        a.onclick = (e) => {
            e.preventDefault();
            renderMovies(page);
            window.history.pushState({}, '', a.href);
            window.scrollTo(0, 0);
        };

        li.appendChild(a);
        paginationContainer.appendChild(li);
    }
}

// Redirigir al detalle de la película
function redirectToMovieDetail(movieId) {
    window.location.href = `movieDetail.html?id=${movieId}`;
}

// Inicializar películas y configuración de filtro
fetchMoviesJson().then(movies => {
    allMovies = movies;
    displayedMovies = shuffleMovies([...allMovies]);
    renderMovies(getCurrentPageFromURL());
});
