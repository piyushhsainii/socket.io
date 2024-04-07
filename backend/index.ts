import express from 'express'
import { Server  } from 'socket.io'
import { createServer } from 'http'
import cors from 'cors'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer,{
    cors:{
        origin:"*",
        methods:["POST","GET"],
        credentials:true
    }
})

app.use(cors())

app.get('/',(req,res)=>(
    res.json({
        success:true
    }) 
))

io.on("connection",(socket)=>{
    console.log(socket.id, "user id")

    socket.on("message",(data)=>{
        console.log(data,"data from message")
        io.emit("message-receive", data) 
    })

})   
 

httpServer.listen(5000, ()=>{
    console.log("Server has started on PORT 5000")
})