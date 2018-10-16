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
  ctrl.getWords(req.query, data => {
    res.send(data)
  });
});

////////////////
//   SERVER   //
////////////////

io.on('connection', function(socket){
  numUsers++;
  io.sockets.emit('updateUserList', userList);
  console.log(`a user connected! total: ${numUsers}`);
  console.log(userList);

  socket.on('disconnect', function(){
    numUsers--;
    io.sockets.emit('updateUserList', userList);
    console.log(`a user disconnected. total: ${numUsers}`);
    console.log(userList);
    // io.sockets.emit('numUsers', numUsers);


    let disconnectingIndex = userList.findIndex(
      tuple => (tuple[0] === socket.client.id)
    );

    if (disconnectingIndex >= 0) {
      if (curUserIndex < disconnectingIndex) {
        curUserIndex++;
      }
      userList.splice(disconnectingIndex, 1);
      socket.emit('updateUserList', userList);
    }

  });


  socket.on('addUser', user => {
    console.log('server.js > on.addUser');
    userList.push([
      socket.client.id, // unique id
      user              // user's name
    ]);
    console.log('socket.emit(updateUserList,...');
    console.log(userList);
    // oct 15
    let obj = {userList: userList, curUserIndex: curUserIndex};
    // console.log(obj);
    socket.emit('updateUserList', obj);
  });

  socket.on('chat message', function(data){
    console.log(`received chat-message "${data.text}" on server`);
    console.log(`emit server-message "${data.text}" on server`);
    io.sockets.emit('server-message', data);
    io.sockets.emit('server-nextUser', curUserIndex);
  });

});

http.listen(PORT, function() {
  console.log(`listening on port ${PORT}!`);
});
