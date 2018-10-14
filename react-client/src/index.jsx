import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import InputWord from './components/InputWord.jsx';
import WordList from './components/WordList.jsx';

const gameId = Number(document.location.pathname.replace(/\//g,''));

const socket = io();
const validate = text => {
  return text;
}
// socket.on('message', (msg) => {
//   console.log(msg);
// })


//////////////////
//  SOCKET.IO   //
//////////////////

// let curUser = `player${Math.round(Math.random() * 10000)}`;
// var getUser = prompt("Please enter your name", curUser);
// if (getUser != null) {
//   curUser = getUser;
// }

let curUser = 'michelle';

$(function () {
  //
  // socket.on('message', function(msg){
  //   // $('#messages').append($('<li>').text(msg));
  //   console.log(`get ${msg}`);
  // });

  var socket = io();
  // define submit callback
  $('form').submit(function(){
    // socket.emit('chat message', 'hello');
    const curText = validate($('#inputText').val());
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
      console.log(`emit "${curText}"`);
      // io.emit('chatmessage', { for: 'everyone' });
      socket.emit('chat message', curText);
    });
    return false;
  }); // end submit cb


  socket.on('chat message', function(msg){
    console.log(msg);
    // $('#messages').append($('<li>').text(msg));
  });
/*
  socket.on('connect', function(){
    console.log('socket.io connected');
    socket.on('chat message', function(msg){
      // $('#messages').append($('<li>').text(msg));
      console.log(msg);
    });
  });*/

});



//////////////////////////
//   REACT COMPONENTS   //
//////////////////////////

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moves: []
    };
  }

  componentDidMount() {
    // debugger
    console.log('component did mount');
    // socket.on('message', msg => {
    //   console.log(`get: ${msg}`);
    //   this.state.moves.push(msg);
    //   // debugger
    // });

    $.ajax({
      url: '/api/get',
      data: {
        id: gameId
      },
      method: 'get',
      success: (data) => {
        console.log('/api/get: ', data);
        this.setState({
          moves: data.moves
        });
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }

  render() {
    return (<div>
      <WordList movesList={this.state.moves}/>
      <InputWord />
    </div>);
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
