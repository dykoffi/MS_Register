"use strict"

const http = require('http')
const path = require('path')
const app = require("./_globalRoutes")
const db = require('../db')
const server = http.createServer(app)

require('dotenv').config({ path: path.resolve(process.cwd(), 'info.env') })

const port = normalizePort(process.env.PORT)
const apiName = process.env.API_NAME

server.listen(port)
server.on('listening', onListenning)
server.on('error', onError)
server.on('close', onClose)

function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) { return val; }
    if (port >= 0) { return port; }
    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') { throw error; }
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
        default:
            throw error;
    }
}

function onClose() { db.$disconnect() }
function onListenning() {
    db.$connect()
        .then(() => { console.log("Database Connected"); })
        .catch((err) => { console.error(err); })
}

console.log(`${apiName} start on port ${port}`);

module.exports = server
