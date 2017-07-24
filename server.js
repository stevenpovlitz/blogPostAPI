const express = require('express');
const morgan = require('morgan');

const app = express();

const blogPostRouter = require('./blogPostRouter');

// basic http logging
app.use(morgan('common'));

app.use('/blog-posts', blogPostRouter);

app.get('/', (req,res) => {
  res.send("GET at root");
});

// will be used by runServer and closeServer functions below
let server;

// starts server and returns a Promise.
function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err)
    });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);

        return;
      }
      resolve();
    });
  });
}


// below will cause errors because testing will try to
// start a server when one is already listening on 8080
// app.listen(8080, () => {
//   console.log("App listening on port 8080");
// });

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
