import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'
import { useLoginUserMutation } from '../../services/appApi'
import { AppContext } from '../../context/appContext'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { socket } = useContext(AppContext);
  const [loginUser, {isLoading, error}] = useLoginUserMutation();

  function handleLogin(e){
    e.preventDefault();
    // handle login
    loginUser({email, password}).then(({data}) =>{
      if(data){
        //socket work
        socket.emit('new-user')
        //navigate to chat
        navigate('/chat')
      }
    })
  }

  return (
    <div className='login'>
      <div className='login_container'>
        <form className='login_form' onSubmit={handleLogin}>
          {error && <p>{error.data}</p>}
          <div className='login_email_area'>
            <label>Email:</label>
            <input placeholder='Email Address' required type='email' onChange={(e) => setEmail(e.target.value)} value={email}/>
          </div>
          <small>We wil never share your email with anyone</small>

          <div className='login_password_area'>
            <label>Password:</label>
            <input type='password' placeholder='password' required onChange={(e) => setPassword(e.target.value)} value={password}/>
          </div>

          <button className='login_button'>{isLoading ? 'Please wait' : 'Submit'}</button>
        </form>
        <p>Don't have an account? <Link to='/signup' className='link'>Signup</Link></p>
      </div>
    </div>
  )
}

export default Login