const express= require('express')
import  { createServer } from 'http'
import { Server  } from 'socket.io'
import cors from 'cors'
import redis ,  { createClient  } from 'redis'

const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
    connectionStateRecovery:{
      maxDisconnectionDuration:2*60*1000,
      skipMiddlewares:true
    }
  })

app.use(cors())
async function startApp(){
  const client = createClient()
  await client.connect()

  async function sendMessage (socket:any){
    console.log("control is reaching here")
    const data = await client.lRange("messages", 0, -1)
    data.map((x:any)=>{
            const userNameMessage = x.split(":")
            const redisUserName = userNameMessage[0];
            const redisMessage = userNameMessage[1];
            socket.emit("message-sent",redisMessage,redisUserName)
            console.log(redisUserName)
            console.log(redisMessage)
          })
  }
  
  io.on("connection",(socket)=>{
      sendMessage(socket)

      socket.on("message",(room,data,username)=>{
          client.rPush("messages",`${username}:${data}`)
          console.log(data, "Message in backend")
          io.to(room).emit("message-sent",data,username)
      })  

      socket.on("join-room",(room)=>{
        socket.join(room)
        console.log("joined",room)
      })
  })
  
  server.listen(3000,()=>{
      console.log('Server started on PORT', 3000)
  })
}

startApp()


