import { useEffect, useMemo, useState } from "react";
import { io } from 'socket.io-client'

export default function Home() {

  const [Message, setMessage] = useState('')
  const [Data, setData] = useState('')

  const  socket = useMemo(()=>io('http://localhost:5000'),[])


  const sendDataHandler = (e:any)=>{
    e.preventDefault()
    socket.emit("message", {message: Message})
    // setMessage("")
  }   

  console.log(Data,"i am data")
  useEffect(()=>{   
    socket.on("connect",()=>{
      console.log("connected in frontend",socket.id)
    })
    socket.on("message-receive",(data)=>{
      console.log(data,"data from message handler")
      setData(Data)
    })
   
    return ()=>{  
      socket.disconnect()
    }
  },[])

  return (
    <main className="flex ">
      <form action="" onSubmit={sendDataHandler} >
      <input className="border border-red-400" value={Message} onChange={(e)=>setMessage(e.target.value)} type="text" />
      <button type="submit" >Send data</button>
      </form>
      <div> data : {Data}</div>
    </main>
  );
}
