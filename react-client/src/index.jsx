import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import InputWord from './components/InputWord.jsx';
import WordList from './components/WordList.jsx';

const gameId = Number(document.location.pathname.replace(/\//g,''));

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

let curUser = 'michelle';
var socket = io();

$(function () {
  $('form').submit(function(){
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
    socket.on('server-message', (msg => {
      let curMoves = this.state.moves ? this.state.moves : [];
      curMoves.push(msg);
      this.setState({
        moves: curMoves
      });
    }).bind(this));

    $.ajax({
      url: '/api/get',
      data: {
        id: gameId
      },
      method: 'get',
      success: (data) => {
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
