const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '5ceb4e27dfmshb06d87772731d49p1a60eejsn56e1e79c7c6f',
        'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
    }
};

function showHomePageSection() {
    homePageSection.classList.remove('hide');
    genreAndSearchSection.classList.add('hide');
    activateNavButton('');
    pageByGenre = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    titleGenres.forEach((title, index) => {
        getMoviesHomePage(pageByGenre[index], title, namesHomeSection[index], yearsHomeSection[index], postersHomeSection[index]);
        document.getElementById(previousMoviesButtonIds[index]).classList.add('inactive');
    })
    document.getElementById("main").scrollIntoView()
}
document.querySelector('.home-button').addEventListener("click", showHomePageSection);

function showGenreAndSearchSection() {
    homePageSection.classList.add('hide');
    genreAndSearchSection.classList.remove('hide');
}

function scrollTop() {
    document.querySelector('.top-header').scrollIntoView();
}

document.querySelector('.main-header p').addEventListener('click', scrollTop);
document.querySelector('.main-header h2').addEventListener('click', scrollTop);

const target = document.querySelectorAll("[data-anime]");
const animationClass = "animate";

function animeScroll() {
    const windowTop = window.scrollY + ((window.innerHeight * 3) / 4);
    target.forEach(function (element) {
        if (windowTop > element.offsetTop) {
            element.classList.add(animationClass);
        } else {
            element.classList.remove(animationClass);
        }
    });
}

window.addEventListener("scroll", function () {
    animeScroll();
});

function activateNavButton(activeButton) {
    genresNavButtons.forEach((button) => {
        button.classList.remove('active');
    })
    if (activeButton === '') {
        return;
    } else {
        activeButton.classList.add('active');
    }
}

function animateTitleAndPageNumber(title) {
    genreAndSearchSectionTitle.innerHTML = title;
    genreAndSearchSectionTitle.classList.add('animate');
    pageNumberContainer.forEach((container) => {
        container.classList.add('animate');
    });
}

function removeAnimationTitleAndPageNumber() {
    genreAndSearchSectionTitle.classList.remove('animate');
    pageNumberContainer.forEach((container) => {
        container.classList.remove('animate');
    });
}

function animateMovies(section, postersHomeSection) {
    if (section === genreAndSearchSection) {
        postersGenreSearch.forEach((poster) => {
            poster.classList.add('animate');
        });
    }
    if (section === homePageSection) {
        document.querySelectorAll(`.${postersHomeSection}`).forEach((poster) => {
            poster.classList.add('animate');
        });
    }
}

function removeAnimationMovies(section, postersHomeSection) {
    if (section === genreAndSearchSection) {
        postersGenreSearch.forEach((poster) => {
            poster.classList.remove('animate');
        });
    }
    if (section === homePageSection) {
        document.querySelectorAll(`.${postersHomeSection}`).forEach((poster) => {
            poster.classList.remove('animate');
        });
    }
}

const homePageSection = document.querySelector('.home-page-section');
const genreAndSearchSection = document.querySelector('.genre-and-search-section');
const pageNumberContainer = document.querySelectorAll('.go-to-page-container');

const genresNavButtons = [
    document.getElementById('top-rated-movies'),
    document.getElementById('action'),
    document.getElementById('animation'),
    document.getElementById('comedy'),
    document.getElementById('documentary'),
    document.getElementById('drama'),
    document.getElementById('mystery'),
    document.getElementById('romance')];

const homePageSectionTitles = [
    document.getElementById('top-rated-movies-title'),
    document.getElementById('action-title'),
    document.getElementById('animation-title'),
    document.getElementById('comedy-title'),
    document.getElementById('documentary-title'),
    document.getElementById('drama-title'),
    document.getElementById('mystery-title'),
    document.getElementById('romance-title')];

const titleGenres = ['Top rated movies', 'Action', 'Animation', 'Comedy', 'Documentary', 'Drama', 'Mystery', 'Romance'];

const namesHomeSection = ['name-top-rated-movie', 'name-action', 'name-animation', 'name-comedy', 'name-documentary', 'name-drama', 'name-mystery', 'name-romance']
const yearsHomeSection = ['year-top-rated-movie', 'year-action', 'year-animation', 'year-comedy', 'year-documentary', 'year-drama', 'year-mystery', 'year-romance']
const postersHomeSection = ['poster-top-rated-movie', 'poster-action', 'poster-animation', 'poster-comedy', 'poster-documentary', 'poster-drama', 'poster-mystery', 'poster-romance']

var fetchedMoviesHomeSection = [];
let nextMovies;

function FetchedMovie(name, year, poster) {
    this.name = name;
    this.year = year;
    this.poster = poster
}

async function getMoviesHomePage(page, genre, nameMovie, yearMovie, posterMovie) {
    removeAnimationMovies(homePageSection, posterMovie);
    if (genre === 'Top rated movies') {
        var url = `https://moviesdatabase.p.rapidapi.com/titles?list=top_rated_250&limit=${titleInfoSlots}&info=base_info&page=${page}`;
    } else {
        var url = `https://moviesdatabase.p.rapidapi.com/titles?titleType=movie&genre=${genre}&sort=year.decr&limit=${titleInfoSlots}&endYear=2023&info=base_info&page=${page}`;
    }
    const response = await fetch(url, options);
    let movies = await response.json();
    checkForPageEntries(movies.entries);
    nextMovies = movies.next;
    movies.results.forEach((movie) => {
        if (movie.titleText.text) {
            var name = movie.titleText.text;
        } else {
            var name = "";
        }
        if (movie.releaseYear && movie.releaseYear.year) {
            var year = movie.releaseYear.year;
        } else {
            var year = "";
        }
        if (movie.primaryImage) {
            var poster = movie.primaryImage.url;
        } else {
            var poster = 'src/images/poster-unavailable.png';
        }
        fetchedMoviesHomeSection.push(new FetchedMovie(name, year, poster));
    })
    fillMoviesInfosHomePage(nameMovie, yearMovie, posterMovie, movies.entries)
        .then(animateMovies(homePageSection, posterMovie))
        .then(checkForNextPage(movies.next));
    fetchedMoviesHomeSection = [];
}

async function fillMoviesInfosHomePage(stringName, stringYear, stringPoster, numberOfMovies) {
    adjustNumberOfSlots(numberOfMovies, titleInfoSlots, stringName, stringYear, stringPoster);
    fetchedMoviesHomeSection.forEach((movie, index) => {
        if (movie.name.length > 47) {
            document.getElementsByClassName(stringName)[index].innerHTML = `${movie.name.slice(0, 45)}...`;
        } else {
            document.getElementsByClassName(stringName)[index].innerHTML = movie.name;
        }
        document.getElementsByClassName(stringYear)[index].innerHTML = movie.year;
        document.getElementsByClassName(stringPoster)[index].style.backgroundImage = `url(${movie.poster})`;
    })
}

const nextMoviesButtonIds = ['next-top-rated-movie', 'next-action', 'next-animation', 'next-comedy', 'next-documentary', 'next-drama', 'next-mystery', 'next-romance']
const previousMoviesButtonIds = ['previous-top-rated-movie', 'previous-action', 'previous-animation', 'previous-comedy', 'previous-documentary', 'previous-drama', 'previous-mystery', 'previous-romance']
let pageByGenre = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

nextMoviesButtonIds.forEach((buttonId, index) => {
    document.getElementById(buttonId).addEventListener('click', () => {
        if (document.getElementById(buttonId).classList.contains('inactive')) {
            return;
        } else {
            document.getElementById(previousMoviesButtonIds[index]).classList.remove('inactive');
            pageByGenre[index]++
            getMoviesHomePage(pageByGenre[index], titleGenres[index], namesHomeSection[index], yearsHomeSection[index], postersHomeSection[index])
                .then(() => {
                    if (nextMovies === null) {
                        document.getElementById(buttonId).classList.add('inactive');
                    }
                })
        }
    })
})

previousMoviesButtonIds.forEach((buttonId, index) => {
    document.getElementById(buttonId).addEventListener('click', () => {
        if (document.getElementById(buttonId).classList.contains('inactive')) {
            return;
        } else {
            pageByGenre[index]--
            getMoviesHomePage(pageByGenre[index], titleGenres[index], namesHomeSection[index], yearsHomeSection[index], postersHomeSection[index])
                .then(document.getElementById(nextMoviesButtonIds[index]).classList.remove('inactive'));
        }
        if (pageByGenre[index] === 1) {
            document.getElementById(buttonId).classList.add('inactive');
        }
    })
})

const genreAndSearchSectionTitle = document.getElementById('genre-and-search-section-title');
const namesGenreSearch = document.querySelectorAll('.name-genre-search');
const yearsGenreSearch = document.querySelectorAll('.year-genre-search');
const postersGenreSearch = document.querySelectorAll('.poster-genre-search');

let currentPage = 1;
let currentPageTitle = document.querySelectorAll('.current-page-title');
let currentGenre;
let currentOrigin;
let currentWordSearched;
let nextPage;

genresNavButtons.forEach((genre, index) => {
    genre.addEventListener("click", () => {
        activateNavButton(genre);
        removeAnimationTitleAndPageNumber();
        currentPage = 1;
        currentPageTitle.forEach((position) => {
            position.innerHTML = currentPage;
        });
        getMoviesGenreAndSearch('genres', titleGenres[index], currentPage)
            .then(animateTitleAndPageNumber(titleGenres[index]));
    });
});

homePageSectionTitles.forEach((title, index) => {
    title.addEventListener("click", () => {
        activateNavButton(genresNavButtons[index]);
        getMoviesGenreAndSearch('genres', titleGenres[index], currentPage)
            .then(document.getElementById("main").scrollIntoView())
            .then((animateTitleAndPageNumber(titleGenres[index])));
    })
})

document.querySelector('.search-form').addEventListener("submit", searchMovies);
function searchMovies(e) {
    e.preventDefault();
    currentWordSearched = document.querySelector('.search-form input').value;
    if (currentWordSearched === '') {
        document.querySelector('.search-form input').value = '';
        return;
    } else {
        activateNavButton('');
        removeAnimationTitleAndPageNumber();
        document.querySelector('.search-form input').value = '';
        currentGenre = currentWordSearched;
        currentPage = 1;
        currentPageTitle.forEach((position) => {
            position.innerHTML = currentPage;
        });
        getMoviesGenreAndSearch('search', currentWordSearched, currentPage)
            .then(animateTitleAndPageNumber(`Search for '${currentWordSearched}'`));
    }
}

async function getMoviesGenreAndSearch(origin, genre, page) {
    removeAnimationMovies(genreAndSearchSection);
    currentGenre = genre;
    currentOrigin = origin;
    if (origin === 'search') {
        var url = `https://moviesdatabase.p.rapidapi.com/titles/search/title/'${currentWordSearched}'?limit=16&info=base_info&titleType=movie&page=${page}`;
    }
    if (origin === 'genres') {
        if (genre === 'Top rated movies') {
            var url = `https://moviesdatabase.p.rapidapi.com/titles?list=top_rated_250&limit=16&info=base_info&page=${page}`;
        } else {
            var url = `https://moviesdatabase.p.rapidapi.com/titles?titleType=movie&genre=${genre}&sort=year.decr&limit=16&endYear=2023&info=base_info&page=${page}`;
        }
    }
    let response = await fetch(url, options);
    let movies = await response.json();
    document.querySelector('.not-found-message').classList.add('hide');
    document.querySelector('.titles-container').classList.remove('hide');
    if (checkForPageEntries(movies.entries)) {
        fillMoviesInfosGenreAndSearch(movies.results, movies.entries)
            .then(showGenreAndSearchSection())
            .then(animateMovies(genreAndSearchSection))
            .then(checkForNextPage(movies.next))
            .then(checkForPreviousPage(page))
    }
}

async function fillMoviesInfosGenreAndSearch(moviesInfos, numberOfMovies) {
    adjustNumberOfSlots(numberOfMovies, 16, 'name-genre-search', 'year-genre-search', 'poster-genre-search');
    moviesInfos.forEach((movie, index) => {
        namesGenreSearch[index].innerHTML = "";
        yearsGenreSearch[index].innerHTML = "";
        postersGenreSearch[index].style.backgroundImage = "url('src/images/poster-unavailable.png')";
        if (movie.titleText.text) {
            namesGenreSearch[index].innerHTML = movie.titleText.text;
            if (movie.titleText.text.length > 47) {
                namesGenreSearch[index].innerHTML = `${movie.titleText.text.slice(0, 45)}...`;
            }
        }
        if (movie.releaseYear && movie.releaseYear.year) {
            yearsGenreSearch[index].innerHTML = movie.releaseYear.year;
        }
        if (movie.primaryImage) {
            postersGenreSearch[index].style.backgroundImage = `url(${movie.primaryImage.url})`;
        }
    });
}

const nextPageBtn = document.querySelectorAll('.next-page-btn');
nextPageBtn.forEach((button) => {
    button.addEventListener("click", () => {
        if (button.classList.contains('inactive')) {
            return;
        } else {
            previousPageBtn.forEach((btn) => {
                btn.classList.remove('inactive');
            });
            currentPage++;
            currentPageTitle.forEach((position) => {
                position.innerHTML = currentPage;
            });
            document.getElementById("main").scrollIntoView();
            getMoviesGenreAndSearch(currentOrigin, currentGenre, currentPage);
        }
    });
})

const previousPageBtn = document.querySelectorAll('.previous-page-btn');
previousPageBtn.forEach((button) => {
    button.addEventListener("click", () => {
        if (currentPage === 1) {
            return;
        } else {
            currentPage--;
            currentPageTitle.forEach((position) => {
                position.innerHTML = currentPage;
            });
            document.getElementById("main").scrollIntoView();
            getMoviesGenreAndSearch(currentOrigin, currentGenre, currentPage);
        }
        if (currentPage === 1) {
            previousPageBtn.forEach((btn) => {
                btn.classList.add('inactive');
            });
        }
    })
})

let pageNumberInput = document.querySelectorAll('.go-to-page-form input');
document.querySelectorAll('.go-to-page-form').forEach((input, index) => {
    input.addEventListener('submit', (e) => {
        e.preventDefault();
        currentPage = pageNumberInput[index].value;
        if (currentPage < 1 || currentPage === '') {
            pageNumberInput[index].value = '';
            return;
        }
        else {
            currentPageTitle.forEach((position) => {
                position.innerHTML = currentPage;
            });
            if (currentPage > 1) {
                previousPageBtn.forEach((btn) => {
                    btn.classList.remove('inactive');
                });
            }
            if (currentPage == 1) {
                previousPageBtn.forEach((btn) => {
                    btn.classList.add('inactive');
                });
            }
            document.getElementById("main").scrollIntoView();
            getMoviesGenreAndSearch(currentOrigin, currentGenre, currentPage);
            pageNumberInput[index].value = '';
        }
    });
})

function checkForPageEntries(pageEntries) {
    if (pageEntries === 0 || pageEntries === undefined || pageEntries === null) {
        homePageSection.classList.add('hide');
        genreAndSearchSection.classList.remove('hide');
        document.querySelector('.titles-container').classList.add('hide');
        document.querySelector('.not-found-message').classList.remove('hide');
        checkForNextPage(pageEntries);
        previousPageBtn.forEach((btn) => {
            btn.classList.add('inactive');
        })
        return false;
    } else {
        return true;
    }
}

function checkForNextPage(nextPage) {
    if (nextPage === null || nextPage === 0) {
        nextPageBtn.forEach((btn) => {
            btn.classList.add('inactive');
        });
    } else {
        nextPageBtn.forEach((btn) => {
            btn.classList.remove('inactive');
        })
    }
}

function checkForPreviousPage(page) {
    if (page === 1) {
        previousPageBtn.forEach((btn) => {
            btn.classList.add('inactive');
        });
    } else {
        previousPageBtn.forEach((btn) => {
            btn.classList.remove('inactive');
        })
    }
}

function adjustNumberOfSlots(numberOfMovies, numberOfSlots, stringName, stringYear, stringPoster) {
    if (numberOfMovies < numberOfSlots) {
        let emptySlots = numberOfSlots - numberOfMovies
        let firstEmptySlot = numberOfSlots - emptySlots
        for (i = firstEmptySlot; i < numberOfSlots; i++) {
            document.getElementsByClassName(stringName)[i].classList.add('hide');
            document.getElementsByClassName(stringYear)[i].classList.add('hide');
            document.getElementsByClassName(stringPoster)[i].classList.add('hide');
        }
    } else {
        for (i = 0; i < numberOfSlots; i++) {
            document.getElementsByClassName(stringName)[i].classList.remove('hide');
            document.getElementsByClassName(stringYear)[i].classList.remove('hide');
            document.getElementsByClassName(stringPoster)[i].classList.remove('hide');
        }
    }
}

function checkMovieSlots(width) {
    if (width.matches) {
        titleInfoSlots = 2;
    } else {
        titleInfoSlots = 4;
    }
    titleGenres.forEach((title, index) => {
        getMoviesHomePage(pageByGenre[index], title, namesHomeSection[index], yearsHomeSection[index], postersHomeSection[index]);
    })
}

const width = window.matchMedia("(max-width: 660px)")
checkMovieSlots(width);
width.addEventListener("change", checkMovieSlots);