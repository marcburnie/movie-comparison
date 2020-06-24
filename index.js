/** @format */

//object to pass into autocomplete function
const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
        <img src="${imgSrc}" />
        ${movie.Title} (${movie.Year})
    `;
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(s) {
    const params = {
      apikey: "674df8af",
      s,
    };
    //fetch data from api using params
    const res = await axios.get("http://www.omdbapi.com/", { params });
    if (res.data.Error) return [];

    return res.data.Search;
  },
};

let leftMovie;
let rightMovie;

const onMovieSelect = async function (i, summaryElement, side) {
  const params = {
    apikey: "674df8af",
    i,
  };
  //fetch data from api using params
  const res = await axios.get("http://www.omdbapi.com/", { params });
  //populate the HTML element passed in as an argument using the movie template function
  summaryElement.innerHTML = movieTemplate(res.data);
  //update the appropriate movie side
  side === "left" ? (leftMovie = res.data) : (rightMovie = res.data);
  //if there is a left and right movie value then run the comparison function on select
  leftMovie && rightMovie && runComparison();
};

//compare each movie stats
const runComparison = function () {
  //find article elements for each movie
  const leftSideStats = document.querySelectorAll(
    "#left-summary .notification"
  );
  const rightSideStats = document.querySelectorAll(
    "#right-summary .notification"
  );
  //iterate over each value and compare values
  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    const leftSideValue = parseFloat(leftStat.dataset.value);
    const rightSideValue = parseFloat(rightStat.dataset.value);

    //apply styling to element based on comparison
    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove("is-primary");
      leftStat.classList.add("is-warning");
      rightStat.classList.remove("is-warning");
      rightStat.classList.add("is-primary");
    } else {
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-warning");
      leftStat.classList.remove("is-warning");
      leftStat.classList.add("is-primary");
    }
  });
};

//add left autocomplete
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#left-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(
      movie.imdbID,
      document.querySelector("#left-summary"),
      "left"
    );
  },
});

//add right autocomplete
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#right-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(
      movie.imdbID,
      document.querySelector("#right-summary"),
      "right"
    );
  },
});

const movieTemplate = (movieDetails) => {
  //parse awards string to add up all awards and nominations
  const awards = parseInt(
    //split the string into words and iterate over each word
    //if the word is a number add to the total using reduce
    movieDetails.Awards.split(" ").reduce(
      (acc, curr) => (isNaN(parseInt(curr)) ? acc : acc + parseInt(curr)),
      0
    )
  );
  //parse box office value by removing all punctuation
  const dollars = parseInt(
    movieDetails.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  );
  const metascore = parseInt(movieDetails.Metascore);
  const imdbRating = parseFloat(movieDetails.imdbRating);
  const votes = parseInt(movieDetails.imdbVotes.replace(/,/g, ""));

  //return HTML format with added data values
  return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetails.Poster}" />
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetails.Title}</h1>
                    <h4>${movieDetails.Genre}</h4>
                    <p>${movieDetails.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetails.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetails.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetails.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetails.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${votes} class="notification is-primary">
            <p class="title">${movieDetails.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
};
