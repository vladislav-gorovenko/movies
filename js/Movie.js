class Movie {
  constructor(data) {
    Object.assign(this, data);
    this.favorite = data.favorite ? true : false;
  }
  generateHTML(index) {
    const { Title, imdbRating, Runtime, Genre, Plot, Poster, favorite } = this;
    return `
    <div class="movies__movie" index="${index}">
      <img class="movies__movie-img" src="${Poster}" alt="" />
      <div class="movies__movie-description">
        <div class="movies__movie-description--top">
          <h2 class="movies__movie-title">${Title}</h2>
          <img class="movies__movie-star" src="./img/Star.png" alt="" />
          <p class="movies__movie-score">${imdbRating}</p>
        </div>
        <div class="movies__movie-description--middle">
          <p class="movies__movie-length">${Runtime}</p>
          <p class="movies__movie-genre">${Genre}</p>
          <p class="movies__movie-watchlist">
            ${
              favorite
                ? '<i class="fa-solid fa-circle-minus"></i>Remove'
                : '<i class="fa-solid fa-circle-plus"></i>Watchlist'
            }
          </p>
        </div>
        <div class="movies__movie-description--bottom">
          <p class="movies__movie-description--text">
            ${Plot}
          </p>
        </div>
      </div>
    </div>
    `;
  }
  makeFavorite() {
    this.favorite = true;
  }
  dislike() {
    this.favorite = false;
  }
}

export { Movie };
