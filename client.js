const ioclient = require("socket.io-client")
const { spawn } = require("child_process")
const app = require("express")()
const http = require("http").Server(app)
const bodyParser = require("body-parser")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// TODO: implement UDP broadcast
// https://gamedev.stackexchange.com/questions/30761/solution-for-lightweight-lan-peer-discovering
const SERVER_IP = "http://192.168.0.4:8990"

const socket = ioclient(SERVER_IP)
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

http.listen(8989, function() {})
