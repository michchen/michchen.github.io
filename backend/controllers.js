const Word = require('./models/Word.js');

module.exports.insertWord = (data, callback) => {
  console.log('controllers > Word > insertWord');
  console.log(data);
  let entry = new Word(data);
  entry.save(err => {
    callback(data);
  })
}
