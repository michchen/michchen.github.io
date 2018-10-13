const bodyParser = require('body-parser')
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io').listen(http);
const ctrl = require('./controllers');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT;

app.use(express.static(__dirname + '/../react-client/dist'));

app.post('/add', (req, res) => {
  ctrl.insertWord(req.query, (data) => {
    // res.header(200);
    res.send(data);
  });
})

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
