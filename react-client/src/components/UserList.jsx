import React from 'react';

const UserList = (props) => {
  // console.log('RERENDER USERLIST', props);
  if (props.userList !== undefined) {
    return (
      <ul id="userList">
        {
          props.userList.map( (userData, i) => {
            return (
              <li key={i} className={((props.curUserIndex === i) ? 'active' : '')}>
                {userData[1]}
              </li>
            );
          })
        }
      </ul>
    );
  } else {
    return (
      <div>no users</div>
    );
  }
}

export default UserList;
