import React from "react";
import { useState,useEffect } from "react";
import ScrollToBottom from 'react-scroll-to-bottom'

export default function Chat({socket,username,room})
{
    const[currentMessage, setCurrentMessage]=useState("")
    const[messageList,setMessageList]=useState([])
    const[usersOnline,setUsersOnline]=useState([])
    const sendMessage=async()=>{
        if(currentMessage!=="")
        {
            const mData={
                room:room,
                username:username,
                message:currentMessage,
                time: new Date(Date.now()).getHours()+":"+ new Date(Date.now()).getMinutes()
            }
            console.log("Sending")
            console.log(mData)
            await socket.emit("sendMessage",mData)
            setMessageList((oldMessageList)=>[...oldMessageList,mData])
            setCurrentMessage("")
        }
    }
    useEffect(()=>{
        socket.on("recieveMessage",(data)=>{
            setMessageList((oldMessageList=>[...oldMessageList,data]))
        })
        socket.on("roomInfo",(data)=>{
            setUsersOnline(data.users)
            console.log(data)
            console.log(data.users)
        })
    },[socket])
    return (
    <div className="chat-window">
        <div className="chat-header">
            <div>ChatRoom Number: {room}<br></br> Online: {
                usersOnline.map((online)=>{
                    return <span>{online.username}, </span>
                })
            }</div>
        </div>
        <div className="chat-body">
        <ScrollToBottom className="message-container">
        {
            messageList.map((mData)=>{
                return <div className="message" id={username===mData.username?"you":"other"}>
                    <div>
                        <div className="message-content"><p>{mData.message}</p></div>
                        <div className="message-data"><p id="time">{mData.time}</p><p id="username">{mData.username}</p></div>
                    </div>
                    </div>
            })
        }
        </ScrollToBottom>
        </div>
        <div className="chat-footer">
            <input value={currentMessage} type="text" placeholder="Your Message" onChange={(e)=>{setCurrentMessage(e.target.value)}} onKeyPress={(e)=>{e.key==="Enter" && sendMessage()}}></input>
            <button onClick={sendMessage}>&#9658;</button>
        </div>
    </div>
    )
}