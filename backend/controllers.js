const Game = require('./models/Game.js');
const db = require('./database');

module.exports.postGame = (data, callback) => {
  console.log("data on the controller side", data);
  db.collections.games.save(data, (err, data) => {
    callback();
  });
};

// deprecated lol //

// module.exports.insertWord = (data, callback) => {
//   // console.log('controllers > Word > insertWord');
//   // console.log(data);

//   db.collections.games.update(
//     { _id: data.id },
//     { $push: {
//       moves: {
//         user: data.user,
//         text: data.text,
//       }
//     } },
//     { upsert: true },
//     (err, res) => {
//       callback(res.result);
//     }
//   );
// };

// module.exports.getWords = (data, callback) => {
//   db.collections.games.find({_id: data.id}).toArray((err, data) => {
//     callback(data[0]);
//   });
// };


// module.exports.insertWord = (data, callback) => {
// }
