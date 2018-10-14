const bodyParser = require('body-parser')
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io').listen(http);
const ctrl = require('./controllers');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT;

var router = express.Router();

///////////////////
//   ENDPOINTS   //
///////////////////

// app.use(bodyParser.json());
app.use('/:id', express.static(__dirname + '/../react-client/dist'));

app.post('/api/post', bodyParser.json() , (req, res) => {
  console.log(`server.js > app.post > ------------`);
  // console.log(req);
  console.log('req.body: ', req.body)
  ctrl.insertWord(req.body, data => {
    res.send(data);
  });
});

// my get request sometimes doesn't work bc im deleting all the
// data in mongo in my tests
app.get('/api/get', (req, res) => {
  ctrl.getWords(req.query, data => {
    res.send(data)
  });
});


////////////////
//   SERVER   //
////////////////

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});

http.listen(PORT, function() {
  console.log(`listening on port ${PORT}!`);
});
