import React from 'react';

const Word = (props) => {
  return (
  <span className="word">
    {props.moveData}
    {/* this appears to be unused? */}
    {/* <div className="wordUser">{props.moveData.user}</div> */}
  </span>
)}

export default Word;
