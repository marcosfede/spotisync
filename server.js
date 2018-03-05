const app = require("express")()
const http = require("http").Server(app)
const io = require("socket.io")(http)

let socket
io.on("connection", function(_socket) {
  console.log('client connected')
  socket = _socket
  socket.on("play", function(uri) {
    console.log("broadcasting song: " + uri)
    socket.broadcast.emit("play", uri)
    socket.emit("play", uri)
  })
})

http.listen(8990, function() {})
