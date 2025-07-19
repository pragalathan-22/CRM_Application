import React from 'react'
import {AuthContext} from '../context/AuthContext'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'


const Home = () => {
    const {user,dispatch} = useContext(AuthContext);
    const [username, setUsername] = useState(user?.username || '');

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
        localStorage.removeItem('token');
        window.location.href = '/'; // Redirect to login page
    }


    const getUserDetails = async () => {

        axios.defaults.headers.common['Authorization'] = user ? `Bearer ${user.token}` : '';

        await axios.get('http://localhost:3000/home')
            .then(response => {
                setUsername(response.data.username);
                console.log('User details fetched:', response.data);
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
            });
    }
    useEffect(() => {
        if (user) {
            getUserDetails();
        }
    }
    , [user]);


  return (
    <div>
        welcome {user && username}
    </div>
  )
}

export default Home
