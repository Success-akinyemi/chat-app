import React from 'react'
import './Navigation.css'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useLogoutUserMutation } from '../../services/appApi'
import  Avatar  from '@mui/material/Avatar'


function Navigation() {
    const user = useSelector((state) => state.user)
    const [logoutUser] = useLogoutUserMutation();

    async function handleLogout(e){
        e.preventDefault();
        await logoutUser(user)
        //redirect to home page
        window.location.replace('/')
    }
  return (
    <div className='navigation'>
        <div className='nav'>
            <div className='navbar'>
                <div className='logo'>
                    <Link to='/' className='logo_link'>
                        ChatApp
                    </Link>
                </div>
                <div className='nav_link'>
                    { !user && (
                        <Link to='/login' className='link chat_link'>
                            Login
                        </Link>
                    )}
                    <Link to='/chat' className='link chat_link'>
                        Chat
                    </Link>
                    {user && 
                    
                    <div className='dropdown_nav'>
                    <div className='dropDown_icon'>
                        <img src={user?.picture || <Avatar />} alt='profile' />
                    </div>
                    <div className='dropdown_links'>
                        <Link to='' className='link'>
                            Profile
                        </Link>
                        <button onClick={handleLogout} className='link'>Logout</button> 
                        <h4>{user?.name}</h4>
                    </div>
                </div>

                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navigation