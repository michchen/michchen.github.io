import React from 'react';

const UserList = (props) => {
  if (Object.values(props.userList).length > 0) {
    return (
      <ul id="userList">
        {
          Object.entries(props.userList).map( userData => {
            if (userData[0] !== 'current') {
              return (<li key={userData[1]} className={props.userList.current === userData[1] ? 'active' : ''}>{userData[1]}</li>);
            }
            return;
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
