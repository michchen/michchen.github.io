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
  // curGame = req.query.id;
  ctrl.getGame(req.query, data => {
    res.send(data)
  });
});

////////////////
//   SERVER   //
////////////////

const nextTurn = () => {
  if (curUserIndex >= (userList.length - 1)) {
    curUserIndex = 0;
  } else {
    curUserIndex++;
  }
}

io.on('connection', function(socket){
  // userOrder[curGame] = userOrder[curGame] || [];
  // console.log(curGame);

  socket.on('disconnect', function(){
    // store index of current user as curUserIndex

    // if curUserIndex is greater or equal to the index of current user
      // do nothing, because splicing current user would essentially move curUserIndex to the next user
    // else
      // increment curUserIndex

    let disconnectingIndex = userList.findIndex(
      tuple => (tuple[0] === socket.client.id)
    );

    if (disconnectingIndex >= 0) {
      if (curUserIndex < disconnectingIndex) {
        curUserIndex++;
      }

      userList.splice(disconnectingIndex, 1);

      console.log(`user #${disconnectingIndex} disconnected`);
      console.log(userList);
      io.sockets.emit('userList', userList);
    }
  });

  socket.on('addUser', user => {
    // if first user in room, no need to do anything bc curUserIndex is already 0
    // pretty much just push user tuple to userList

    userList.push([
      socket.client.id, // unique id
      user              // user's name
    ]);

    console.log(`user ${user} connected`);
    console.log(userList);

    io.sockets.emit('userList', {userList: userList, curUserIndex: curUserIndex});
  });

  socket.on('message', function(data){

    // 'message' is emitted in the cb of POST
    // server-message triggers app.getGame (which updates based one GET)
    io.sockets.emit('server-message', data);

    nextTurn();
    io.sockets.emit('curUserIndex', curUserIndex);

  });

});

http.listen(PORT, function() {
  console.log(`listening on port ${PORT}!`);
});
