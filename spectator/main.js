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
})

socket.on('finished-voting', voteList => {
    document.getElementById('A').innerText = `A\n${voteList.A}`
    document.getElementById('B').innerText = `B\n${voteList.B}`
    document.getElementById('C').innerText = `C\n${voteList.C}`
    document.getElementById('D').innerText = `D\n${voteList.D}`
    wordsChange('Votes are IN!')
})

//h1 thing
const mainWords = document.getElementById('mainWords')
//buttons things
const mainThing = document.getElementById("mainThing")
const letterList = [... mainThing.children]

function wordsChange(words) {
    mainWords.innerText = words
}
