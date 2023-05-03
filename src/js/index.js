// ------------ CONST GERAL PRA API --------------
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '5ceb4e27dfmshb06d87772731d49p1a60eejsn56e1e79c7c6f',
        'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
    }
};

// ------------------- GO HOME BUTTON AND SCROLLTOP --------------------------
function showHomePageSection() {
    homePageSection.classList.remove('hide');
    genreAndSearchSection.classList.add('hide');
    activateNavButton('');
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

const homePageSection = document.querySelector('.home-page-section');
const genreAndSearchSection = document.querySelector('.genre-and-search-section');
const pageNumberContainer = document.querySelectorAll('.go-to-page-container');

// ------------------------------------------ GENRE AND SEARCH SECTION -------------------------------------------------
const genresNavButtons = [document.getElementById('top-rated-movies'), document.getElementById('action'), document.getElementById('animation'), document.getElementById('comedy'), document.getElementById('documentary'), document.getElementById('drama'), document.getElementById('mystery'), document.getElementById('romance')];
const homePageSectionTitles = [document.getElementById('top-rated-movies-title'), document.getElementById('action-title'), document.getElementById('animation-title'), document.getElementById('comedy-title'), document.getElementById('documentary-title'), document.getElementById('drama-title'), document.getElementById('mystery-title'), document.getElementById('romance-title')];
const titleGenres = ['Top rated movies', 'Action', 'Animation', 'Comedy', 'Documentary', 'Drama', 'Mystery', 'Romance'];

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
// let pageEntries;

// ----- CHAMANDO O GETMOVIES -----

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
        removeAnimationMovies();
        getMoviesGenreAndSearch('genres', titleGenres[index], currentPage);
        document.getElementById("main").scrollIntoView();
    })
})

document.querySelector('.search-form').addEventListener("submit", testeSearch);
function testeSearch(e) {
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

// ----- GET MOVIES E FILL MOVIES INFOS -----
async function getMoviesGenreAndSearch(origin, genre, page) {
    console.log('getting pagessss', page);
    removeAnimationMovies();
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
    let pageEntries = movies.entries;
    if (pageEntries === 0) {
        alert('nao tem nada aqui')
    } else {
        nextPage = movies.next;
        console.log(nextPage);
        let moviesInfos = movies.results;
        console.log(moviesInfos);
        fillMoviesInfosGenreAndSearch(moviesInfos, pageEntries)
            .then(showGenreAndSearchSection())
            .then(animateMovies(postersGenreSearch))
            .then(checkForNextPage(nextPage));
    }
}

function checkForNextPage(nextPage) {
    if (nextPage === null) {
        nextPageBtn.forEach((btn) => {
            btn.classList.add('inactive');
        });
        // botar alerta
    } else {
        nextPageBtn.forEach((btn) => {
            btn.classList.remove('inactive');
        })
    }
    // fazer pra se digitar direto uma q nao existe, ver como ta ali o resultado null
}

async function fillMoviesInfosGenreAndSearch(moviesInfos, numberOfMovies) {
    if (numberOfMovies < namesGenreSearch.length) {
        let emptySlots = namesGenreSearch.length - numberOfMovies
        let firstEmptySlot = namesGenreSearch.length - emptySlots
        console.log(emptySlots, 'empty slots')
        console.log('first empty slot position', firstEmptySlot)
        for (i = firstEmptySlot; i < namesGenreSearch.length; i++) {
            namesGenreSearch[i].classList.add('hide');
            yearsGenreSearch[i].classList.add('hide');
            postersGenreSearch[i].classList.add('hide');
        }
    } else {
        for (i = 0; i < namesGenreSearch.length; i++) {
            namesGenreSearch[i].classList.remove('hide');
            yearsGenreSearch[i].classList.remove('hide');
            postersGenreSearch[i].classList.remove('hide');
        }
    }
    moviesInfos.forEach((movie, index) => {
        namesGenreSearch[index].innerHTML = "";
        yearsGenreSearch[index].innerHTML = "";
        postersGenreSearch[index].style.backgroundImage = "url('../src/images/poster-unavailable.png')";
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

// ----- PASSANDO AS PAGINAS -----
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
            console.log('getting page', currentPage);
            getMoviesGenreAndSearch(currentOrigin, currentGenre, currentPage);
        }
        if (currentPage === 1) {
            previousPageBtn.forEach((btn) => {
                btn.classList.add('inactive');
            });
        }
    })
})

// ----- ESCOLHENDO NUMERO PAGINA POR GENERO -----
let pageNumberInput = document.querySelectorAll('.go-to-page-form input');
let pageNumberForm = document.querySelectorAll('.go-to-page-form');

pageNumberForm.forEach((input, index) => {
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
            if (currentPage === 1) {
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

// ----- ANIMATIONS AND NAV BUTTONS -----
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

function animateMovies() {
    postersGenreSearch.forEach((poster) => {
        poster.classList.add('animate');
    });
}

function removeAnimationMovies() {
    postersGenreSearch.forEach((poster) => {
        poster.classList.remove('animate');
    })
}

// ----------------------------------------------- HOME PAGE ---------------------------------------------------------
const namesHomeSection = ['name-top-rated-movie', 'name-action', 'name-animation', 'name-comedy', 'name-documentary', 'name-drama', 'name-mystery', 'name-romance']
const yearsHomeSection = ['year-top-rated-movie', 'year-action', 'year-animation', 'year-comedy', 'year-documentary', 'year-drama', 'year-mystery', 'year-romance']
const postersHomeSection = ['poster-top-rated-movie', 'poster-action', 'poster-animation', 'poster-comedy', 'poster-documentary', 'poster-drama', 'poster-mystery', 'poster-romance']
let titleInfoSlots = 4;
var fetchedMoviesHomeSection = [];

function FetchedMovie(name, year, poster) {
    this.name = name;
    this.year = year;
    this.poster = poster
}

async function getMoviesHomePage(page, genre, nameMovie, yearMovie, posterMovie) {
    console.log(posterMovie);
    if (genre === 'Top rated movies') {
        var url = `https://moviesdatabase.p.rapidapi.com/titles?list=top_rated_250&limit=${titleInfoSlots}&info=base_info&page=${page}`;
    } else {
        var url = `https://moviesdatabase.p.rapidapi.com/titles?titleType=movie&genre=${genre}&sort=year.decr&limit=${titleInfoSlots}&endYear=2023&info=base_info&page=${page}`;
    }
    const response = await fetch(url, options);
    let movies = await response.json();
    moviesInfos = movies.results;
    moviesInfos.forEach((movie) => {
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
            var poster = '../src/images/poster-unavailable.png';
        }
        fetchedMoviesHomeSection.push(new FetchedMovie(name, year, poster));
    })
    fillMoviesInfosHomePage(nameMovie, yearMovie, posterMovie);
    fetchedMoviesHomeSection = [];
}

function fillMoviesInfosHomePage(stringName, stringYear, stringPoster) {
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

for (i = 0; i < titleGenres.length; i++) {
    getMoviesHomePage(1, titleGenres[i], namesHomeSection[i], yearsHomeSection[i], postersHomeSection[i]);
}

const nextMoviesButtonIds = ['next-top-rated-movie', 'next-action', 'next-animation', 'next-comedy', 'next-documentary', 'next-drama', 'next-mystery', 'next-romance']
const previousMoviesButtonIds = ['previous-top-rated-movie', 'previous-action', 'previous-animation', 'previous-comedy', 'previous-documentary', 'previous-drama', 'previous-mystery', 'previous-romance']
let pageByGenre = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

nextMoviesButtonIds.forEach((buttonId, index) => {
    document.getElementById(buttonId).addEventListener('click', () => {
        document.getElementById(previousMoviesButtonIds[index]).classList.remove('inactive');
        pageByGenre[index]++
        getMoviesHomePage(pageByGenre[index], titleGenres[index], namesHomeSection[index], yearsHomeSection[index], postersHomeSection[index])
            .then(animateMovies(postersHomeSection[index]));
    })
})

previousMoviesButtonIds.forEach((buttonId, index) => {
    document.getElementById(buttonId).addEventListener('click', () => {
        pageByGenre[index]--
        getMoviesHomePage(pageByGenre[index], titleGenres[index], namesHomeSection[index], yearsHomeSection[index], postersHomeSection[index]);
        if (pageByGenre[index] === 1) {
            document.getElementById(previousMoviesButtonIds[index]).classList.add('inactive');
        }
    })
})

// ------------------------ ANIMATIONS HOME PAGE -----------------
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


async function teste3(page) {
    var url = `https://moviesdatabase.p.rapidapi.com/titles?list=top_rated_250&limit=16&info=base_info&page=${page}`;
    try {
        const response = await fetch(url, options);
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error(error);
    }

}

teste3(17);
// //nos de genero - pg com 16
// // ou if !next
// if(next === null){
//     //desativar botao de proxima pagina
// } else {
//     // ativar botao de proxima pagina
// }

// // nos de busca
// if (text === null) {
//     //mensagem page x doesnt exist?
// }
// ------------------- CODIGO PRA ANIMAR TITULO E LINEAR GRADIENT DO POST QUANDO FOR PRA TELA DE CELULAR E TABLET -------------------------------------------------
// function animateMovies() {
//     // ANIMAÇAO DEPENDENDO DO DEVICE - TABLET E CELULAR NAO VAO TER O HOVER, O NOME VAI APARECER DIRETO E VAI TER A ANIMAÇAO. VER COMO FAZ
//     // IGUAL PRO REMOVE ANIMATION ALI EMBAIXO
//     // namesGenreSearch.forEach((title) => {
//     //     title.classList.add('animate');
//     // });
//     // yearsGenreSearch.forEach((year) => {
//     //     year.classList.add('animate');
//     // });
//     postersGenreSearch.forEach((poster) => {
//         poster.classList.add('animate');
//     });
// }

// function removeAnimationMovies() {
//     // namesGenreSearch.forEach((title) => {
//     //     title.classList.remove('animate');
//     // });
//     // yearsGenreSearch.forEach((year) => {
//     //     year.classList.remove('animate');
//     // });
//     postersGenreSearch.forEach((poster) => {
//         poster.classList.remove('animate');
//     })
// }