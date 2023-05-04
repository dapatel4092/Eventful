// Dependencies
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const hbs = exphbs.create({});


// Sets up the Express App  DOUBLE CHECK PORT IS WORKING SINCE PORT ENV IS IGNORED
const app = express();
const PORT = process.env.PORT || 3001;

// Set Handlebars as the default template engine.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));
app.use(require('./controllers/home-routes'))

// Starts the server listening
app.listen(PORT, () => {
  console.log('Server listening on: http://localhost:' + PORT);
});


//API for event brite
// const eventbriteUrl = "https://www.eventbriteapi.com/v3/users/me/?token="
// const eventbriteKey = "LMZTLLTII2KJCUS7PBHH"


