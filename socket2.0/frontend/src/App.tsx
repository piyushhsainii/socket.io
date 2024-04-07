import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { io } from 'socket.io-client'

interface DataType {
    message:String
    username:String
}

function App() {
  const [socketID, setsocketID] = useState("")
  const [isRoom, setisRoom] = useState(false)
  const [UserName, setUserName] = useState('')
  const [Message, setMessage] = useState("")
  const [Data, setData] = useState<DataType[]>([])
  // const [room, setRoom] = useState('')
  const socket = useMemo(() => io('http://localhost:3000', {
    withCredentials: true
  }), [])


  const joinRoomHandler = ()=>{
    setsocketID("room")
    setisRoom(true)
    socket.emit("join-room","room")
  }

  const sendMessageHandler =  ()=>{
    socket.emit("message", socketID, Message,UserName)
  }
  console.log(Data)

  useEffect(()=>{

    socket.on("connect",()=>{
      console.log("Connected",socket.id)
    })

    socket.on("message-sent",(d:string,username:string)=>{
      console.log(d, "frontend data")
      setData( (prev)=> [...prev, {message:d,username}] )
      console.log(d,username)
    })
    
    return () =>{
      socket.disconnect();
    }

  },[])

  return (
    <>
      <div>
        <input type="text" value={UserName} placeholder='username' onChange={(e)=>setUserName(e.target.value)} />
        <button onClick={joinRoomHandler}> Join room</button>
      </div>
    {
      isRoom ? 
      <div>
      <input type="text" onChange={(e)=>setMessage(e.target.value)} />
      <button onClick={sendMessageHandler} >SEND MESSAGE</button>
      </div>
      : 
      null
    }
      {/* <input type="text" onChange={(e)=>setRoom(e.target.value)}  placeholder='enter-room-name' /> */}
      <div>
        room chat here - 
        {Data &&
          Data.map((mess, index) => (
            <div key={index}>
              {`${mess?.username} :  ${mess.message}`}
            </div>
          ))
        }
      </div>
    </>
  )
}

export default App
