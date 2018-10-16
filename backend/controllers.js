const Game = require('./models/Game.js');
const db = require('./database');

module.exports.insertWord = (data, callback) => {
  db.collections.games.update(
    { _id: data.id },
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

module.exports.getGame = (roomId, callback) => {
  db.collections.games.find({_id: roomId}).toArray((err, data) => {
    callback(data[0]);
  });
};
