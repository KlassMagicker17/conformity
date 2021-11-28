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
    if(letter === savedVote) {
        lost()
        socket.emit('lost-round')
    } else {
        won()
    }
})

socket.on('tied-losers', loserList => {
    let voteTied = false
    for (let i = 0; i < loserList.length; i++) {
        const letter = loserList[i];
        if(letter === savedVote) {
            voteTied = true
        }
    }
    if(voteTied) {
        tied()
    } else {
        won()
    }
})

socket.on('unanimous', () => {
    unanimous()
})

socket.on('force-restart-game',() => location = location)

//name things
const nameHolder = document.getElementById('nameHolder')
const nameInput = document.getElementById('nameInput')
const nameButton = document.getElementById('nameButton')
//h1 thing
const mainWords = document.getElementById('mainWords')
//buttons things
const mainButtons = document.getElementById("mainButtons")
const buttonList = [... mainButtons.children]

var savedVote = ''


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
    mainButtons.classList.toggle('disabled')
    buttonList.forEach(button => {
        button.disabled = false
    })
    mainWords.innerText = "vote!"
    buttonList.forEach(button => {
        button.style.removeProperty('opacity')
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
    document.getElementById(vote).style.opacity = 1
    socket.emit('vote-send', vote)
}

function lost() {
    mainButtons.classList.toggle('hidden')
    mainWords.innerText = `You lost!\n You voted the least popular option. :(`
}

function won() {
    mainWords.innerText = "You passed this round!\n You didn't vote the least popular option.\n"
}

function tied() {
    mainWords.innerText = "You voted for one of the least popular choices.\n Lucky for you, there was a tie..."
}

function unanimous() {
    mainWords.innerText = "You passed this round!\n Everyone voted unanimously. \n:)"
}

nameInput.addEventListener('keyup', e => {
    if(e.key === "Enter") {
        if (nameInput.value) {
            socket.emit('enter-game', nameInput.value, () => joinGame())
        } else {
            alert('please enter a name. hmp.')
        }
    }
})

nameButton.addEventListener('click', e => {
    if (nameInput.value) {
        socket.emit('enter-game', nameInput.value, () => joinGame())
    } else {
        alert('please enter a name. hmp.')
    }
})

buttonList.forEach(button => {
  button.addEventListener('click', () => {
      voted(button.value)
  })      
});