var app = require("express")()
var http = require("http").Server(app)
var io = require("socket.io")(http)
var fs = require("fs")
var bodyParser = require('body-parser')


let socket
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post("/play", function(req, res) {
  console.log('body', req.body.song)
  socket.emit("play", req.body.song)

  res.send("ok")
})
io.on("connection", function(_socket) {
  socket = _socket
  socket.on("play", function(song) {
    console.log(song)
    // socket.broadcast.emit('play', song)
    socket.emit("play", song)
  })
})

http.listen(3000, function(){
  console.log('listening on *:3000');
});