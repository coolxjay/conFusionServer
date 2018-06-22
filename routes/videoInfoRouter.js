
const express = require('express');
const bodyParser = require('body-parser');
const Videos = require('../models/videos');
var authenticate = require('../authenticate');
const videoInfoRouter = express.Router();
const cors = require('./cors');

videoInfoRouter.use(bodyParser.json());


videoInfoRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
  Videos.find(req.query)
  .then((videos) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(videos);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser,  authenticate.verifyAdmin, (req,res,next) => {
  Videos.create(req.body)
  .then((videos) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(videos);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser,  authenticate.verifyAdmin, (req,res,next) => {
  Videos.remove({})
  .then((resp) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(resp);
  }, (err) => next(err))
  .catch((err) => next(err));
});

module.exports = videoInfoRouter;
