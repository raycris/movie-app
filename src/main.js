// DATA
const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  params: {
    api_key: API_KEY,
  },
});

const likedMoviesList = () => {
  const item = JSON.parse(localStorage.getItem("liked_movies"));
  let movies;
  if (item) {
    movies = item;
  } else {
    movies = {};
  }
  return movies;
};

function likeMovie(movie) {
  const likedMovies = likedMoviesList();
  if (likedMovies[movie.id]) {
    likedMovies[movie.id] = undefined;
  } else {
    likedMovies[movie.id] = movie;
  }
  localStorage.setItem("liked_movies", JSON.stringify(likedMovies));
}

// LLamados a la API
const getCategoriesPreview = async () => {
  const { data } = await api("genre/movie/list");
  const categories = data.genres;
  createCategories(categories, categoriesPreviewList);
};

const getTrendingMoviesPreview = async () => {
  const { data } = await api("trending/movie/day");

  const movies = data.results;
  createMovies(movies, trendingMoviesPreviewList, true);
};

const getMoviesByCategory = async (genreId) => {
  const { data } = await api(`discover/movie`, {
    params: {
      with_genres: genreId,
    },
  });

  const movies = data.results;
  maxPage = data.total_pages;
  createMovies(movies, genericSection, { lazyLoad: true });
};

const getPaginatedMoviesByCategory = (genreId) => {
  return async function () {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 15;
    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
      page++;
      const { data } = await api(`discover/movie`, {
        params: {
          with_genres: genreId,
          page,
        },
      });

      const movies = data.results;
      createMovies(movies, genericSection, { lazyLoad: true, clean: false });
    }
  };
};

const getMoviesBySearch = async (query) => {
  const { data } = await api(`search/movie`, {
    params: {
      query,
    },
  });

  const movies = data.results;
  maxPage = data.total_pages;
  createMovies(movies, genericSection);
};

const getPaginatedMoviesBySearch = (query) => {
  return async function () {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 15;
    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
      page++;
      const { data } = await api(`search/movie`, {
        params: {
          query,
          page,
        },
      });

      const movies = data.results;
      createMovies(movies, genericSection, { lazyLoad: true, clean: false });
    }
  };
};

const getTrendingMovies = async () => {
  const { data } = await api("trending/movie/day");
  const movies = data.results;
  maxPage = data.total_pages;

  createMovies(movies, genericSection, { lazyLoad: true, clean: true });
};

const getPaginatedTrendingMovies = async () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 15;
  const pageIsNotMax = page < maxPage;

  if (scrollIsBottom && pageIsNotMax) {
    page++;
    const { data } = await api("trending/movie/day", {
      params: {
        page,
      },
    });
    const movies = data.results;

    createMovies(movies, genericSection, { lazyLoad: true, clean: false });
  }
};

const getMovieById = async (id) => {
  const { data: movie } = await api(`movie/${id}`);

  const movieImgUrl = `${BASE_IMG_URL500}${movie.poster_path}`;

  headerSection.style.background = `
  linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.35) 19.27%,
    rgba(0, 0, 0, 0) 29.17%
  ),
  url(${movieImgUrl})`;

  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average;

  createCategories(movie.genres, movieDetailCategoriesList);
  getSimilarMoviesById(id);
};

const getSimilarMoviesById = async (id) => {
  const { data } = await api(`movie/${id}/similar`);
  const relatedMovies = data.results;

  createMovies(relatedMovies, relatedMoviesContainer);
};

const getLikedMovies = () => {
  const likedMovies = likedMoviesList();
  const moviesArrays = Object.values(likedMovies);

  createMovies(moviesArrays, likedMoviesListArticle, {
    lazyLoad: true,
    clean: true,
  });
};

// UTILS

const lazyLoader = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const url = entry.target.getAttribute("data-img");
      entry.target.setAttribute("src", url);
    }
  });
});

const createMovies = (
  movies,
  container,
  { lazyLoad = false, clean = true } = {}
) => {
  if (clean) {
    container.innerHTML = "";
  }

  movies.map((movie) => {
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");
    movieContainer.addEventListener("click", () => {
      location.hash = `#movie=${movie.id}`;
    });

    const movieImg = document.createElement("img");
    movieImg.classList.add("movie-img");
    movieImg.setAttribute("alt", movie.title);
    movieImg.setAttribute(
      lazyLoad ? "data-img" : "src",
      `${BASE_IMG_URL300}${movie.poster_path}`
    );
    movieImg.addEventListener("error", () => {
      movieImg.setAttribute(
        "src",
        "https://i.pinimg.com/originals/40/69/40/406940cf5a94900e473080549db11d43.jpg"
      );
    });

    const movieFvoriteBtn = document.createElement("button");
    movieFvoriteBtn.classList.add("movie-btn");
    likedMoviesList()[movie.id] &&
      movieFvoriteBtn.classList.add("movie-btn--liked");
    movieFvoriteBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      movieFvoriteBtn.classList.toggle("movie-btn--liked");
      // PAra lcoal storage
      likeMovie(movie);
      getLikedMovies()
    });

    if (lazyLoad) {
      lazyLoader.observe(movieImg);
    }
    movieContainer.appendChild(movieImg);
    movieContainer.appendChild(movieFvoriteBtn);
    container.appendChild(movieContainer);
  });
};

const createCategories = (categories, container) => {
  container.innerHTML = "";
  categories.map((category) => {
    const categoryContainer = document.createElement("div");
    categoryContainer.classList.add("category-container");

    const categoryTitle = document.createElement("h3");
    categoryTitle.classList.add("category-title");
    categoryTitle.addEventListener("click", () => {
      location.hash = `#category=${category.id} - ${category.name}`;
    });
    categoryTitle.setAttribute("id", category.id);

    const categoryTitleText = document.createTextNode(category.name);

    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    container.appendChild(categoryContainer);
  });
};

// function solution(n) {
//   let array = [];
//   let va = n.toString();
//   let sum = 0;

//   for (let item of va) {
//     if (typeof item === "string") {
//       let change = Number(item);
//       console.log(va.length);
//       array.push(change);
//       if (sum !== 9) {
//          (sum = sum + change);

//         console.log(sum);
//       }
//       // console.log(array)
//     }
//   }
// }

// solution(45);
