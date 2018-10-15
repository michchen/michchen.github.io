import React from 'react';

const Word = (props) => {
  // console.log(props);
  return (
  <span className="word">
    {props.moveData.text}
    <div className="wordUser">{props.moveData.user}</div>
  </span>
)}

export default Word;
