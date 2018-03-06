const app = require("express")()
const http = require("http").Server(app)
const io = require("socket.io")(http)

let socket

const promiseTimeout = function(promise, ms) {
  let timeout = new Promise((resolve, reject) => {
    let id = setTimeout(() => {
      clearTimeout(id)
      //   reject("Timed out in " + ms + "ms.")
      resolve(ms)
    }, ms)
  })
  return Promise.race([promise, timeout])
}

function emitPromise(socket, type, msg) {
  return new Promise((resolve, reject) => {
    socket.emit(type, msg, resolve)
  })
}

function broadcastPromise(socketHash, type, msg) {
  return promiseTimeout(
    Promise.all(
      Object.values(socketHash).map(socket => emitPromise(socket, type, msg))
    ),
    400
  )
}

async function ping() {
  const offset = 100
  const requestTimeStart = new Date().getTime()
  console.log(
    "pinging " + Object.values(io.sockets.connected).length + " clients"
  )
  const timestamps = await broadcastPromise(
    io.sockets.volatile.connected,
    "myping"
  )
  const requestTime = new Date().getTime() - requestTimeStart
  console.log("pinging took", requestTime)
  const playTime = new Date().getTime() + requestTime + offset
  return playTime
}

io.on("connection", function(_socket) {
  console.log("client connected")
  socket = _socket
  socket.on("play", async function(uri) {
    const timestamp = await ping()
    console.log("broadcasting song: " + uri)
    Object.values(io.sockets.connected).forEach((sock, index) => {
      sock.emit("play", { uri, timestamp })
    })
  })
})

http.listen(8990, function() {})
