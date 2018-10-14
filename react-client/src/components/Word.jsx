import React from 'react';

const Word = (props) => {
  // console.log(props);
  return (
  <li>
    {props.moveData.user}: {props.moveData.text}
  </li>
)}

export default Word;
