//Find the element with ID = Game in the linked html. Save it as game
const game = document.getElementById('game')
const scoreDisplay = document.getElementById('score')
let score = 0


const genre_list = [{
        name: 'Film',
        id: 11
    },
    {
        name: 'Books',
        id: 10
    },
    {
        name: 'Video Games',
        id: 15
    },
    {
        name: 'Geography',
        id: 22
    }
]

const levels = ['easy', 'medium', 'hard']

function addGenre(genre) {
    // Create elelemtn in Javascript
    const column = document.createElement('div')

    column.classList.add('genre-column')
    column.innerHTML = genre.name
    game.append(column)


    levels.forEach(level => {
        //Create a div for the card. 
        // Added the style of card from CSS
        // Appended it to a column
        const card = document.createElement('div')
        card.classList.add('card')
        column.append(card)


        // Points & Score

        if (level === 'easy') {
            card.innerHTML = 100
        }
        if (level === 'medium') {
            card.innerHTML = 200
        }
        if (level === 'hard') {
            card.innerHTML = 300
        }


        fetch(`https://opentdb.com/api.php?amount=1&category=${genre.id}&difficulty=${level}&type=boolean`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                card.setAttribute('data-question', data.results[0].question)
                card.setAttribute('data-answer', data.results[0].correct_answer)
                card.setAttribute('data-value', card.getInnerHTML())
                card.setAttribute('answered', 'No')
            })
            .then(done => card.addEventListener('click', flipCard))
            // Add event listener to card.
            // Uppon click, execute a function called 'flipCard'

    })
}

// For each genre in gerne list add its questions
genre_list.forEach(genre => addGenre(genre))

function flipCard() {

    if (this.getAttribute('answered') === 'No') {

        //Change Font
        this.innerHTML = ''
        this.style.fontSize = '15px'

        const textDisplay = document.createElement('div')
        const trueButton = document.createElement('button')
        const falseButton = document.createElement('button')
            //
        trueButton.innerHTML = 'True'
        trueButton.classList.add('button')
        trueButton.addEventListener('click', getResult)

        //
        falseButton.innerHTML = 'False'
        falseButton.classList.add('button')
        falseButton.addEventListener('click', getResult)
            //
        textDisplay.innerHTML = this.getAttribute('data-question')

        //WHen a card is clicked these will get appended regardless of card
        this.append(textDisplay, trueButton, falseButton)

        //disable event listener after click
        const allCards = Array.from(document.querySelectorAll('.card'))
        allCards.forEach(card => card.removeEventListener('click', flipCard))
    }
}




function getResult() {

    //Unlock cards after
    const allCards = Array.from(document.querySelectorAll('.card'))
    allCards.forEach(card => card.addEventListener('click', flipCard))

    const parent_card = this.parentElement

    if (parent_card.getAttribute('data-answer') === this.innerHTML) {
        console.log("Correct Answer")
        score = score + parseInt(parent_card.getAttribute('data-value'))
        scoreDisplay.innerHTML = score
        parent_card.classList.add('correct-answer')

        //Loop to clear card of all it's children
        clearCard(parent_card, true)

    } else {
        parent_card.classList.add('wrong-answer')
        clearCard(parent_card, false)

    }

    parent_card.removeEventListener('click', flipCard)
    parent_card.setAttribute('answered', 'Yes')

}


function clearCard(card, boolean) {
    setTimeout(() => {
        while (card.firstChild) {
            card.removeChild(card.lastChild)
        }
        card.innerHTML = card.getAttribute('data-value')

        if (boolean === false) {
            card.innerHTML = 0
        }
    }, 100)
}