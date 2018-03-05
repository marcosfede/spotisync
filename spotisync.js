const { spawn, exec } = require("child_process")

const axios = require("axios")
const cli = require("commander")

cli
    .command("connect")
    .action(() => {
        spawn("node", ["client.js"], {detached: true})
        process.exit(0)
    })
cli
    .command("disconnect")
    .action(() => {
        exec("kill $(ps aux | grep '[n]ode client.js' | awk '{print $2}')")
    })
cli
    .command("play <uri>")
    .action((uri, opts) => {
        axios.post('http://localhost:3000/play', {uri: uri})
            .then(res => console.log(res.data))
    })

cli.parse(process.argv)
