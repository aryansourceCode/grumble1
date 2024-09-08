const express=require("express");
const path=require("path")
const http=require("http");
const app=express();
const server=http.createServer(app)
const {Server}=require("socket.io")
const io=new Server(server);

const port=process.env.Port||5000;
app.use(express.static(path.join(__dirname,'public')))
io.on("connection",onconnect)
let socketconnected=new Set();

function onconnect(socket){
    console.log(socket.id);
    socketconnected.add(socket.id);
    io.emit("total-client",socketconnected.size)
    socket.on("disconnect",()=>{
        console.log("socket dissconnected are",socket.id)
        socketconnected.delete(socket.id)
        io.emit("total-client",socketconnected.size)
    })
    socket.on("message",(data)=>{
        console.log(data);
        socket.broadcast.emit("chat-msg",data)
    })
    socket.on("feedback",(data)=>{
        socket.broadcast.emit("feedback",data)
    })

}


server.listen(port,()=>{console.log(`server is running on ${port}`)});