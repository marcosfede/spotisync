const ioclient = require("socket.io-client")
const { spawn } = require("child_process")
const app = require("express")()
const http = require("http").Server(app)
const bodyParser = require("body-parser")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const socket = ioclient("http://localhost:3001")
socket.on("play", function(uri) {
  console.log("recieved broadcast, playing " + uri)
  spawn("bash", ["spotify", "play", "uri", uri])
})

// connect to broadcasting server
socket.on("connect_error", function(error){
  throw new Error(error)
})

// listen for cli commands via http
app.post("/play", function(req, res) {
  const uri = req.body.uri
  console.log("sending play uri to server: " + uri)
  socket.emit("play", uri)
  res.send("ok")
})

http.listen(3000, function() {})
