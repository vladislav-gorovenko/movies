import { generateURL, getImdbIDs } from "./functions.js";
import { Movie } from "./Movie.js";
let error = false;
// for night mode
let day;

// variables
let movies = [];

// query selectors
const movieSearchInputEl = document.querySelector(".movie-search__input");
const movieSearchBtnEl = document.querySelector(".movie-search__btn");
const moviesEl = document.querySelector(".movies--all");
const switchEl = document.querySelector(".switch");

// event listeners
renderMovies();
checkLight();

movieSearchBtnEl.addEventListener("click", () => {
  error = false;
  if (movieSearchInputEl.value.trim("") != "") {
    let searchQuery = generateURL(movieSearchInputEl.value, "s");
    movieSearchInputEl.value = "";
    getSearchData(searchQuery);
  }
});

// for night mode
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

async function getSearchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const ids = getImdbIDs(data);
    let idsURLs = generateIdsUrls(ids);
    movies = await getMovies(idsURLs);
  } catch (err) {
    error = true;
  }
  renderMovies();
}

async function getMovies(urls) {
  let movies = [];
  for await (const url of urls) {
    const response = await fetch(url);
    const data = await response.json();
    const movie = new Movie(data);
    if (checkIfAlreadyFavorite(movie)) {
      movie.makeFavorite();
    }
    movies.push(movie);
  }
  return movies;
}

function generateIdsUrls(ids) {
  return ids.map((id) => generateURL(id, "i"));
}

function renderMovies() {
  resetMovies();
  if (movies.length > 0) {
    moviesEl.innerHTML = movies
      .map((movie, index) => {
        return movie.generateHTML(index);
      })
      .join("");
  } else if (!error) {
    moviesEl.innerHTML = `
      <div class="movies__notice">
      <i class="fa-solid fa-film"></i>
      <h2 class="movies__empty-notice">
        Start exploring.
      </h2>
      </div>
      `;
  } else if (error) {
    moviesEl.innerHTML = `
    <div class="movies__notice">
    <h2 class="movies__empty-notice">
      Unable to find what you’re looking for. Please try another search.
    </h2>
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

function checkIfAlreadyFavorite(movie) {
  const found = getFavoritesFromLocalStorage()
    .map((m) => m.imdbID)
    .find((id) => id === movie.imdbID);
  if (found) {
    return true;
  }
  return false;
}

function resetMovies() {
  moviesEl.innerHTML = "";
}

function toggleFavorite(watchlist) {
  const movie = movies[returnIndexOfMovie(watchlist)];
  if (movie.favorite) {
    movie.dislike();
    removeFromLocalStorage(movie);
  } else {
    movie.makeFavorite();
  }
  saveFavoritesToLocalStorage();
  renderMovies();
}

// remove from local storage
function removeFromLocalStorage(movie) {
  let favorites = getFavoritesFromLocalStorage();
  const i = favorites
    .map((m) => m.imdbID)
    .findIndex((id) => id === movie.imdbID);
  favorites = favorites.filter((item, index) => index != i);
  sessionStorage.setItem("favorites", JSON.stringify(favorites));
}

// it's implemented differently from watchlist.js
function saveFavoritesToLocalStorage() {
  const oldFavorites = getFavoritesFromLocalStorage();
  const newFavorites = movies.filter((movie) => movie.favorite);
  const favoritesString = JSON.stringify(
    mergeFavorites(oldFavorites, newFavorites)
  );
  sessionStorage.setItem("favorites", favoritesString);
}

function mergeFavorites(oldF, newF) {
  const favorites = [...oldF, ...newF];
  const imdbIDs = favorites.map((favorite) => favorite.imdbID);
  const filteredFavorites = favorites.filter((item, index) => {
    return imdbIDs.indexOf(item.imdbID) === index;
  });
  return filteredFavorites;
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
