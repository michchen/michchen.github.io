const mongoose = require('mongoose');
const db = require('../database');

const wordSchema = mongoose.Schema({
  name: String,
  word: String
});

const Word = mongoose.model('Word', wordSchema);

module.exports = Word;
