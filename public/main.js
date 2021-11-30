const socket = io()

socket.on('connect', () => {
    console.log(socket.id)
})
socket.on('game-crrently-active', () => {
    gameOnGoing()
})
socket.on('game-started', () => {
    mainWords.innerText = "game has started.\n Waiting for a round to start..."
})
socket.on('round-started', () => {
    roundStart()
})
socket.on('reveal-losers', letter => {
    if (savedVote === '') {
        lostOnTime()
        return
    }
    if (letter === savedVote) {
        lost()
        socket.emit('lost-round')
    } else {
        won()
    }
})
socket.on('tied-losers', loserList => {
    if (savedVote === '') {
        lostOnTime()
        return
    }
    let voteTied = false
    for (let i = 0; i < loserList.length; i++) {
        const letter = loserList[i];
        if (letter === savedVote) {
            voteTied = true
        }
    }
    if (voteTied) {
        tied()
    } else {
        won()
    }
})
socket.on('unanimous', () => {
    if (savedVote === '') {
        lostOnTime()
        return
    }
    unanimous()
})
socket.on('force-restart-game', () => location = location)
socket.on('resend-info', () => {
    socket.emit('info-resend', { name: playerName, vote: savedVote, eliminated })
    console.log('test');
})
socket.on('lost-in-time', () => {
    lostOnTime()
})

//name things
const nameHolder = document.getElementById('nameHolder')
const nameInput = document.getElementById('nameInput')
const nameButton = document.getElementById('nameButton')
//h1 thing
const mainWords = document.getElementById('mainWords')
//buttons things
const mainButtons = document.getElementById("mainButtons")
const buttonList = [...mainButtons.children]
// global vars stuff
var savedVote = ''
var playerName = ''
var eliminated = false
var submittedNameRecently = false

function gameOnGoing() {
    nameHolder.classList.toggle('hidden')
    mainWords.classList.toggle('hidden')
    mainWords.innerText = "Game ongoing, you cannot currently join. :("
}

function joinGame() {
    mainButtons.classList.toggle('hidden')
    mainWords.classList.toggle('hidden')
    nameHolder.classList.toggle('hidden')
}

function roundStart() {
    mainButtons.disabled = false
    savedVote = ''
    mainButtons.classList.toggle('disabled')
    buttonList.forEach(button => {
        button.disabled = false
    })
    mainWords.innerText = "vote!"
    buttonList.forEach(button => {
        button.classList.remove('selected')
    });
}

function voted(vote) {
    savedVote = vote
    mainButtons.disabled = true
    buttonList.forEach(button => {
        button.disabled = true
    })
    mainButtons.classList.toggle('disabled')
    mainWords.innerText = "waiting for results..."
    document.getElementById(vote).classList.toggle('selected')
    socket.emit('vote-send', vote)
}

function submitName() {
    if (submittedNameRecently) {
        alert("please wait 5 seconds. if the page hasn't changed, re-enter")
    } else if (nameInput.value) {
        socket.volatile.emit('enter-game', nameInput.value, () => joinGame())
    } else {
        alert('please enter a name. hmp.')
    }
    playerName = nameInput.value
    submittedNameRecently = true
    setTimeout(() => {
        submittedNameRecently = false
    }, 5000)
}

function lost() {
    mainButtons.classList.toggle('hidden')
    mainWords.innerText = `You lost!\n You voted the least popular option. :(`
    eliminated = false
}

function won() {
    mainWords.innerText = "You passed this round!\n You didn't vote the least popular option.\n"
}

function tied() {
    mainWords.innerText = "You voted for one of the least popular choices.\n Lucky for you, there was a tie..."
}

function lostOnTime() {
    if (savedVote === '') {
        mainWords.innerText = "You didn't vote in time. :<"
        mainButtons.disabled = true
        buttonList.forEach(button => {
            button.disabled = true
        })
        mainButtons.classList.add('disabled')
        socket.emit('lost-round')
    }
}

function unanimous() {
    mainWords.innerText = "You passed this round!\n Everyone voted unanimously. \n:)"
}
nameInput.addEventListener('keyup', e => {
    if (e.key === "Enter") submitName()
})

nameButton.addEventListener('click', submitName)

buttonList.forEach(button => {
    button.addEventListener('click', () => {
        voted(button.value)
        console.log(button.value)
    })
});
