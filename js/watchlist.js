import { Movie } from "./Movie.js";

// for night mode
let day;

// variables
let movies = [];

// query selectors
const moviesEl = document.querySelector(".movies--favorite");
const switchEl = document.querySelector(".switch");

// event listeners
movies = getFavoritesFromLocalStorage();
renderMovies();
checkLight();

switchEl.addEventListener("click", changeLightMode);
// functions

function checkLight() {
  if (sessionStorage.getItem("day")) {
    day = JSON.parse(sessionStorage.getItem("day")).state;
  } else {
    day = true;
  }
  if (!day) {
    document.body.classList.add("night");
  }
  changeLightMode();
}

function changeLightMode() {
  if (!document.body.classList.contains("night")) {
    switchEl.innerHTML = `<i class="fa-solid fa-moon"></i>`;
    document.body.classList.add("night");
    day = true;
  } else {
    switchEl.innerHTML = `<i class="fa-solid fa-sun"></i>`;
    document.body.classList.remove("night");
    day = false;
  }
  sessionStorage.setItem("day", JSON.stringify({ state: day }));
}

function renderMovies() {
  resetMovies();
  if (movies.length > 0) {
    moviesEl.innerHTML = movies
      .map((movie, index) => movie.generateHTML(index))
      .join("");
  } else {
    moviesEl.innerHTML = `
    <div class="movies__notice">
    <h2 class="movies__empty-notice">
      Your watchlist is looking a little empty...
    </h2>
    <a href="./index.html" class="movies__lets-add">
      <i class="fa-solid fa-circle-plus"></i>Let's add some movies!
    </a>
    </div>
    `;
  }
  // refresh event listeners
  document
    .querySelectorAll(".movies__movie-watchlist")
    .forEach((watchListEl) => {
      watchListEl.addEventListener("click", () => {
        toggleFavorite(watchListEl);
      });
    });
}

function resetMovies() {
  moviesEl.innerHTML = "";
}

function toggleFavorite(watchlist) {
  const movie = movies[returnIndexOfMovie(watchlist)];
  if (movie.favorite) {
    movie.dislike();
  } else {
    movie.makeFavorite();
  }
  remainFavoritesOnly();
  saveFavoritesToLocalStorage();
  renderMovies();
}

function remainFavoritesOnly() {
  movies = movies.filter((movie) => movie.favorite);
}

function saveFavoritesToLocalStorage() {
  const favoritesString = JSON.stringify(
    movies.filter((movie) => movie.favorite)
  );
  sessionStorage.setItem("favorites", favoritesString);
}

function getFavoritesFromLocalStorage() {
  if (sessionStorage.getItem("favorites")) {
    const moviesJSON = JSON.parse(sessionStorage.getItem("favorites"));
    return moviesJSON.map((movieData) => new Movie(movieData));
  } else {
    return [];
  }
}

function returnIndexOfMovie(watchlist) {
  return Number(watchlist.closest(".movies__movie").getAttribute("index"));
}
