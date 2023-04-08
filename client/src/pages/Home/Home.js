import React from 'react'
import './Home.css'
import { Link } from 'react-router-dom'
import ChatIcon from '@mui/icons-material/Chat';

function Home() {
  return (
    <div className='home'>
        <div className='home_container'>
            <p>Share the world with your Friends</p>

            <Link to='/signup' className='home_link'>
                <span>Get Started</span>
                <ChatIcon />
            </Link>
        </div>
    </div>
  )
}

export default Home