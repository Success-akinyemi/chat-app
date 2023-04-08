import React, { useContext, useEffect, useRef, useState } from 'react'
import './MessageForm.css'
import SendIcon from '@mui/icons-material/Send';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/appContext';

function MessageForm() {
  const [message, setMessage] = useState('');
  const user = useSelector((state) => state.user)
  const {socket, currentRoom, messages, setMessages, privateMemberMsg} = useContext(AppContext)
  const messageEndRef = useRef(null)
  
  useEffect(() => {
    scollToBottom();
  }, [messages])
  
  function getFormatedDate(){
    const date = new Date()
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();

    month = month.length > 1 ? month : '0' + month
    let day = date.getDate().toString();

    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
  };

  const todayDate = getFormatedDate();

  socket.off('room-messages').on('room-messages', (roomMessages) =>{
    console.log('room messages>>',roomMessages)
    setMessages(roomMessages)
  })

  function scollToBottom(){
    messageEndRef.current?.scrollIntoView({behavior: 'smooth'})
  }

  function handleSubmit(e){
      e.preventDefault();
      if(!message) return
      const today = new Date();
      const minutes = today.getMinutes() < 10 ? '0'+ today.getMinutes() : + today.getMinutes()
      const time = today.getHours() + ':' + minutes;
      const roomId = currentRoom;
      socket.emit('message-room', roomId, message, user, time, todayDate)
      setMessage('')
    }

    
  return (
    <div className='message'>
        <div className='message_output'>
          <div className='message_title'>
            {user && !privateMemberMsg?._id && <div>You are in the {currentRoom} room</div>}
            {user && privateMemberMsg?._id && (
            <>
              <div>
                <span>
                  Conversation with {privateMemberMsg.name}
                </span>
              </div>
            </>
            )}
          </div>
          {!user && <div className='warning'>Please <Link to='/login' className='warnlink'>Login</Link> </div>}
          {user && messages.map(({_id: date, messagesByDate}, idx) => (
              console.log('messages by date',messagesByDate), 
            <div key={idx}>
              <p className='message_date'>{date}</p>
              {messagesByDate?.map(({content, time, from: sender}, msgidx) => (
                console.log('sender info>>', sender?.name, 'sender id>>', sender?._id, 'content', content),
                <div className={sender?.email == user?.email ? 'my_messages' :  'incomming_messages'} key={msgidx}>
                    <div>
                      <p>{sender?.id === user?._id ? 'You' : sender?.name}</p>
                      <p className='message_content'>{content}</p>
                      <p className='message_time'>{time}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div ref={messageEndRef}></div>
        
        </div>
        <form onSubmit={handleSubmit}>
            <input type='text' disabled={!user} value={message} onChange={(e) => setMessage(e.target.value)}/>
            <button disabled={!user}>
                <SendIcon />
            </button>
        </form>
    </div>
  )
}

export default MessageForm