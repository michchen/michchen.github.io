import React from 'react';
import Word from './Word.jsx';

const WordList = (props) => (
  <div>
    <h2>Build a sentence together!</h2>
    <ul>
      {props.movesList.map(item => (
        <Word moveData={item} />
      ))}
    </ul>
  </div>
);

export default WordList;
