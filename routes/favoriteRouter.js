const express = require('express');
const bodyParser = require('body-parser');
const Favorites = require('../models/favorites');
const favoriteRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors');

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req,res) => { res.sendStatus(200); })
/*
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
	Favorites.findOne({user: req.user._id})
	.populate('user')
	.populate('dishes._id')
	.then((favorite) => {
		var _favorite = 
		{
			_id: favorite._id,
			user: favorite.user,
			dishes: []
		}
		for(var i=0; i<favorite.dishes.length; i++) {
			_favorite.dishes.push(favorite.dishes[i]._id);
		}
		console.log("_favorite: ", _favorite);
		
		res.statusCode = 200;
		res.setHeader('Conent-Type', 'application/json');
		res.json(_favorite);
	}, (err) => next(err))
	.catch((err) => next(err));
})
*/
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
		.populate('user')
		.populate('dishes._id')
    .then((favorites) => {
        if (!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "favorites": favorites});
        }
        else {
            if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "favorites": favorites});
            }
        }

    }, (err) => next(err))
    .catch((err) => next(err))
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
	// dishIds
	Favorites.findOne({user: req.user._id})
	.populate('user')
	.populate('dishes._id')
	.then((favorite) => {
		if(!favorite) favorite = new Favorites({user: req.user._id});	
		favorite.dishes = req.body;
		favorite.save()
		.then((resp) => {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(resp);
		}, (err) => next(err))
		.catch((err) => next(err));
	})
})
.put((req,res,next) => {
	res.statusCode = 403;
	res.end("PUT operation not supported");
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
	Favorites.findOne({user: req.user._id})
	.then((favorite) => {
		favorite.dishes = [];
		favorite.save()
		.then((favorite) => {
			Favorites.findById(favorite._id)
			.populate('user')
			.populate('dishes._id')  // or populate('dishes')
			.then((favorite) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(resp);
			}, (err) => next(err))			
		}, (err) => next(err))
		.catch((err) => next(err));
	})
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req,res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
	// return 1 or 0 Because this is used by isFavorite function
	Favorites.findOne({user: req.user._id})
	.populate('user')
	.populate('dishes._id')
	.then((favorite) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(favorite);
	}, (err) => next(err))
	.catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
	Favorites.findOne({user: req.user._id})
	.populate('user')
	.populate('dishes._id')
	.then((favorite) => {
		if(!favorite) favorite = new Favorites({user: req.user._id});
		favorite.dishes.push(req.params.dishId);
		favorite.save()
		.then((resp) => {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(resp);
		}, (err) => next(err))
		.catch((err) => next(err));
	});
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

