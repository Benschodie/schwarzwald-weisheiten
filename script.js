const quoteContainer = document.getElementById("quote-container");
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const twitterBtn = document.getElementById("twitter");
const newQuoteBtn = document.getElementById("new-quote");
const loader = document.getElementById("loader");
let errorCount = 0;
fallbackApi = "http://127.0.0.1:5500/weisheiten.json";

function showLoadingSpinner() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}

function hideLoadingSpinner() {
  if (!loader.hidden) {
    quoteContainer.hidden = false;
    loader.hidden = true;
  }
}

// Get Quote from API
async function getQuote() {
  showLoadingSpinner();
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";
  const apiUrl =
    "http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json";
  let urlWithProxy;
  if (errorCount < 9) {
    urlWithProxy = proxyUrl + apiUrl;
  }
  if (errorCount === 9) {
    urlWithProxy = fallbackApi;
  }

  try {
    const response = await fetch(urlWithProxy);
    const data = await response.json();
    if (data.quoteAuthor === "") {
      authorText.innerText = "Unbekannt";
    } else {
      authorText.innerText = data.quoteAuthor;
    }
    // Reduce Font Size for long Quotes
    if (data.quoteText.length > 100) {
      quoteText.classList.add = "long-quote";
    } else {
      quoteText.classList.remove = "long-quote";
    }
    quoteText.innerText = data.quoteText;
    hideLoadingSpinner();
  } catch (error) {
    if (errorCount < 10) {
      setTimeout(function () {
        getQuote();
      }, 500);
      errorCount++;
    } else {
      getQuote(fallbackApi);
    }
  }
}

function tweetQuote() {
  const quote = quoteText.innerText;
  const author = authorText.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
  window.open(twitterUrl, "_blank");
}

// Event Listeners
newQuoteBtn.addEventListener("click", getQuote);
twitterBtn.addEventListener("click", tweetQuote);

// On Load
getQuote();
