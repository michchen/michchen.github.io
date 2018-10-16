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
let curUser;

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
  ctrl.getGame(req.query, data => {
    res.send(data)
  });
});

////////////////
//   SERVER   //
////////////////

io.on('connection', function(socket){

  socket.on('disconnect', function(){
    delete socketList[socket.client.id];
    io.sockets.emit('userList', socketList);
  });

  socket.on('addUser', user => {
    if (Object.entries(socketList).length === 0) {
        curUser = user;
    }

    socketList[socket.client.id] = user;
    console.log('curuser is '+curUser);
    io.sockets.emit('curUser', curUser);
    io.sockets.emit('userList', socketList);
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
