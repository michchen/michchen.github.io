const Game = require('./models/Game.js');
const db = require('./database');

module.exports.insertWord = (data, callback) => {
  // console.log('controllers > Word > insertWord');
  // console.log(data);

  db.collections.games.update(
    { _id: Number(data.id) },
    { $push: {
      moves: {
        user: data.user,
        text: data.text,
      }
    } },
    { upsert: true },
    (err, res) => {
      callback(res.result);
    }
  );
};

module.exports.getWords = (data, callback) => {
  db.collections.games.find({_id: Number(data.id)}).toArray((err, data) => {
    callback(data[0]);
  });
};

// module.exports.insertWord = (data, callback) => {
// }
