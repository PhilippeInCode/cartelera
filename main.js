const requestURL = './json/films.json';
const moviesPerPage = 8; 
let currentPage = 1; 
let allMovies = []; 
let displayedMovies = []; 

// Función asíncrona para obtener las películas
async function fetchMoviesJson() {
    const response = await fetch(requestURL);
    const movies = await response.json();
    return movies.films;
}

// Función para obtener la página actual de la URL
function getCurrentPageFromURL() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('page')) || 1; 
}

// Función para mezclar las películas aleatoriamente
function shuffleMovies(movies) {
    for (let i = movies.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [movies[i], movies[j]] = [movies[j], movies[i]];
    }
    return movies;
}

// Función para renderizar películas
function renderMovies(page = 1) {
    const movieSection = document.getElementById('movieSection');
    const returnButtonContainer = document.getElementById('returnButtonContainer'); 
    movieSection.innerHTML = ''; 
    returnButtonContainer.style.display = 'none'; 

    // Calcular el índice de inicio y fin
    const startIndex = (page - 1) * moviesPerPage;
    const endIndex = Math.min(startIndex + moviesPerPage, displayedMovies.length);
    const paginatedMovies = displayedMovies.slice(startIndex, endIndex);

    // Mensaje si no hay películas que mostrar
    if (paginatedMovies.length === 0) {
        movieSection.innerHTML = `
            <div class="col-12 d-flex justify-content-center align-items-center" style="height: 100px; white-space: nowrap; width: auto;">
                <p class="text-center mb-0" style="margin: 0;">You can only search by movie title, director or year of publication</p>
            </div>
        `;
        return;
    }

    // Renderizar cada película en la sección
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

    // Llamar a la función para renderizar la paginación
    renderPagination(displayedMovies.length, page);
}

// Función para renderizar los botones de paginación
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
            currentPage = page; 
            renderMovies(currentPage); 
            window.history.pushState({}, '', a.href); 
            window.scrollTo(0, 0); 
        };

        li.appendChild(a);
        paginationContainer.appendChild(li);
    }
}

// Evento para la barra de búsqueda principal
fetchMoviesJson().then(movies => {
    allMovies = movies; 
    displayedMovies = shuffleMovies([...allMovies]); 
    currentPage = getCurrentPageFromURL(); 
    renderMovies(currentPage);

    const searchInput = document.querySelector('input[type="search"]');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value;
        const filteredMovies = filterMovies(displayedMovies, searchTerm);
        renderMovies(currentPage); 
    });
});

// Función para filtrar películas
function filterMovies(movies, searchTerm) {
    return movies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.year.toString().includes(searchTerm)
    );
}

// Mostrar/Ocultar el botón de desplazamiento hacia arriba
window.onscroll = function() {
    const scrollToTopButton = document.getElementById('scrollToTop');
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        scrollToTopButton.style.display = "block"; 
    } else {
        scrollToTopButton.style.display = "none"; 
    }
};

// Función para desplazar hacia arriba
document.getElementById('scrollToTop').onclick = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
};
