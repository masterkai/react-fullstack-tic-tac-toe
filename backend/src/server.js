import http from "http";
import { Server } from "socket.io";
import getNextGameState from "./getNextGameState.js";
import { CATS_GAME, PLAYER_O_WINS, PLAYER_X_WINS, RUNNING } from "./const.js";
import express from "express";
import { fileURLToPath } from "url";
import * as path from "path";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const expressApp = express();
expressApp.use(express.static(path.join(__dirname, '../../frontend/build')))
expressApp.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/build/index.html'))
})
const server = http.createServer(expressApp)
const io = new Server(server, {
    cors: {
        origin: '*'
    }
})
const getStartingMatrix = () => [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];
let currentPlayer = 'X'
let playerXMoves = getStartingMatrix()
let playerOMoves = getStartingMatrix()
let playerXSocket;
let playerOSocket;
io.on('connection', socket => {
    if (playerXSocket) {
        playerOSocket = socket
        playerOSocket.emit('start')
        playerXSocket.emit('start')
        playerOSocket.emit('other player turn')
        playerXSocket.emit('your turn')
        console.log('Player O has joined! Starting the game...')
        socket.on('disconnect', () => {
            playerOSocket = undefined
            if (playerXSocket) {
                playerXSocket.emit('info', 'The other player has disconnected, ending the game!!')
                playerXSocket.disconnect()
                playerXSocket = undefined
            }

        })
    } else {
        playerXSocket = socket
        console.log('Player X has joined! Waiting Player O to join the game...')
        socket.on('disconnect', () => {
            playerXSocket = undefined
            if (playerOSocket) {
                playerOSocket.emit('info', 'The other player has disconnected, ending the game!!')
                playerOSocket.disconnect()
                playerOSocket = undefined
            }

        })
    }
    socket.on('reset game', () => {
        console.log('reset game')
        playerXMoves = getStartingMatrix()
        playerOMoves = getStartingMatrix()
        playerOSocket.emit('updated moves', playerXMoves, playerOMoves)
        playerXSocket.emit('updated moves', playerXMoves, playerOMoves)

        playerOSocket.emit('game restarted')
        playerXSocket.emit('game restarted')
        // const nextGameState = getNextGameState(playerXMoves, playerOMoves)

        // if (nextGameState === RUNNING) {
        //     console.log('RUNNING')
        //     let currentPlayerSocket = currentPlayer === 'X' ? playerXSocket : playerOSocket
        //     let otherPlayerSocket = currentPlayer === 'X' ? playerOSocket : playerXSocket
        //
        //     currentPlayerSocket.emit('your turn')
        //     otherPlayerSocket.emit('other player turn')
        // }
    })
    socket.on('new move', (row, col) => {
        if (currentPlayer === 'X' && socket === playerXSocket) {
            playerXMoves[row][col] = 1
            currentPlayer = 'O'
        } else if (currentPlayer === 'O' && socket === playerOSocket) {
            playerOMoves[row][col] = 1
            currentPlayer = 'X'
        }
        const nextGameState = getNextGameState(playerXMoves, playerOMoves)
        playerOSocket.emit('updated moves', playerXMoves, playerOMoves)
        playerXSocket.emit('updated moves', playerXMoves, playerOMoves)

        if (nextGameState === RUNNING) {
            let currentPlayerSocket = currentPlayer === 'X' ? playerXSocket : playerOSocket
            let otherPlayerSocket = currentPlayer === 'X' ? playerOSocket : playerXSocket

            currentPlayerSocket.emit('your turn')
            otherPlayerSocket.emit('other player turn')
        }
        if (nextGameState === PLAYER_O_WINS) {
            playerOSocket.emit('win')
            playerXSocket.emit('lose')
        }
        if (nextGameState === PLAYER_X_WINS) {
            playerXSocket.emit('win')
            playerOSocket.emit('lose')
        }
        if (nextGameState === CATS_GAME) {
            playerXSocket.emit('tie')
            playerOSocket.emit('tie')
        }
    })
})

const PORT = process.env.PORT || 8080

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})