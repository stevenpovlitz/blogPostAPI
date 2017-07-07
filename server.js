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

app.listen(8080, () => {
  console.log("App listening on port 8080");
});
