import React from 'react';

const InputWord = (props) => {
  return (
    <div>
      <input type="text" 
        autoComplete="off" 
        placeholder={"type a word & press enter to submit"} 
        onKeyPress={props.handleSubmitInput}
        onChange={(e) => props.handleInputChange(e)}
        className={props.isEnabled === true ? '' : 'disabled'}
      />
    </div>
);}

export default InputWord;
