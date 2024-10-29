const requestURL = '../json/films.json'

// Función asíncrona

async function fetchMoviesJson() {
    const response = await fetch(requestURL);
    const movies = await response.json();
    return movies;
}

fetchMoviesJson().then(movies => {
    for (let i = 0; i < movies.films.length; i++){
        const moviesSection = document.getElementById('movieSection');

        let id = movies.films[index].id;
        let poster = movies.films[index].poster;
        let tittle = movies.films[index].title;
        let year = movies.films[index].year;
        let length = movies.films[index].length;
        let director = movies.films[index].director;
        let synopsis = movies.films[index].synopsis;

        moviesSection.innerHTML += `
        <div class="card" style="width: 18rem;">
         <img src="${poster}" class="card-img-top" alt="...">
         <div class="card-body">
         <h5 class="card-title">${title}</h5>
         <p class="card.title"><span
         class="h6">${year}</span> . ${length}
         </p>
         <h6 class="card-title mb-4">${director}</h6>
         <p class="card-text">${synopsis}
         </p>
         </div>
        </div>
        `
    }
})