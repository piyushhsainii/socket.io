import WebSocket , { WebSocketServer } from 'ws'
import http from 'http'

const server = http.createServer()

const ws = new WebSocketServer({server})

ws.on("connection",(socket)=>{

    socket.on("error",(error)=>{
        console.log(error)
    })
  
})
 
 
  


server.listen(3000,()=>{ 
    console.log("server has been started",3000)
})