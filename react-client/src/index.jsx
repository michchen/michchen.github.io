import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import InputWord from './components/InputWord.jsx';
import WordList from './components/WordList.jsx';

const gameId = Number(document.location.pathname.replace(/\//g,''));

// const socket = io();
const validate = text => {
  return text;
}

//////////////////
//  SOCKET.IO   //
//////////////////

let curUser = 'michelle';
var socket = io();

$(function () {
  // var socket = io('http://localhost',{'multiplex': false});

  $('form').submit(function(){
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

      socket.emit('chat message', {
        user: myData.user,
        text: myData.text
      });
    });
    return false;
  }); // end submit cb


  // socket.on('server-message', function(msg){
  //   console.log(`get "${msg}"`);
  //
  // });

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
    socket.on('server-message', msg => {
      // console.log(msg);
      // console.log(this.state);

      // console.log(curMoves);
      let curMoves = this.state.moves;
      curMoves.push(msg);
      this.setState({
        moves: curMoves
      });
      // console.log(this.state.moves);
      // debugger
    });

    $.ajax({
      url: '/api/get',
      data: {
        id: gameId
      },
      method: 'get',
      success: (data) => {
        // console.log('/api/get: ', data);
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
