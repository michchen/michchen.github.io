import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import InputWord from './components/InputWord.jsx';
import WordList from './components/WordList.jsx';
import UserList from './components/UserList.jsx';

let userList = [];
let myUser = 'player' + Math.round(Math.random() * 10000);
let myHash;

const gameId = document.location.pathname.replace(/\//g,'');

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
      curUserHash: ''
    };
  }

  getGame(app, gameId) {
    console.log(`fn getGame(${gameId})`);
    $.ajax({
      url: '/api/get',
      data: {
        id: gameId
      },
      method: 'GET',
      success: data => {
        app.setState({
          moves: data.moves || []
        });
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }

  componentDidMount() {
    let app = this;

    let enteredUserName = prompt('Please enter your name', myUser);
    if (enteredUserName && enteredUserName.trim().length > 0) {
      myUser = enteredUserName;
    }

    socket.emit('addUser', myUser);

    socket.on('updateUserList', data => {
      console.log("UPDATE USER LIST", myHash);
      if (myHash === undefined) {
        // debugger
        myHash = data.userList[data.userList.length - 1][0];
      }
      console.log(myHash);
      app.setState({
        users: data.userList,
        curUserIndex: data.curUserIndex,
        curUserHash: data.curUserHash
      });
    });

    socket.on('server-message', msg => {
      console.log('get message ' + msg.text);
      app.getGame(app, gameId);
    });

    socket.on('server-nextUser', data => {
      console.log(`server-nextUser: ${data}`);
      app.setState({
        curUserIndex: data.curUserIndex,
        curUserHash: data.curUserHash
      })
    });


    // debugger
    this.getGame(this, gameId);


      // input submit
      $('form').submit(function(){
        console.log('SUBMIT');
        if (app.state.users.length <= 1) {
          alert('you are the only player. need 2+ to play');
          return false;
        // } else if (app.state.curUserIndex) {
        }
        console.log(myHash);
        console.log(app.state.curUserHash);

        if (myHash !== app.state.curUserHash) {
          alert('not your turn!');
          return false;
        }

        const curText = validate($('#inputText').val());
        if (curText) {
          let myData = {
            id: gameId,
            user: myUser,
            text: curText
          };

          $.ajax({
            method: 'POST',
            url: '/api/post',
            contentType: 'application/json',
            data: JSON.stringify(myData)
          }).done(() => {
            $('#inputText').val('');
            console.log(`send message`);
            socket.emit('chat message', {
              user: myData.user,
              text: myData.text
            });
          });
        }
        return false; // prevent page refesh
      }); // end submit cb

  } // end componentdidmount

  render() {
    console.log(this.state);
    return (<div>
      <WordList movesList={this.state.moves}/>
      <UserList userList={this.state.users} curUserHash={this.state.curUserHash}/>
      <InputWord isEnabled={myHash==this.state.curUserHash}/>
    </div>);
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
