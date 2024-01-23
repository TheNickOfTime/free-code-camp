const quoteText = document.getElementById("text");
const authorText = document.getElementById("author");
const tweetButton = document.getElementById("tweet-quote");

const quotesURL = 'https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json';
const twitterBaseURL = 'https://twitter.com/intent/tweet'

let quotes = [];
let quote = {};

$(document).ready(onReady);

async function onReady() {
    $("#new-quote").click(() => newQuote())
    await fetchQuotes();
    newQuote();

}

async function fetchQuotes() {
    const request = await fetch(quotesURL);
    const data = await request.json();
    const quotesArr = data.quotes;

    quotes = quotesArr;
    console.log(quotes);
}

function getRandomQuote() {
    quote = quotes[Math.floor(Math.random() * quotes.length)];
    console.log(quote);
}

function updateQuote() {
    $("#text").html(`"${quote.quote}"`);
    $("#author").html(`- ${quote.author}`);
}

function newQuote() {
    getRandomQuote();
    updateQuote();
    updateTwitterLink();
}

function updateTwitterLink() {
    const twitterEndURL = `?text=${quote.quote.replace(/\s/g, "%20")}`;
    console.log(twitterEndURL);
    $("#tweet-quote").attr("href", `${twitterBaseURL}${twitterEndURL}`);
}