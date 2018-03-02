var ioclient = require("socket.io-client")
const { spawn } = require("child_process")
var argv = require("minimist")(process.argv.slice(2))

let socket
function connect(serverip) {
  socket = ioclient(serverip)
  socket.on("play", function(song) {
    console.log(song)
    spawn("bash", ["spotify", "play", song])
  })
}

function playSong(song) {
  socket.emit("play", song)
}
console.log(argv)
connect("http://localhost:3000")
// playSong('fede')
