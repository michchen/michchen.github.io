import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import InputWord from './components/InputWord.jsx';
import WordList from './components/WordList.jsx';
import UserList from './components/UserList.jsx';

let numUsers = 0;
let userList = [];

const gameId = document.location.pathname.replace(/\//g,'');

const validate = text => {
  if (text.trim().length > 0) {
    return text.trim();
  } else {
    return false;
  }
}

const nextUser = () => {

}

//////////////////
//  SOCKET.IO   //
//////////////////

let curUser = 'player' + Math.round(Math.random() * 10000);
var socket = io();

$(function () {

  socket.on('numUsers', count => {
    // console.log(`${count} users`);
    numUsers = count;
  })
});



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

    let enteredUserName = prompt('Please enter your name', curUser);
    if (enteredUserName && enteredUserName.trim().length > 0) {
      curUser = enteredUserName;
    }

    socket.emit('addUser', curUser);

    socket.on('updateUserList', data => {
      console.log("UPDATE USER LIST");
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
        console.log(app.state.curUserIndex);
        if (app.state.users.length <= 1) {
          alert('you are the only player. need 2+ to play');
          return false;
        // } else if (app.state.curUserIndex) {
        }


        // if it's not your turn

        // currently my state has moves, users, and curUserIndex
        // console.log($('#userList li').eq(curUserIndex).text(), curUser)
        // i would like the curUserHash as well
        // else if () {
        //   alert('not your turn');
        //   return false;
        // }



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
      <InputWord />
    </div>);
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
