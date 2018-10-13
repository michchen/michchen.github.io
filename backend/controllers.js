const Game = require('./models/Game.js');
const db = require('./database');

module.exports.insertWord = (data, callback) => {
  console.log('controllers > Word > insertWord');
  console.log(data);

  db.collections.games.update(
    { _id: Number(data.id) },
    { $push: {
      words: {
        user: data.user,
        word: data.word
      }
    } },
    { upsert: true },
    (err, res) => {
      callback(res.result);
    }
  );
}

module.exports.newGame = (data, callback) => {
  console.log('new game');
  let entry = new Game({
    _id: data.id,
    words: []
  });
  entry.save(err => {
    callback(data)
  });
}
