const bodyParser = require('body-parser')
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io').listen(http);
const ctrl = require('./controllers');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT;

var router = express.Router();

let numUsers = 0;

///////////////////
//   ENDPOINTS   //
///////////////////

app.use(bodyParser.json());

app.use('/:id', express.static(__dirname + '/../react-client/dist'));


app.get('/', (req, res) => {
  res.send('main page');
});

app.post('/api/post', bodyParser.json() , (req, res) => {
  ctrl.insertWord(req.body, data => {
    res.send(data);
  });
});

app.get('/api/get', (req, res) => {
  ctrl.getWords(req.query, data => {
    res.send(data)
  });
});

////////////////
//   SERVER   //
////////////////

io.on('connection', function(socket){
  numUsers++;
  io.sockets.emit('numUsers', numUsers);
  console.log(`a user connected! total: ${numUsers}`);

  socket.on('disconnect', function(){
    numUsers--;
    io.sockets.emit('numUsers', numUsers);
    console.log(`a user disconnected. total: ${numUsers}`);
  });

  socket.on('chat message', function(data){
    console.log(`received chat-message "${data.text}" on server`);
    console.log(`emit server-message "${data.text}" on server`);
    io.sockets.emit('server-message', data);
  });

});

http.listen(PORT, function() {
  console.log(`listening on port ${PORT}!`);
});
