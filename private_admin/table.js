
//for making the table
function writeCell(row, text, header = false) {
    const cell = document.createElement(header ? "th" : "td")
    const cellText = document.createTextNode(text)
    cell.appendChild(cellText)
    row.appendChild(cell)
}
function writeTable() {
    const divThing = document.getElementById("playerList")
    //removing previous table
    document.getElementById('currtable').remove()
    //making table with id
    const tbl = document.createElement("table")
    const tblBody = document.createElement("tbody")
    tbl.id = 'currtable'
    //making header
    const head = document.createElement("tr")
    writeCell(head, 'Player ID')
    writeCell(head, 'Name')
    writeCell(head, 'Eliminated')
    tblBody.appendChild(head)
    // creating all cells
    for (let i = 0; i < playerList.length; i++) {
        const row = document.createElement("tr")
        writeCell(row, playerList[i].id)
        writeCell(row, playerList[i].name)
        if (!playerList[i].eliminated) {
            writeCell(row, 'still in')
        } else {
            writeCell(row, 'eliminated')
        }

        tblBody.appendChild(row)
    }
    tbl.appendChild(tblBody)
    divThing.appendChild(tbl)
}

function writeTabletwo() {
    const divThing = document.getElementById("controlPanel")
    //removing previous table
    document.getElementById('rollingTotalVote').remove()
    //making table with id
    const tbl = document.createElement("table")
    const tblBody = document.createElement("tbody")
    tbl.id = 'rollingTotalVote'
    //making header
    const head = document.createElement("tr")
    writeCell(head, 'A', true)
    writeCell(head, 'B', true)
    writeCell(head, 'C', true)
    writeCell(head, 'D', true)
    tblBody.appendChild(head)
    // creating all cells
    const row = document.createElement("tr")
    writeCell(row, voteList.A)
    writeCell(row, voteList.B)
    writeCell(row, voteList.C)
    writeCell(row, voteList.D)

    tblBody.appendChild(row)
    tbl.appendChild(tblBody)
    divThing.appendChild(tbl)
}