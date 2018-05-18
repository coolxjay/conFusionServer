const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Dish = require('./dishes');

var dishIdSchema = new Schema({
	dishId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Dish'
	}
})

var favoriteSchema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	dishes: {
		type: [dishIdSchema]
	}
}, {timestamps: true});

var Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;