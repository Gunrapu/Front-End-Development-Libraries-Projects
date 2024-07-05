// Define color palette
let colors = [
    '#006347',  // Jade
    '#97D0A7',  // Seafoam
    '#BBDAF6',  // Baby Blue
    '#56187D',  // Purple
    '#AC0123',  // Dark Red
    '#EF9F26',  // Orange
    '#E6CD69'   // Sand
];

// Initial state object
const state = {
    quotesData: [],     // Holds fetched quotes data
    currentText: "",    // Currently displayed quote text
    currentAuthor: ""   // Currently displayed quote author
};

// Function to fetch quotes data from API
const getQuotesData = () => {
    return $.ajax({
        "async": true,
        "crossDomain": true,
        "url": "https://type.fit/api/quotes",
        "method": "GET",
    }).then(function (response) {
        state.quotesData = JSON.parse(response);  // Parse and store quotes data
        console.log('quotesData');
        console.log(state.quotesData);  // Log fetched data (for debugging)
    }).catch(function (error) {
        console.error('Error fetching quotes data:', error);  // Log error if fetch fails
    });
};

// Function to get a random quote from fetched data
const getRandomQuote = () => {
    return state.quotesData[Math.floor(Math.random() * state.quotesData.length)] || {};
};

// Function to display a quote on the page
const displayQuote = () => {
    const randomQuote = getRandomQuote();  // Get a random quote object

    // Update current quote text and author
    state.currentText = randomQuote.text || "";
    state.currentAuthor = randomQuote.author || "";

    // Update Twitter share link with current quote
    $('#tweet-quote').attr(
        'href',
        'https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=' +
          encodeURIComponent('"' + state.currentText + '" ' + state.currentAuthor)
    );

    // Update Tumblr share link with current quote
    $('#tumblr-quote').attr(
        'href',
        'https://www.tumblr.com/widgets/share/tool?posttype=quote&tags=quotes,freecodecamp&caption=' +
          encodeURIComponent(state.currentAuthor) +
          '&content=' +
          encodeURIComponent(state.currentText) +
          '&canonicalUrl=https%3A%2F%2Fwww.tumblr.com%2Fbuttons&shareSource=tumblr_share_button'
    );

    // Animate quote text change with fade effect
    $('.quote-text').animate({ opacity: 0 }, 1000, function () {
        $(this).animate({ opacity: 1 }, 500);
        $('#text').text(randomQuote.text);  // Update displayed quote text
    });
    
    // Animate quote author change with fade effect
    $('.quote-author').animate({ opacity: 0 }, 1500, function () {
        $(this).animate({ opacity: 1 }, 500);
        $('#author').html(randomQuote.author);  // Update displayed quote author
    });

    // Change background and button colors randomly
    const color = Math.floor(Math.random() * colors.length);
    $('html, body').animate(
        {
            backgroundColor: colors[color],
            color: colors[color]
        },
        1500
    );

    $('.button').animate(
        {
            backgroundColor: colors[color]
        },
        1000
    );
};

// Document ready function to initialize page and fetch quotes data
$(document).ready(function () {
    // Fetch quotes data and then display initial quote
    getQuotesData().then(() => {
        displayQuote();  // Display initial quote on page load
    });

    // Event listener for "New Quote" button click
    $('#new-quote').on('click', displayQuote);
});
