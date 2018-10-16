import React from 'react';

const InputWord = (props) =>

{
  console.log(props.isEnabled === true ? 'ITS ENABLED': 'NOT ENABLED');
  return (
  <form type="text" autoComplete="off">
    <input placeholder="type a word & press enter to submit" id="inputText" className={props.isEnabled === true ? '' : 'disabled'}/>
  </form>
);}

export default InputWord;
