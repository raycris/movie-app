// const API_URL = `https://api.themoviedb.org/3/trending/movie/day?api_key=`;
// const API_URL_CATEGORIES = `https://api.themoviedb.org/3/genre/movie/list?api_key=`;

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  params: {
    api_key: API_KEY,
  },
});

const getTrendingMoviesPreview = async () => {
  const { data } = await api("trending/movie/day");
  const movies = data.results;

  trendingMoviesPreviewList.innerHTML = "";

  movies.map((movie) => {
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");

    const movieImg = document.createElement("img");
    movieImg.classList.add("movie-img");
    movieImg.setAttribute("alt", movie.title);
    movieImg.setAttribute("src", `${BASE_IMG_URL}${movie.poster_path}`);

    movieContainer.appendChild(movieImg);
    trendingMoviesPreviewList.appendChild(movieContainer);
  });
};

const getCategoriesPreview = async () => {
  const { data } = await api("genre/movie/list");
  const categories = data.genres;

  categoriesPreviewList.innerHTML = "";
  categories.map((category) => {
    const categoryContainer = document.createElement("div");
    categoryContainer.classList.add("category-container");

    const categoryTitle = document.createElement("h3");
    categoryTitle.classList.add("category-title");
    categoryTitle.setAttribute("id", category.id);

    const categoryTitleText = document.createTextNode(category.name);

    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    categoriesPreviewList.appendChild(categoryContainer);
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
