const mongoose = require('mongoose');
const db = require('../database');

const gameSchema = mongoose.Schema({
  _id: Number,
  moves: Array,
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
