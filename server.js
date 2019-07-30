const express = require('express');

const server = express();

server.use(logger);
server.use(express.json());

const userRouter = require('./users/userRouter.js');
const postRouter = require('./posts/postRouter.js');

//Applying routes
server.use('/api/users', userRouter);
server.use('/api/posts', postRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

function logger(req, res, next) {
  console.log(`request METHOD: ${req.method}, request URL: ${req.url}, Current Date and Time: ${Date().toString()}`)
  next();
};

module.exports = server;
