import React from 'react';
import Word from './Word.jsx';

const WordList = (props) => (
  <div>
    <div id="wordList">
      {props.movesList.map(item => (
        <Word moveData={item} />
      ))}
    </div>
  </div>
);

export default WordList;
