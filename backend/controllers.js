const Game = require('./models/Game.js');
const db = require('./database');

module.exports.insertWord = (data, callback) => {
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

module.exports.getGame = (data, callback) => {
  db.collections.games.find({_id: Number(data.id)}).toArray((err, data) => {
    callback(data[0]);
  });
};

// module.exports.modifyUsers = (action, user) => {
//   if (action === 'add') {
//     db.collections.games.find({_id: Number(data.id)})
//   } else if (action === 'remove') {
//
//   }
// }
