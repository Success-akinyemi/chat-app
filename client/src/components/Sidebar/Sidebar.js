import React, { useContext, useEffect } from 'react'
import './Sidebar.css'
import { useDispatch, useSelector } from 'react-redux'
import { AppContext } from '../../context/appContext'
import { addNotifications, resetNotifications} from '../../features/userSlice'
import CircleIcon from '@mui/icons-material/Circle';

function Sidebar() {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const { socket, currentRoom, setCurrentRoom, members, setMembers, messages, setMessages, privateMemberMsg, setPrivateMembersMsg, rooms, setRooms, newMessages, setNewMessages } = useContext(AppContext)
    
    function joinRoom(room, isPublic = true){
        if(!user){
            return alert('Please login')
        }
        socket.emit('join-room', room, currentRoom)
        setCurrentRoom(room);

        if(isPublic){
            setPrivateMembersMsg(null)
        }
        //Dispatch for notifications
        dispatch(resetNotifications(room))


    }

    socket.off('notifications').on('notifications', (room) => {
        if(currentRoom != room) dispatch(addNotifications(room))
    })

        useEffect(() => {
            if(user){
                setCurrentRoom('general');
                getRooms();
                socket.emit('join-room', 'general');
                socket.emit('new-user')
            }
        }, [])
    
    socket.off('new-user').on('new-user', (payload) => {
        console.log(payload)
        setMembers(payload)
    })

    function getRooms(){
        fetch('http://localhost:5001/rooms')
            .then((res) => res.json())
            .then((data) => setRooms(data))
    }

    function alphbeticOderIds(id1, id2){
        if(id1 > id2){
            return id1 + '-' + id2
        }else{
            return id2 + '-' + id1
        }
    }

    function handlePrivateMemberMsg(member){
        setPrivateMembersMsg(member);
        const roomId = alphbeticOderIds(user._id, member._id)
        joinRoom(roomId, false)
    }

    function shouldDisplayBadge(member) {
        const roomId = alphbeticOderIds(member._id, user._id);
        return user.newMessages[roomId] > 0;
    }

    if(!user){
        return <></>
    }

  return (
    <div className='sidebar'>
        <div className='rooms'>        
            <h2>Availble rooms</h2>
            <ul>
                {rooms.map((room, idx) => (
                    <li key={idx} onClick={() => joinRoom(room)} className={room === currentRoom ? 'active' : ''} style={{cursor: 'pointer', display: 'flex', justifyContent: 'center'}}>
                        {room} {currentRoom !== room && user.newMessages[room] && (
                            <span className='badge'>{user.newMessages[room]}</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
        
        <div className='rooms'>
            <h2>Members</h2>
                <ul>
                    {members.map((member) => (
                <li key={member._id} className={`${privateMemberMsg?._id === member?._id ? 'active' : ''} ${member._id === user._id ? 'disabled' : ''}`} onClick={() => handlePrivateMemberMsg(member)} >
                    <div className='member_list'>
                        <div className='user_profile'>
                            <img src={member.picture} className='user_profile_img' alt='users profile' />
                            {member.status === 'online' ? <i><CircleIcon className='online'/></i> : <i><CircleIcon className='offline'/></i>}
                        </div>
                        
                        <div className='user_status'>
                            {member.name}
                            {member._id === user?._id && ' (You)'}
                            {member.status === 'online' ? ' (online)' : ' (offline)'}
                        </div>

                        <div>
                            {shouldDisplayBadge(member) && <span className='badge'>{user.newMessages[alphbeticOderIds(member._id, user._id)]}</span>}
                        </div>
                    </div>
                </li>
                    ))}
                </ul>
        </div>

    </div>
  )
}

export default Sidebar