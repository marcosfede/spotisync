const ioclient = require("socket.io-client")
const exec = require('shelljs.exec')
const app = require("express")()
const http = require("http").Server(app)
const bodyParser = require("body-parser")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// TODO: implement UDP broadcast
// https://gamedev.stackexchange.com/questions/30761/solution-for-lightweight-lan-peer-discovering
const SERVER_IP = "http://localhost:8990"

const socket = ioclient(SERVER_IP)
socket.on("play", function(data) {
  console.log("recieved broadcast, playing " + data.uri)
  const currentTime = new Date().getTime()
  const timestamp = parseInt(data.timestamp)
  const time = timestamp - parseInt(currentTime, 10)
  console.log("playing at:", timestamp)
  setTimeout(() => {
    console.log('executed diff', (new Date).getTime() - timestamp)
    const cp = exec("spotify play uri " + data.uri)
    cp.stdin.end()
  }, time)
})
socket.on("myping", function(_, fn) {
  console.log("recieved a ping from the server")
  const time = new Date().getTime()
  socket.emit(fn(time.toString()))
})

// connect to broadcasting server
socket.on("connect_error", function(error) {
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
