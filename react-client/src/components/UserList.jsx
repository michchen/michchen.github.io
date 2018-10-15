import React from 'react';

const UserList = (props) => {
  if (Object.values(props.userList).length > 0) {
    return (
      <ul id="userList">
        {
          Object.values(props.userList).map( userData => {
            return (<li key={userData}>{userData}</li>);
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
