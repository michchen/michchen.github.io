const Game = require('./models/Game.js');
const db = require('./database');

module.exports.postGame = (data, callback) => {
  console.log("data on the controller side", data);
  db.collections.games.save(data, (err, data) => {
    callback();
  });
};

// module.exports.getPreviousGames = (data, callback) => {
//   console.log("getpreivousgames", data);
//   // db.collections.games.save(data, (err, data) => {
//   //   callback();
//   // });
// };


