import './App.css';
import io from 'socket.io-client'
import {useState} from 'react'
import Chat from './Chat'

let socket = io.connect("https://chat-app-backend-zahaan.herokuapp.com/",{reconnection:false})
function App() {
  
  const[username,setUsername] =useState("")  
  const[room,setRoom]=useState("")
  const[showChat,setShowChat]=useState(false)
  const joinRoom =()=>{
    if(room==="" || username==="")
    { 
        alert("Please Enter your Information...")
    } 
    else if(room==="1")
    {
      alert("You are not allowed in this room...")
    }
    else
    {
      socket.emit("joinRoom",{username:username,room:room})
      setShowChat(true)
    }
  }

  return (
    <div className="App">
      {!showChat?(
      <div className='joinChatButton'>
      <h3>Enter Chat Information:</h3>
      <input type="text" placeholder="Name" onChange={(e)=>{setUsername(e.target.value)}} onKeyPress={(e)=>{e.key==="Enter" && joinRoom()}}></input>
      <input type="text" placeholder="Room ID" onChange={(e)=>{setRoom(e.target.value)}} onKeyPress={(e)=>{e.key==="Enter" && joinRoom()}}></input>
      <button onClick={joinRoom}>Join</button>
      </div>)
      :(<Chat socket={socket} username={username} room={room}/>)}
      </div>
  );
}

export default App;
