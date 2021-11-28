const socket = io()

socket.on('connect', () => {
    socket.emit('admin-connect', "lol", (players, gameActive) => {
        getPlayers(players)
        if (gameActive) {
            roundStart.disabled = false
        }
    })
})
socket.on('update-admin-list', (players, votes) => {
    voteList = votes
    getPlayers(players)
    writeTabletwo()
    updateData()
})

socket.on('finished-voting', ()=> {
    roundStart.disabled = false
    updateData()
    writeTabletwo()
})

var playerList = []
var voteList = {
    A: 0,
    B: 0,
    C: 0,
    D: 0
}

const gameStart = document.getElementById('gameStart')
const roundStart = document.getElementById('roundStart')
const gameRestart = document.getElementById('gameRestart')

const numberPlayers = document.getElementById('numberPlayers')
const currentPlaying = document.getElementById('currentPlaying')
const currentVoted = document.getElementById('currentVoted')

function getPlayers(players) {
    playerList = players
    writeTable()
}

function startGame() {
    socket.emit('start-game')
    roundStart.disabled = false
}
function startRound() {
    socket.emit('start-round')
    currentVoted.innerText = `Number how have voted (for this round): 0`
    voteList = {
        A: 0,
        B: 0,
        C: 0,
        D: 0
    }
    writeTabletwo()
    roundStart.disabled = true

}
function updateData() {
    numberPlayers.innerText = `Number of Players : ${playerList.length}`
    let counter = 0
    playerList.forEach(player => {
        if (!player.eliminated) counter++
    })
    currentPlaying.innerText = `Currently still part of the game: ${counter}`
    const voteCount = [...Object.values(voteList)].reduce((a, b) => a + b, 0)
    currentVoted.innerText = `Number how have voted (for this round): ${voteCount}`
}

gameStart.addEventListener('click', () => startGame())
roundStart.addEventListener('click', () => startRound())
gameRestart.addEventListener('dblclick', () => socket.emit('restart-game'))