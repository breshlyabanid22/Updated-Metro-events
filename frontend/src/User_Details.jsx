import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';

const User_Details = () => {
  const [users, setUsers] = useState([]);
  const [requestAccepted, setRequestAccepted] = useState(false);


  useEffect(() => {
    // Fetch users from the backend when the component mounts
    axios.get('http://localhost:8081/admin/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  const acceptRequest = (userId) => {
    axios.post(`http://localhost:8081/admin/acceptRequest/${userId}`)
      .then(res => {
        // Handle the response (update state, show a message, etc.)
        console.log(res.data);
        setRequestAccepted(true);
      })
      .catch(err => console.error(err));
  };

  function formatDateString(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}/${month}/${day}`;
  }
  return (
    <div className="content-container">
      <h1>User Details</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr className='table100-head'>
              <th className='column1'>ID</th>  
              <th>Name</th>
              <th>Event name</th>
              <th>Venue</th>
              <th>No. of people</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className='column1'>{user.id}</td>
                <td>{`${user.first_name} ${user.last_name}`}</td>
                <td>{user.event_name}</td>
                <td>{user.venue}</td>
                <td>{user.numOf_people}</td>
                <td>{formatDateString(user.start_date)} - {formatDateString(user.end_date)}</td>
                <td>
                  <button className='btn-add-event' onClick={() => acceptRequest(user.id)}>
                    Accept Request
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User_Details;
