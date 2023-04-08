import React, { useState } from 'react'
import './Signup.css'
import profileImg from '../../assest/profilePic.jpg'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Link, useNavigate } from 'react-router-dom';
import { useSignupUserMutation } from '../../services/appApi'

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [signupUser, { isLoading, error}] = useSignupUserMutation()

  const [image, setImage] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  function validateImg(e) {
    const file = e.target.files[0];
    if(file.size > 1048576){
      alert('Max file size Image should be less than 1mb')
    }else{
      setImage(file);
      setImagePreview(URL.createObjectURL(file))
    }
  }

  async function uploadImage(){
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'wtqdxw06');
    try{
      setUploadingImg(true);
      let res = await fetch('https://api.cloudinary.com/v1_1/dsjwuwjm1/image/upload', {
        method: 'post',
        body: data
      })
      const urlData = await res.json();
      setUploadingImg(false);
      return urlData.url
    }catch(err){
      setUploadingImg(false)
      console.log(err)
    }
  }

  async function handleSignup(e){
    e.preventDefault()
    if(!image) return alert('please upload a profile picture')
    const url = await uploadImage(image)
    console.log(url)
    // handle signup
    signupUser({name, email, password, picture: url}).then(({data}) => {
      if(data){
        console.log('data', data)
        navigate('/chat')
      }
    })
  }

  return (
    <div className='signup'>
      <div className='signup_container'>
        <form className='signup_form' onSubmit={handleSignup}>
          <div className='image_area'>
            <img src={ imagePreview || profileImg} alt='profile' className='signup_img'/>
            <label htmlFor='image-upload' className='image-upload-label'>
              <AddCircleIcon className='upload_icon'/>
            </label>
            <input type='file' id='image-upload' hidden accept='image/png, image/jpeg' onChange={validateImg}/>
          </div>

          {error && <p>{error.data}</p> }

          <div className='name_area'>
            <label>Name:</label>
            <input placeholder='Name' type='text' onChange={(e) => setName(e.target.value)} value={name}/>
          </div>

          <div className='email_area'>
            <label>Email:</label>
            <input placeholder='Email Address' type='email' onChange={(e) => setEmail(e.target.value)} value={email}/>
          </div>
          <small>We wil never share your email with anyone</small>

          <div className='password_area'>
            <label>Password:</label>
            <input type='password' placeholder='password' onChange={(e) => setPassword(e.target.value)} value={password}/>
          </div>

          <button className='signup_button'>{
            uploadingImg || isLoading ? 'signing you up...' : 'Create Account'
          }</button>
        </form>
        <p>Already have an account? <Link to='/login' className='link'>Login</Link></p>
      </div>
    </div>
  )
}

export default Signup