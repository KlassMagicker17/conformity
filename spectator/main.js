const socket = io()

socket.on('connect', () => {
    socket.emit('spectate-connected')
})

socket.on('game-started', () => {
    wordsChange('game has started. waiting for round...')
})

socket.on('round-started', () => {
    document.getElementById('A').innerText = `A\n ?`
    document.getElementById('B').innerText = `B\n ?`
    document.getElementById('C').innerText = `C\n ?`
    document.getElementById('D').innerText = `D\n ?`
    wordsChange('waiting for everyone to vote...')
    roundActive = true
})

socket.on('finished-voting', voteList => {
    roundActive = false
    document.getElementById('A').innerText = `A\n${voteList.A}`
    document.getElementById('B').innerText = `B\n${voteList.B}`
    document.getElementById('C').innerText = `C\n${voteList.C}`
    document.getElementById('D').innerText = `D\n${voteList.D}`
    wordsChange('Votes are IN!')
})

socket.on('update-spectator', gameActive => {
    if (gameActive) wordsChange('game has started. waiting for round...')
})

//h1 thing
const mainWords = document.getElementById('mainWords')
//buttons things
const mainThing = document.getElementById("mainThing")
const letterList = [...mainThing.children]
// rolling lol
var roundActive = false

function wordsChange(words) {
    mainWords.innerText = words
}

setInterval(() => {
    if(roundActive) {
        document.getElementById('A').innerText = `A\n${Math.floor(Math.random()*30)}`
        document.getElementById('B').innerText = `B\n${Math.floor(Math.random()*30)}`
        document.getElementById('C').innerText = `C\n${Math.floor(Math.random()*30)}`
        document.getElementById('D').innerText = `D\n${Math.floor(Math.random()*30)}`
    }
}, 100);
