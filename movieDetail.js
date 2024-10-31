// movieDetail.js

// Obtener el ID de la película desde la URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');
console.log("Film ID:", movieId); 

const requestURL = './json/films.json';

async function fetchMovieData() {
    const response = await fetch(requestURL);
    const data = await response.json();
    console.log("Film Data:", data.films); 
    return data.films.find(movie => movie.id === movieId); 
}

// Renderizar la información de la película en la página
fetchMovieData().then(movie => {
    if (movie) {
        document.getElementById('movieTitle').textContent = movie.title;
        document.getElementById('moviePoster').src = movie.poster;
        document.getElementById('movieDirector').textContent = `Director: ${movie.director}`;
        document.getElementById('movieYear').textContent = `Year: ${movie.year}`;
        document.getElementById('movieLength').textContent = `Duration: ${movie.length}`;
        document.getElementById('movieSynopsis').textContent = movie.synopsis;
    } else {
        document.getElementById('movieDetails').textContent = 'Film not found.';
    }
});
