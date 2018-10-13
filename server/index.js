const bodyParser = require('body-parser')
    , express = require('express');

const app = express();
require('dotenv').config();

var http = require('http').Server(app);
// var io = require('socket.io')(http);

var io = require('socket.io').listen(http);

// const items = require('../database-mongo');

const PORT = process.env.PORT;

app.use(express.static(__dirname + '/../react-client/dist'));

// console.log(io);
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(PORT, function() {
  console.log(`listening on port ${PORT}!`);
});
