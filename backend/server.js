const bodyParser = require('body-parser')
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io').listen(http);
const ctrl = require('./controllers');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT;

var router = express.Router();
let socketList = {};
let userOrder = {};
let curUser;
let curGame;

let curUserIndex = 0;
let userList = [];


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
  curGame = req.query.id;
  ctrl.getGame(req.query, data => {
    res.send(data)
  });
});

////////////////
//   SERVER   //
////////////////

io.on('connection', function(socket){

  userOrder[curGame] = userOrder[curGame] || [];
  console.log(curGame);

  socket.on('disconnect', function(){
    // store index of current user as curUserIndex

    // if curUserIndex is greater or equal to the index of current user
      // do nothing, because splicing current user would essentially move curUserIndex to the next user
    // else
      // increment curUserIndex

    io.sockets.emit('userList', socketList);
  });

  socket.on('addUser', user => {
    // if first user in room, no need to do anything bc curUserIndex is already 0

    // pretty much just push user tuple to userList

    

    // io.sockets.emit('curUser', curUser);
    // io.sockets.emit('userList', socketList);
  });

  socket.on('message', function(data){
    // console.log(`received chat-message "${data.text}" on server`);
    // console.log(`emit server-message "${data.text}" on server`);

    io.sockets.emit('server-message', data);
  });

});

http.listen(PORT, function() {
  console.log(`listening on port ${PORT}!`);
});
