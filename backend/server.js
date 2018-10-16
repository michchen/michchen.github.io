const bodyParser = require('body-parser')
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io').listen(http);
const ctrl = require('./controllers');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT;

var router = express.Router();

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
  // res.send(req.query.id)
  ctrl.getGame(req.query.id, data => {
    res.send(data)
  });
});

////////////////
//   SERVER   //
////////////////

const nextTurn = () => {
  if (curUserIndex < (userList.length - 1)) {
    curUserIndex = curUserIndex + 1;
  } else {
    curUserIndex = 0;
  }

}

io.sockets.on('connection', function(socket){
  socket.emit('updateUserList', userList)

  socket.on('disconnect', function(){
    console.log('disconnect');
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
      // console.log(`user #${disconnectingIndex} disconnected`);
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

  socket.on('message', function(){
    console.log('RECEIVED MESSAGE. EMIT BACK TO CLIENT');
    // nextTurn();
    // io.sockets.emit('server-nextUser', curUserIndex);
  });

});

http.listen(PORT, function() {
  console.log(`listening on port ${PORT}!`);
});
