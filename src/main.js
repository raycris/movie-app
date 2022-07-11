const API_URL = `https://api.themoviedb.org/3/trending/movie/day?api_key=`;

const getTrendingMoviesPreview = async () => {
  const res = await fetch(`${API_URL}${API_KEY}`);
  const data = await res.json();

  const movies = data.results;
  console.log(data, movies);

  movies.map((movie) => {
    const trendingPreviewMoviesContainer = document.querySelector(
      "#trendingPreview .trendingPreview-movieList"
    );

    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");

    const movieImg = document.createElement("img");
    movieImg.classList.add("movie-img");
    movieImg.setAttribute("alt", movie.title);
    movieImg.setAttribute("src", `${BASE_IMG_URL}${movie.poster_path}`);

    movieContainer.appendChild(movieImg);
    trendingPreviewMoviesContainer.appendChild(movieContainer)
  });
};

getTrendingMoviesPreview();
