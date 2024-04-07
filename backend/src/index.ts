const express= require('express')
import  { createServer } from 'http'
import { Server  } from 'socket.io'
import cors from 'cors'
import redis from 'redis'
// const client = redis.createClient();

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

io.on("connection",(socket)=>{
    console.log(socket.id, "USERID")

    socket.on("message",(room,data,username)=>{
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


