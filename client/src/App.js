import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation/Navigation';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import Chat from './pages/Chat/Chat';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { AppContext, socket} from './context/appContext'

function App() {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState([]);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [privateMemberMsg, setPrivateMembersMsg] = useState({});
  const [newMessages, setNewMessages] = useState({});

  const user = useSelector((state) => state.user)

  return (
    <AppContext.Provider value={{ socket, currentRoom, setCurrentRoom, members, setMembers, messages, setMessages, privateMemberMsg, setPrivateMembersMsg, rooms, setRooms, newMessages, setNewMessages }}>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path='/' element={<Home />}/>
          {!user && (
            <>
              <Route path='/login' element={<Login />}/>
              <Route path='/signup' element={<Signup />}/>
            </>
          )}
          <Route path='/chat' element={<Chat />}/>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
