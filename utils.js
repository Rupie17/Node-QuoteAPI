const getRandomElement = arr => {
  if (!Array.isArray(arr)) throw new Error('Expected an array');
  return arr[Math.floor(Math.random() * arr.length)];
}

const generateIds = arr => {
  arr.forEach((quote, index) => {
    // create a property of id just if it doesn't exist already (once the ids are generated won't be changed)
    quote.id = !quote.id && `quote${index + 1}`;
  });  
}

const getIndexById = (id, arr) => {
  return arr.findIndex((quote) => {
    // return the index if the there is a match 
    return quote.id == id;
  });
};

const getPersonInfo = (person, arr) => {
  fetch(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${person}`)
    .then(response => {
      arr.newLine = response
    }, rejected => {
        return false
    })
}

module.exports = { getRandomElement, generateIds, getIndexById }
