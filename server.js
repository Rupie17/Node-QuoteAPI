const express = require('express');
import ('node-fetch');

const app = express();

const { quotes } = require('./data');
const { getRandomElement, getIndexById } = require('./utils');

const PORT = process.env.PORT || 4001;

app.use(express.static('public'));

// Get routes - get data from quotes array 
app.get('/api/quotes', (req, res) => {
  let quoteMatch;
  let quoteSearch = req.query.person;
  if (quoteSearch == undefined) {  
    res.send({quotes: quotes})
  } else {
    quotesMatch = quotes.filter(quote => {
      return quote.person == quoteSearch && quote;
    });
    if (quoteMatch) {
      res.send({ quotes: quotesMatch });
    } else {
      res.status(404).send('Author not found!! 😡');
    }
  }
})
app.get('/api/quotes/random', (req, res) => {
  let randomQuote = getRandomElement(quotes);
  res.send({quote: randomQuote})
})

// Post route - add new quotes to the array
app.post('/api/quotes', (req, res) => {
  let newPerson = req.query.person;
  let newQuote = req.query.quote;
  if (newQuote != '' || newPerson != '') {
    quotes.push({ quote: newQuote, person: newPerson });
    res.send({ quote: { quote: newQuote, person: newPerson } });
  } else {
    res.sendStatus(400);
  }
})

// Put route - update the data in the array (based on id provided)
app.put('/api/quotes/:id', (req, res) => {
  // first we check if there're not missing parameter in the request
  if (req.query.person && req.query.quote) {
    const quoteIndex = getIndexById(req.params.id, quotes);
    // check if there is a match using the id provided in the request
    if (quoteIndex !== -1) {
      quotes[quoteIndex] = req.query
      res.send({ quote: req.query });
    } else {
      res.status(404).send('Quote not found with the id provided! 🤷‍♂️')
    }
  } else {
    res.status(400).send("There's a missing parameter in the request!")
  }
})

// Delete route - handle the delete requests 
app.delete('/api/quotes/:id', (req, res) => {
  const quoteIndex = getIndexById(req.params.id, quotes);
  if (quoteIndex !== -1) {
    quotes.splice(quoteIndex, 1);
    res.send({ quote: quotes[quoteIndex] });
  } else {
    res.status(404).send('Quote not found with the id provided! 🤷‍♂️')
  }
})

const getPersonInfo = (arr) => {
  // for each element it will make a Get request to the Wikipedia Api with a Title parameter as the value of quotes.person
  // this GET request will get us a Json with just a short description about the person we have searched. 
  arr.forEach(quote => {
    // we make the request just if the property description doesn't exist yet 
    if (!quote.description) {
      fetch(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${quote.person}`)
        .then(response => {
          return response.json()
        })
        .then(jsonResponse => {
        // this part looks a bit ugly but it's the only way i found to get that description .
        //(it's a bit nested and at some point the property name is a string which is different in each request)
          let pageInfo = jsonResponse.query.pages;
          Object.keys(pageInfo).forEach(item => {
            quote.description = pageInfo[item].extract;
          });
        })
        .catch(error => {
          console.log(error)
          quote.description = 'No Description Avilable 😢'
        })  
    }
  })
}

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
  // asign an id for all the quotes aready in the array
  // each time the server is started it will get the biographical blurbs for all the person
  // getPersonInfo(quotes);
})