import React from 'react';
import Word from './Word.jsx';

const WordList = (props) => {
  return(
    <div>
      <div id="wordList">
        {props.movesList.map((item, index) => (
          <Word key={index} moveData={item} />
        ))}
      </div>
    </div>
  )
}

export default WordList;
