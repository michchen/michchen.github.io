import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import InputWord from './components/InputWord.jsx';
import WordList from './components/WordList.jsx';
import UserList from './components/UserList.jsx';

const validate = text => {
  if (text.trim().length > 0) {
    return text.trim();
  } else {
    return false;
  }
}

//////////////////
//  SOCKET.IO   //
//////////////////

var socket = io();

//////////////////////////
//   REACT COMPONENTS   //
//////////////////////////

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      moves: [],
      users: [],
      curUserIndex: 0,
      curUserHash: null,
      curText: '',
      gameId: null,
      myUser: null,
      myHash: null
    };

    this.handleSubmitInput = this.handleSubmitInput.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleStartGame = this.handleStartGame.bind(this);
    this.handleEndGame = this.handleEndGame.bind(this);
  }

  getGame() {
    // const { gameId } = this.state;
    // $.ajax({
    //   url: '/api/get',
    //   data: {
    //     id: gameId
    //   },
    //   method: 'GET',
    //   success: data => {
    //     console.log("get game successful!", data)
    //     this.setState({
    //       moves: data.moves || []
    //     });
    //   },
    //   error: (err) => {
    //     console.log('err', err);
    //   }
    // });

  }

  handleInputChange(e){
    this.setState({
      curText: e.target.value
    })
  }

  // brandon's react attempt for input submit
  handleSubmitInput(e){
    const { users, curUserHash, curText, gameId, myHash, myUser } = this.state
    if (e.key === 'Enter') {
      if (users.length <= 1) {
        alert('you are the only player. need 2+ to play');
        return false;
      }
      if (myHash !== curUserHash) {
        alert('not your turn!');
        return false;
      }
      let validatedCurText = validate(curText);
      socket.emit('sendTurn', {validatedCurText, gameId});
    }
  }      

  handleStartGame(){
    const { gameId } = this.state;
    socket.emit('initGame', gameId)
  }
  
  handleEndGame(){
    const {gameId, moves} = this.state;
    console.log("were about to end the game lol", gameId, moves);
    $.ajax({
      method: 'POST',
      url: '/api/end',
      data: {
        gameId,
        moves
      },
      success: data => {
        console.log(`Game Over! You've created: ${this.state.moves}`);
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }
  componentDidMount() {
    
    // gets gameID from window and sets it to state 
    const gameId = window.location.pathname.replace(/\//g,'');
    this.setState({ gameId: gameId }, () => this.getGame());
    
    // Add User to Socket 
    let myUser = 'player' + Math.round(Math.random() * 10000);
    let enteredUserName = prompt('Please enter your name', myUser);
    if (enteredUserName && enteredUserName.trim().length > 0) {
      this.setState({ myUser: enteredUserName },
         () => 
          {
            const { myUser, gameId } = this.state
            socket.emit('addUser', {myUser: myUser, gameId: gameId})
         }
      );
    } else {
      // if player choosen an invalid name, give the random myUser name
      this.setState({ myUser: myUser }, 
        () => {
          socket.emit('addUser', {myUser: myUser, gameId: this.state.gameId})
        });
    }

    // Listens for Updated User List (every time a user joins)
    socket.on('updateUserList', data => {
      const { myHash, gameId } = this.state;
      let myUserHash = data[data.length - 1][0];
      if (!myHash) {
        this.setState({ myHash : myUserHash }) 
      }
      this.setState({
        users: data,
        // curUserIndex: data.curUserIndex,
        // curUserHash: data.curUserHash
      });
    });

    // listens for if anyone started the game!
    socket.on("startGame", currentPlayerTurnHash => {
      this.setState({curUserHash: currentPlayerTurnHash})
    })

    socket.on('updateCurrentGame', data => {
      const { currentGame, moveAdded } = data;
      const { curUserHash } = this.state;
      let currentMoves = this.state.moves;
      currentMoves.push(moveAdded);
      this.setState(
        {
          moves: currentMoves,
          curUserHash: currentGame.currentPlayerTurn
        }, 
      () => console.log('updated moves', this.state));
    });

    socket.on('endGame', (disconnected) => {
      if (disconnected) {
        alert(`a player has disconnected! The game is over, you made ${this.state.moves.join(' ')}`)
      } else {
        alert(`The game is over! You made: ${this.state.moves.join(' ')}`);
      }
      this.setState({moves: []});
    });
    // socket.on('server-message', msg => {
    //   // console.log('get message ' + msg.text);
    //   this.getGame();
    // });

    // socket.on('server-nextUser', data => {
    //   // console.log(`server-nextUser: ${data}`);
    //   this.setState({
    //     curUserIndex: data.curUserIndex,
    //     curUserHash: data.curUserHash
    //   })
    // });

  } // end componentdidmount

  render() {
    // console.log(this.state);
    const { myHash, moves, users, curUserHash } = this.state;
    return (
      <div>
        <WordList movesList={moves}/>
        <UserList userList={users} curUserHash={curUserHash}/>
        <InputWord 
          handleInputChange={this.handleInputChange} 
          handleSubmitInput={this.handleSubmitInput} 
          isEnabled={myHash==curUserHash}
        />
        <button type="button" onClick={this.handleStartGame}>Start</button>
        <button type="button" onClick={this.handleEndGame}>End</button>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
