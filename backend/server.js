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

app.use(bodyParser.urlencoded({ extended: false }))

app.use('/:id', express.static(__dirname + '/../react-client/dist'));

app.post('/api/end', (req, res) => {
  const { gameId } = req.body;
  ctrl.postGame(req.body, () => {
    io.sockets.in(gameId).emit("endGame");
    res.end()}
  )  
});

// HELPER FUNCTIONS //

// deprecated

// const nextTurn = () => {
//   curUserIndex++;
//   if (curUserIndex >= userList.length) {
//     curUserIndex = 0;
//   }
//   if (userList[curUserIndex]) {
//     curUserHash = userList[curUserIndex][0];
//   }
// }

//////////////////////
//   LOCALSTORAGE   //
//////////////////////

let currentRoomsAndUsers = {};
let currentUsers = {};

////////////////
//   SERVER   //
////////////////

io.on('connection', function(socket){
  
  // handles addUser
  socket.on('addUser', data => {
    const { myUser, gameId } = data;
    
    // puts connected socket in that room 
    socket.join(gameId);

    // stores player locally
    if (!currentRoomsAndUsers[gameId]){
      currentRoomsAndUsers[gameId] = {
        players: [[socket.client.id, myUser]]
      }
    } else {
      currentRoomsAndUsers[gameId].players.push([socket.client.id, myUser])
    }

    currentUsers[socket.client.id] = gameId;

    // emit update user to all users connected in the room
    io.sockets.in(gameId).emit('updateUserList', currentRoomsAndUsers[gameId].players);
  });

  // handles start game
  socket.on('initGame', gameId => {
    let randomPlayerIndex = Math.floor(Math.random() * currentRoomsAndUsers[gameId].players.length);
    currentRoomsAndUsers[gameId].currentPlayerTurn = currentRoomsAndUsers[gameId].players[randomPlayerIndex][0]
    currentRoomsAndUsers[gameId].currentPlayerIndex = randomPlayerIndex;
    io.sockets.in(gameId).emit("startGame", currentRoomsAndUsers[gameId].currentPlayerTurn);
  })
  
  // handles when someone makes a move
  socket.on('sendTurn', data => {
    const { gameId, validatedCurText } = data;
    let { currentPlayerIndex, players, currentPlayerTurn } = currentRoomsAndUsers[gameId];
    currentPlayerIndex = currentPlayerIndex + 1;
    if (currentPlayerIndex >= players.length) {
      currentPlayerIndex = 0;
    }
    currentPlayerTurn = players[currentPlayerIndex][0]//00;
    currentRoomsAndUsers[gameId].currentPlayerIndex = currentPlayerIndex;
    currentRoomsAndUsers[gameId].currentPlayerTurn = currentPlayerTurn;
    io.sockets.in(gameId).emit('updateCurrentGame', 
      {
        moveAdded : validatedCurText, 
        currentGame : currentRoomsAndUsers[gameId] 
      });
  })

  socket.on('disconnect', () => {

    // finds the room of disconnected player
    let roomOfDisconnectedPlayer = currentUsers[socket.client.id]
    console.log('room of disconnected user', roomOfDisconnectedPlayer);

    // go to the room in memory, and splice out the player 
    if (roomOfDisconnectedPlayer){
      for (let i = 0; i < currentRoomsAndUsers[roomOfDisconnectedPlayer].players.length; i++){
          if (currentRoomsAndUsers[roomOfDisconnectedPlayer].players[i][0] === socket.client.id){
            currentRoomsAndUsers[roomOfDisconnectedPlayer].players.splice(i, 1);
          }
      }
    }

    // delete current user from list of users playing right now
    delete currentUsers[socket.client.id]

    // end game if the player was in a game
    io.sockets.in(roomOfDisconnectedPlayer).emit('endGame', 'disconnected'); 
    
    // updates userslist if players are still in the room after disconnect
    if (currentRoomsAndUsers[roomOfDisconnectedPlayer]){
      io.sockets.in(roomOfDisconnectedPlayer).emit('updateUserList', currentRoomsAndUsers[roomOfDisconnectedPlayer].players);
    } 
    // deletes room from memory if there are no players remaining in the game
    else {
      delete currentRoomsAndUsers[roomOfDisconnectedPlayer]
    }
  })
});

http.listen(PORT, function() {
  console.log(`listening on port ${PORT}!`);
});
