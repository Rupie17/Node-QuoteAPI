const submitButton = document.getElementById('submit-quote');
const updatedQuoteContainer = document.getElementById('updated-quote');

submitButton.addEventListener('click', () => {
  const quote = document.getElementById('quote').value;
  const person = document.getElementById('person').value;
  const quoteId = document.getElementById('quote-id').value;

  fetch(`/api/quotes/${quoteId}?quote=${quote}&person=${person}`, {method: 'PUT'})
    .then(response => response.json())
    .then(({ quote }) => {
      console.log(quote)
      const updatedQuote = document.createElement('div');
      updatedQuote.innerHTML = `
    <h3>Congrats, your quote was updated correctly!</h3>
    <div class="quote-text">${quote.quote}</div>
    <div class="attribution">- ${quote.person}</div>
    <p>Go to the <a href="index.html">home page</a> to request and view all quotes.</p>
    `
      updatedQuoteContainer.appendChild(updatedQuote);
    });
});    