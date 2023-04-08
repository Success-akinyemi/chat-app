import {io} from 'socket.io-client'
import React from 'react'
<pre>{process.env.REACT_APP_SERVER}</pre>
const SOCKET_URL = process.env.REACT_APP_SERVER
//'http://localhost:5001'
export const socket = io(SOCKET_URL);
//app context
export const AppContext = React.createContext();