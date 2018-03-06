const app = require("express")()
const http = require("http").Server(app)
const io = require("socket.io")(http)

let socket
let timings = new Map()
let requestTimeStart

function emitPromise(socket, type, msg){
    return new Promise((resolve, reject) => socket.emit(type, msg, resolve))
}
function broadcastPromise(socketHash, type, msg){
    return Promise.all(Object.values(socketHash).map(socket => emitPromise(socket, type, msg)))
}

async function ping() {
    requestTimeStart = (new Date).getTime()
    const pings = await broadcastPromise(io.sockets.connected, 'ping')
    console.log(pings)
    return pings
}

io.on("connection", function (_socket) {
    console.log('client connected')
    socket = _socket
    socket.on("play", async function (uri) {
        const pings = await ping()
        console.log("broadcasting song: " + uri)
        io.sockets.emit("play", uri)
    })
})

http.listen(8990, function () {
})
