//What we want our app to do:
//User is led to application
//User can select from buttons that are Studio Ghilbi Movies
//Displays GIF from each studio Ghilbi movie
//Bonus - if you can also hook up to OMDB API then you can give additional Ghilbi info


//A list of our studio Ghibli Movies

var movieList = [
    {
        movieName: 'My Neighbor Totoro',
        imdbId: 'tt0096283'
    },
    {
        movieName: 'Howl\'s Moving Castle',
        imdbId: 'tt0347149'
    },
    {
        movieName: 'Ponyo',
        imdbId: 'tt0876563'
    },
    {
        movieName: 'Spirited Away',
        imdbId: 'tt0245429'
    },
    {
        movieName: 'Kiki\'s Delivery Service',
        imdbId: 'tt0097814'
    },
    {
        movieName: 'Princess Mononoke',
        imdbId: 'tt0119698'
    },
    {
        movieName: 'The Secret World of Arrietty',
        imdbId: 'tt1568921'
    }
]

// Turn each of these movies into buttons

function movieButtonMaker() {

    for (var i = 0; i < movieList.length; i++) {
        var selectedMovie = movieList[i].movieName;
        var selectedMovieId = movieList[i].imdbId;

        var movieButton = $('<button>' + selectedMovie + '</button>');
        movieButton.attr('data-movie', selectedMovie);
        movieButton.attr('data-movie-id', selectedMovieId);
        movieButton.addClass('movie-button btn btn-white btn-fill btn-lg');
        $('#buttons-here').append(movieButton);
    }
};


//When the user presses a movie button

$(document).ready(function () {

    //make a button for each movie
    movieButtonMaker();

    //Make buttons clickable that pulls an API call

    $('.movie-button').on('click', function () {
        event.preventDefault();
        $('#gifs-here').empty();

        var movie = $(this).attr('data-movie');
        var movieId = $(this).attr('data-movie-id');

        //make a URL for each movie for OMBD

        var omdbURL = 'http://www.omdbapi.com/?i=' + movieId + '&plot=short&apikey=8c0c7a4f';
        console.log(omdbURL);

        // make a URL for each movie for GIPHY 
        var queryURL = 'https://api.giphy.com/v1/gifs/search?q=' + movie + '&api_key=KLncOi2E4e88eSq96J50FOd28FFzfiF0&limit=10';

        console.log(queryURL);
        

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            //Write a Still Image to The Page
            for (var i = 0; i < response.data.length; i++) {
                console.log("I'm trying to work");
                var ghilbiGif = $('<img>');
                ghilbiGif.addClass('movie-gif');
                ghilbiGif.attr('src', response.data[i].images.fixed_height_still.url);
                ghilbiGif.attr('data-still', response.data[i].images.fixed_height_still.url);
                ghilbiGif.attr('data-animate', response.data[i].images.fixed_height.url);
                ghilbiGif.attr('data-state', 'still');
                ghilbiGif.attr('alt', 'testing image');
                $('#gifs-here').append(ghilbiGif);
            }
        });

        $.ajax({
            url: omdbURL, 
            method: "GET"
        }).then(function(rep){
            console.log(rep);

            //Write header to the page
            var ghibliInfoHead = rep.Title;
            $('#movie-header').text(ghibliInfoHead);

            //Write year to the page
            var ghibliInfoYear = rep.Year;
            $('#movie-year').text(ghibliInfoYear); 

            //Write header to the page
            var ghibliInfoPlot = rep.Plot;
            $('#movie-plot').text(ghibliInfoPlot);
        })
    });

    $('#gifs-here').on('click', 'img', function() {
        console.log("I am clicked");

        var state = $(this).attr("data-state");
        // If the clicked image's state is still, update its src attribute to what its data-animate value is.
        // Then, set the image's data-state to animate
        // Else set src to the data-still value

        if (state === "still") {
          $(this).attr("src", $(this).attr("data-animate"));
          $(this).attr("data-state", "animate");
        } else {
          $(this).attr("src", $(this).attr("data-still"));
          $(this).attr("data-state", "still");
        }
      });
});