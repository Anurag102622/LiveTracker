const express = require("express");
const app = express();
const http = require('http');
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);//learn
const path  = require("path");

io.on("connection",function(socket){

    socket.on("send-location",function(data){
        io.emit("receive-location", { id: socket.id, ...data });//sending received location to frontend
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        io.emit("user-disconnected", socket.id); // Notify all clients about disconnection
    });
    console.log("connected");
})

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, "public"))); //learn

app.get("/",function(req,res){
    res.render("index");
})

server.listen(3000,function(){
    console.log(`server is started`);
})