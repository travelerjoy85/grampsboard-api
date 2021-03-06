const express = require('express');
const mysql = require('promise-mysql');

// Express middleware
const bodyParser = require('body-parser');
const morgan = require('morgan');
const checkLoginToken = require('./lib/check-login-token.js');

// Data loader
const GrampsDataLoader = require('./lib/gramps.js');

// Controllers
const authController = require('./controllers/auth.js');
const boardsController = require('./controllers/boards.js');
const bookmarksController = require('./controllers/bookmarks.js');


// Database / data loader initialization
const connection = mysql.createPool({
  user: 'root',
  database: 'grampsboard'
});
const dataLoader = new GrampsDataLoader(connection);


// Express initialization
const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(checkLoginToken(dataLoader));

app.use('/auth', authController(dataLoader));
app.use('/boards', boardsController(dataLoader));
app.use('/bookmarks', bookmarksController(dataLoader));


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  if (process.env.C9_HOSTNAME) {
    console.log(`Web server is listening on https://${process.env.C9_HOSTNAME}`);
  } else {
    console.log(`Web server is listening on http://localhost:${port}`);
  }
});
