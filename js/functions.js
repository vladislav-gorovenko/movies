function generateURL(input, type) {
  // if id - type = i / if title - type = s
  const baseURL = "http://www.omdbapi.com/";
  const searchParameter = `?${type}=${input
    .split(" ")
    .filter((item) => item.trim() != "")
    .map((item) => item.toLowerCase())
    .join("+")}`;
  const apiKey = "&apikey=b8a4ceaa";
  return `${baseURL}${searchParameter}${apiKey}`;
}

function getImdbIDs(data) {
  let newIds;
  const ids = data.Search.map((movie) => movie.imdbID);
  //   make sure there is no more than 5 movies in the reply
  ids.length >= 5 ? (newIds = ids.slice(0, 5)) : (newIds = ids);
  return newIds;
}

export { generateURL, getImdbIDs };
