import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import InputWord from './components/InputWord.jsx';
import WordList from './components/WordList.jsx';
import UserList from './components/UserList.jsx';

let numUsers = 0;
let curUser = `player${Math.round(Math.random() * 10000)}`;
// let curUid;

const gameId = document.location.pathname.replace(/\//g,'');

const validate = text => {
  if (text.trim().length > 0) {
    return text.trim();
  } else {
    return false;
  }
}

const nextTurn = () => {
  let active = $('#userList .active');
  $('#userList .active').removeClass('active');
  active.next().addClass('active');
  console.log(`current player is now ${active.text()}`);
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
      curUserIndex: null
    };
  }

  getGame(app, gameId) {
    // console.log(`fn getGame(${gameId})`);
    $.ajax({
      url: '/api/get',
      data: {
        id: gameId
      },
      method: 'GET',
      success: data => {
        app.setState({
          moves: data.moves
        });
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }

  componentDidMount() {
    let enteredUserName = prompt('Please enter your name', curUser);
    if (enteredUserName && enteredUserName.trim().length > 0) {
      curUser = enteredUserName;
    }
    console.log('emit addUser', curUser);
    socket.emit('addUser', curUser);

    let app = this;
    socket.on('server-message', msg => {
      console.log('get message ' + msg.text);
      nextTurn();
      app.getGame(app, gameId);
    });

    socket.on('userList', (data => {
      console.log('index.jsx > on.userList');
      console.log(data);
      // console.log(data);
      this.setState({
        users: data.userList,
        curUserIndex: data.curUserIndex
      });
      // console.log(this.state);
    }).bind(this));


    // submit word callback

    $('form').submit(function(){
      if (Object.entries(app.state.users).length <= 1) {
        alert('you are the only player. need 2+ to play');
        return false;
      }
      const curText = validate($('#inputText').val());
      if (curText) {
        let myData = {
          id: gameId,
          user: curUser,
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
          socket.emit('message', {
            user: myData.user,
            text: myData.text
          });
        });
      }
      return false;
    }); // end submit cb





    this.getGame(this, gameId);
  }

  render() {
    console.log("RE RENDER");
    console.log(this.state.users);
    return (<div>
      <InputWord />
      <WordList movesList={this.state.moves}/>
      <UserList userList={this.state.users} curUser={this.state.curUserIndex}/>
    </div>);
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
