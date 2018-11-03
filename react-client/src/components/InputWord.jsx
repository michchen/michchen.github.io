import React from 'react';

const InputWord = (props) => {
  // console.log("Input Word Props!", props)
  // console.log(props.isEnabled === true ? 'ITS ENABLED': 'NOT ENABLED');
  return (
    <div>
      <input type="text" 
        autoComplete="off" 
        placeholder={"type a word & press enter to submit"} 
        onKeyPress={props.handleSubmitInput}
        onChange={(e) => props.handleInputChange(e)}
        className={props.isEnabled === true ? '' : 'disabled'}
      />
      {/* <form type="text" autoComplete="off">
        <input placeholder="type a word & press enter to submit" id="inputText" className={props.isEnabled === true ? '' : 'disabled'}/>
      </form> */}
    </div>
);}

export default InputWord;
