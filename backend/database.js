const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/oneword');

const db = mongoose.connection;

db.on('error', () => {
  // console.log('mongoose error');
});

db.on('open', () => {
  // console.log('mongoose connected!');
});

module.exports = db;
