const io = require("socket.io-client")
const {execSync} = require("child_process")
const app = require("express")()
const http = require("http").Server(app)
const bodyParser = require("body-parser")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const wait = time => new Promise(resolve => {
    setTimeout(resolve, time)
})
// TODO: implement UDP broadcast
// https://gamedev.stackexchange.com/questions/30761/solution-for-lightweight-lan-peer-discovering
const SERVER_IP = "http://192.168.0.5:8990"

const socket = io(SERVER_IP)
socket.on("play", function (data) {
    console.log("recieved broadcast, playing " + data.uri)
    const currentTime = new Date().getTime()
    const timestamp = parseInt(data.timestamp)
    const time = timestamp - parseInt(currentTime, 10)
    console.log("playing at:", timestamp)
    wait(time).then(() => {
        console.log('executed diff', (new Date).getTime() - timestamp)
        execSync("spotify play uri " + data.uri)
        return wait(100)
    }).then(() => {
        execSync("spotify pause")
        execSync("spotify pos 0")
        execSync("spotify play")
    })
})
socket.on("_ping", function (_, fn) {
    console.log("recieved a ping from the server")
    const time = new Date().getTime()
    socket.emit(fn(time.toString()))
})

// connect to broadcasting server
socket.on("connect_error", function (error) {
    throw new Error(error)
})

// listen for cli commands via http
app.post("/play", function (req, res) {
    const uri = req.body.uri
    console.log("sending play uri to server: " + uri)
    socket.emit("play", uri)
    res.send("ok")
})

http.listen(8989, function () {
})
