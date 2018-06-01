const express = require('express');
const bodyParser = require('body-parser');
const Favorites = require('../models/favorites');
const favoriteRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors');

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req,res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
		.populate('user')
		.populate('dishes')
    .then((favorites) => {
				if (!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json(favorites);
        }
        else {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					return res.json(favorites);
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
	Favorites.findOne({user: req.user._id})
	.then((favorite) => {
		if(!favorite) {	
			// favorites == null meaning no user is found
			favorite = new Favorites({user: req.user._id});	
		}
		for(var i=0; i<req.body.length; i++) {
			if( favorite.dishes.indexOf(req.body[i].dishId) < 0)
				favorite.dishes.push(req.body[i].dishId);
		}
		favorite.save()
		.then((favorite) => {
			res.stausCode = 200;
			res.setHeader('Content-Type', 'applicatin/json');
			res.json(favorite);
		}, (err) => next(err))
		.catch((err) => next(err));
	}, (err) => next(err))
	.catch((err) => next(err));
})
.put((req,res,next) => {
	res.statusCode = 403;
	res.end("PUT operation not supported");
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
	Favorites.findOne({user: req.user._id})
	.then((favorite) => {
		if( favorite ) {
			if( favorite.dishes ) {
				favorite.dishes = [];
				favorite.save()
				.then(resp => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					return res.json(resp);
				}, (err) => next(err))
				.catch((err) => next(err));
			}
		}
		else {
			// user is not existing so no need to delete any
			var err = new Errror("No favorite to delete");
			err.status = 403;
			return next(err);
		}
	}, (err) => next(err))
	.catch((err) => next(err));
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req,res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
	Favorites.findOne({user: req.user._id})
	.then((favorite) => {
		if( favorite ) {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			return res.json(favorite.dishes.indexOf(req.params.dishId));
		}
		else {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			return res.json(-1);
		}
	}, (err) => next(err))
	.catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
	Favorites.findOne({user: req.user._id})
	.then((favorite) => {
		if(!favorite) {	
			// favorites == null meaning no user is found
			favorite = new Favorites({user: req.user._id});
			favorite.dishes.push(req.params.dishId);
			favorite.save()
			.then((favorite) => {
				res.stausCode = 200;
				res.setHeader('Content-Type', 'applicatin/json');
				res.json(favorite);
			}, (err) => next(err))
			.catch((err) => next(err));
		}
		else {
			// user is existing
			// if same dishId exist?
			if( favorite.dishes.indexOf(req.params.dishId) < 0 ) {
				// no same dishId
				favorite.dishes.push(req.params.dishId);
				favorite.save()
				.then((favorite) => {
					res.stausCode = 200;
					res.setHeader('Content-Type', 'applicatin/json');
					res.json(favorite);
				}, (err) => next(err))
				.catch((err) => next(err));
			}
			else {
				var err = new Error("duplicted dish");
				err.status = 401;
				next(err);
			}
		}
	}, (err) => next(err))
	.catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
	
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
	Favorites.findOne({user: req.user._id})
	.then((favorite) => {
		if(favorite) {
			favorite.dishes.id(req.params.dishId).remove();
			favorite.save()
			.then((resp) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'applicaiton/json');
				res.json(resp);
			}, (err) => next(err))
			.catch((err) => next(err));
		}
	})
});

module.exports = favoriteRouter;

