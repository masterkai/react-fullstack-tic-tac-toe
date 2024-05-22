import http from "http";
import { Server } from "socket.io";
import getNextGameState from "./getNextGameState.js";
import { CATS_GAME, PLAYER_O_WINS, PLAYER_X_WINS, RUNNING } from "./const.js";
import express from "express";
import { fileURLToPath } from "url";
import * as path from "path";
import { v4 as uuid } from "uuid";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const expressApp = express();
expressApp.use(express.static(path.join(__dirname, '../../front-end/build')))
expressApp.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../front-end/build/index.html'))
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
const gamesInProgress = {};
function createNewGame(isAutoJoin) {
    return {
        id: uuid(),
        playerXSocket: null,
        playerYSocket: null,
        currentPlayer: "X",
        playerXMoves: getStartingMatrix(),
        playerOMoves: getStartingMatrix(),
        isAutoJoin
    }
}

const gameWithOnePlayer = Object.values(gamesInProgress).find(game => game.playerXSocket)
io.on('connection', socket => {
    const { shouldCreateGame, gameId } = socket.handshake.query;
    console.log({ shouldCreateGame, gameId });

    let existingGame;

    if (gameId) {
        existingGame = gamesInProgress[gameId];
    } else {
        existingGame = Object.values(gamesInProgress)
          .find(game => game.isAutoJoin && game.playerXSocket && !game.playerOSocket);
    }
    let game;

    if (existingGame && !shouldCreateGame) {

        game = existingGame
        game.playerOSocket = socket
        game.playerOSocket.emit('start')
        game.playerXSocket.emit('start')
        game.playerOSocket.emit('other player turn')
        game.playerXSocket.emit('your turn')
        console.log(`Player O has joined Game: ${game.id}! Starting the game...`)
        socket.on('disconnect', () => {
            game.playerOSocket = undefined

            if (game.playerXSocket) {
                game.playerXSocket.emit('info', 'The other player has disconnected, ending the game!!')
                game.playerXSocket.disconnect()
                game.playerXSocket = undefined
            }
            delete gamesInProgress[game.id]
        })
    } else {
        const newGame = createNewGame(!shouldCreateGame)
        gamesInProgress[newGame.id] = newGame
        if (shouldCreateGame) {
            socket.emit('gameId', newGame.id);
        }
        newGame.playerXSocket = socket
        console.log(`Player X has joined Game: ${newGame.id}! Waiting Player O to join the game...`)
        socket.on('disconnect', () => {
            newGame.playerXSocket = undefined
            if (newGame.playerOSocket) {
                newGame.playerOSocket.emit('info', 'The other player has disconnected, ending the game!!')
                newGame.playerOSocket.disconnect()
                newGame.playerOSocket = undefined
            }
            delete gamesInProgress[newGame.id]
        })
        game = newGame;
    }
    socket.on('reset game', () => {
        const {
            playerXSocket,
            playerOSocket,
            playerXMoves,
            playerOMoves,
        } = game;
        console.log('reset game')
        game.playerXMoves = getStartingMatrix()
        game.playerOMoves = getStartingMatrix()
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
        const {
            currentPlayer,
            playerXSocket,
            playerOSocket,
            playerXMoves,
            playerOMoves,
        } = game;
        if (currentPlayer === 'X' && socket === playerXSocket) {
            playerXMoves[row][col] = 1
            game.currentPlayer = 'O'
        } else if (currentPlayer === 'O' && socket === playerOSocket) {
            playerOMoves[row][col] = 1
            game.currentPlayer = 'X'
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
            playerXSocket.disconnect();
            playerOSocket.disconnect();
            delete gamesInProgress[game.id]
        }
        if (nextGameState === PLAYER_X_WINS) {
            playerXSocket.emit('win')
            playerOSocket.emit('lose')
            playerXSocket.disconnect();
            playerOSocket.disconnect();
            delete gamesInProgress[game.id]
        }
        if (nextGameState === CATS_GAME) {
            playerXSocket.emit('tie')
            playerOSocket.emit('tie')
            playerXSocket.disconnect();
            playerOSocket.disconnect();
            delete gamesInProgress[game.id]
        }
    })
})

const PORT = process.env.PORT || 8080

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})