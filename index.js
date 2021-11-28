const express = require('express')
const path = require('path')
const http = require('http')
const PORT = process.env.PORT || 3000
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname, "public")))
app.use('/admin', express.static(path.join(__dirname, "private_admin")))
app.use('/spectator', express.static(path.join(__dirname, "spectator")))

server.listen(PORT, () => console.log(`Server Running on ${PORT}`))

const playerList = []
var gameActive = false

const votes = {
    A: 0,
    B: 0,
    C: 0,
    D: 0
}

var numPlayers = 0
var totalCountedVotes = 0

io.on("connection", socket => {
    socket.on('enter-game', (name, cb) => {
        if (!gameActive) {
            playerList.push({ name, id: socket.id, eliminated: false })
            socket.join('inGame')
            cb()
            updateAdminList()
        } else {
            socket.emit('game-crrently-active')
        }
    })

    socket.on('vote-send', vote => {
        votes[vote]++
        totalCountedVotes++
        updateAdminList()
        if (totalCountedVotes === numPlayers) {

            let sortable = []

            // turn obj votes into an array
            for (const vote in votes) {
                sortable.push([vote, votes[vote]]);
            }
            sortable.sort((a, b) => {
                return a[1] - b[1]
            })

            // place all non-zero votes into a
            const possibleWinners = []
            for (let i = 0; i < sortable.length; i++) {
                const letter = sortable[i];
                if (letter[1] > 0) {
                    possibleWinners.push(sortable[i])
                }
            }
            // checking of ties compared to the lowest
            sortable = possibleWinners
            const lowest = sortable[0][1]
            const loserList = [sortable[0][0]]
            let foundTie = false
            for (let i = 1; i < sortable.length; i++) {
                const letter = sortable[i]
                if (letter[1] === lowest) {
                    foundTie = true
                    loserList.push(letter[0])
                    console.log("found tie", loserList)
                }
            }
            if (foundTie) {
                io.in('inGame').emit('tied-losers', loserList)
                console.log();
            } else if (sortable.length === 1) {
                io.in('inGame').emit('unanimous')
            } else {
                io.in('inGame').emit('reveal-losers', sortable[0][0])
            }
            io.emit('finished-voting', votes)
        }
    })

    socket.on('lost-round', () => {
        playerList.forEach(player => {
            if (player.id === socket.id) {
                player.eliminated = true
                socket.leave('inGame')
                updateAdminList()
            }
        })
    })

    // all admin-related events
    socket.on('admin-connect', (lol, cb) => {
        cb(playerList, gameActive)
    })
    socket.on('start-game', () => {
        gameActive = true
        io.to('inGame').to('spectators').emit('game-started')
    })
    socket.on('start-round', () => {
        io.to('inGame').to('spectators').emit('round-started')
        votes.A = 0
        votes.B = 0
        votes.C = 0
        votes.D = 0
        totalCountedVotes = 0
        numPlayers = 0
        playerList.forEach(player => {
            if (!player.eliminated) {
                numPlayers++
            }
        })
    })
    socket.on('restart-game', () => {
        playerList.length = 0
        gameActive = false
        votes.A = 0
        votes.B = 0
        votes.C = 0
        votes.D = 0
        totalCountedVotes = 0
        numPlayers = 0
        io.emit('force-restart-game')
        updateAdminList()
    })

    // all spectator-related ones
    socket.on('spectate-connected', () => {
        socket.join('spectators')
    })
})

function updateAdminList() {
    io.emit('update-admin-list', playerList, votes)
}