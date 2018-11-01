import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import InputWord from './components/InputWord.jsx';
import WordList from './components/WordList.jsx';
import UserList from './components/UserList.jsx';

let userList = [];
let myUser = 'player' + Math.round(Math.random() * 10000);
let myHash;

// const gameId = document.location.pathname.replace(/\//g,'');

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
      curUserHash: '',
      curText: '',
      gameId: '',
    };

    this.handleSubmitInput = this.handleSubmitInput.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  getGame() {
    const { gameId } = this.state;
    $.ajax({
      url: '/api/get',
      data: {
        id: gameId
      },
      method: 'GET',
      success: data => {
        console.log("get game successful!", data)
        this.setState({
          moves: data.moves || []
        });
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }

  handleInputChange(e){
    this.setState({
      curText: e.target.value
    })
  }

  // brandon's react attempt for input submit
  handleSubmitInput(e){
    const { users, curUserHash, curText, gameId } = this.state
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
      if (validatedCurText) {
        let myData = {
          id: gameId,
          user: myUser,
          text: validatedCurText
        };
        $.ajax({
          method: 'POST',
          url: '/api/post',
          contentType: 'application/json',
          data: JSON.stringify(myData)
        }).done(() => {
          $('#inputText').val('');
          // console.log(`send message`);
          socket.emit('chat message', {
            user: myData.user,
            text: myData.text
          });
        });
      }
    
    
    }
  }      

  componentDidMount() {
    
    const gameId = window.location.pathname.replace(/\//g,'');
    let app = this;
    this.setState({ gameId: gameId }, () => this.getGame());

    let enteredUserName = prompt('Please enter your name', myUser);
    if (enteredUserName && enteredUserName.trim().length > 0) {
      myUser = enteredUserName;
    }

    socket.emit('addUser', myUser);

    socket.on('updateUserList', data => {
      // console.log("UPDATE USER LIST", myHash);
      if (myHash === undefined) {
        // debugger
        myHash = data.userList[data.userList.length - 1][0];
      }
      // console.log(myHash);
      app.setState({
        users: data.userList,
        curUserIndex: data.curUserIndex,
        curUserHash: data.curUserHash
      });
    });

    socket.on('server-message', msg => {
      // console.log('get message ' + msg.text);
      app.getGame(app, gameId);
    });

    socket.on('server-nextUser', data => {
      // console.log(`server-nextUser: ${data}`);
      app.setState({
        curUserIndex: data.curUserIndex,
        curUserHash: data.curUserHash
      })
    });

  } // end componentdidmount

  render() {
    // console.log(this.state);
    return (
      <div>
        <WordList movesList={this.state.moves}/>
        <UserList userList={this.state.users} curUserHash={this.state.curUserHash}/>
        <InputWord 
          handleInputChange={this.handleInputChange} 
          handleSubmitInput={this.handleSubmitInput} 
          isEnabled={myHash==this.state.curUserHash}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
