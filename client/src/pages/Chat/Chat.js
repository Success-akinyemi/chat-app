import React, {useRef} from 'react'
import MessageForm from '../../components/MessageForm/MessageForm'
import Sidebar from '../../components/Sidebar/Sidebar'
import './Chat.css'
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

function Chat() {
  const sidebarRef = useRef();
  const buttonRef = useRef();


    const showSidebar = () => {
      sidebarRef.current.classList.toggle('responsive_nav');
      buttonRef.current.classList.toggle('show');
    }    

  return (
    <div className='chat'>
        <button onClick={showSidebar} className='btn'>
        <MenuOutlinedIcon className='openbtn' />
        </button>

        <div className='container'>

        <div className='left responsive_nav show' ref={sidebarRef}>
        <button onClick={showSidebar} ref={buttonRef} className={`btn ${sidebarRef.current && sidebarRef.current.classList.contains('responsive_nav') ? 'show' : ''}`}>
        <CloseOutlinedIcon className='closebtn'/>
        </button>

            <Sidebar />
        </div>

        <div className='right'>
            <MessageForm />
        </div>
        </div>
    </div>
  )
}

export default Chat