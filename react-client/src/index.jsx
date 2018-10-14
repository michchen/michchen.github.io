import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import InputWord from './components/InputWord.jsx';
import WordList from './components/WordList.jsx';

const gameId = Number(document.location.pathname.replace(/\//g,''));

//////////////////////////
//  SOCKET.IO SETTINGS  //
//////////////////////////

let curUser = `player${Math.round(Math.random() * 10000)}`;
var getUser = prompt("Please enter your name", curUser);
if (getUser != null) {
  curUser = getUser;
}


const validate = text => {
  return text;
}

$(function () {
  var socket = io();

  $('form').submit(function(){
    const curText = validate($('#inputText').val());
    // socket.emit('chat message', curText);
    let myData = {
      id: gameId,
      user: curUser,
      text: curText
    };
    console.log(myData);
    console.log('----------sdfsdfs');
    $.ajax({
      method: 'POST',
      url: '/api/post',
      contentType: 'application/json',
      data: JSON.stringify(myData)
    }).done(data => {
      console.log(data);
    });
    //
    // $.post({
    //   url: '/api/post',
    //   data: myData,
    //   success: data => {
    //     console.log(data);
    //   },
    //   dataType: 'application/json'
    // });

    $('#inputText').val('');
    return false;
  });
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
