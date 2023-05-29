class RedSevenJudge
{
    constructor() {
        this.newGame()
    }

    newGame() {
        this.reset()
        this.shuffleDeck()

        for (let i = 1; i <= 4; i++) {
            const handle = document.getElementById("player" + String(i))

            this.addPlayer(handle)
        }
    }

    checkWinner() {

    }

    reset() {
        this.deck = []

        for (const color in Card.colors) {
            for (let rank = 1; rank <= 7; rank++) {
                this.deck.push(new Card(rank, Card.colors[color]))
            }
        }
        this.canvas = []
        this.players = []
    }

    addPlayer(handle) {
        console.assert(this.deck.length >= 8, "Can't add player without 7 cards in deck")

        const startingHand = this.deck.slice(-7)
        const startingPalette = this.deck.slice(-8, -7)

        this.deck = this.deck.slice(0, -8)
        this.players.push(new Player(startingHand, startingPalette, handle))
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            let tmp = this.deck[i]
            this.deck[i] = this.deck[j]
            this.deck[j] = tmp
        }
    }
}


class Player {
    #cardsInHand = []
    #cardsInPalette = []
    DOMhandle = null

    constructor(hand, palette, DOMhandle) {
        this.DOMhandle = DOMhandle

        console.log('Player constructor')

        this.cardsInHand = hand
        this.cardsInPalette = palette
    }

    /** @param {array} value */
    set cardsInHand(value) {
        this.#cardsInHand = value
        this.DOMhandle.getElementsByClassName("hand")[0].innerHTML = "hand: " + value.map(card => card.toString()).join(' ')
    }

    get cardsInHand() {
        return this.#cardsInHand
    }

    /** @param {array} value */
    set cardsInPalette(value) {
        this.#cardsInPalette = value
        this.DOMhandle.getElementsByClassName("palette")[0].innerHTML = "palette: " + value.map(card => card.toString()).join(' ')
    }

    get cardsInPalette() {
        return this.#cardsInPalette
    }

    getWinningCards(rule) {
        switch(rule) {
            case "highest card":
                return this.cardsInPalette[0]
            case "cards of one number":
                return this.getSameCards()
            case "cards of one color":
                return this.getSameColor()
            case "even cards":
                return this.cardsInPalette.filter(card => card[0] % 2 === 0)
            case "cards of different colors":
            case "cards below four":
                return this.cardsInPalette.filter(card => card[0] < 4)
            case "cards that form a run":
                return []
        }
    }

    getSameCards() {
        // count number of cards of each rank
        const count = { }
        this.cardsInPalette.forEach(card => count[card[0]] = count[card[0]] ? count[card[0]] + 1 : 1)

        // choose the rank with highest number of cards, then with higher rank if its a draw
        const mostCards = {
            count: 0,
            rank: null
        }
        for (const card in count) {
            if (count[card] > mostCards.count) {
                mostCards.count = count[card]
                mostCards.rank = card
            } else if (count[card] === mostCards.count && card > mostCards.rank) {
                mostCards.count = count[card]
                mostCards.rank = card
            }
        }

        return this.cardsInPalette.filter(card => card[0] === mostCards.rank)
    }

    getSameColor() {
        const count = { }
        this.cardsInPalette.forEach(card => count[card[1]] = count[card[1]] ? count[card[1]] + 1 : 1)

        const mostCards = {
            count: 0,
            color: null
        }


    }
}

class Card
{
    static colors = {
        "R": "red",
        "O": "orange",
        "Y": "yellow",
        "G": "green",
        "B": "blue",
        "I": "indigo",
        "V": "violet",
    }

    static colorOrder = [
        "V",
        "I",
        "B",
        "G",
        "Y",
        "O",
        "R",
    ]

    rank
    color

    constructor(rank, color) {
        this.rank = rank
        this.color = color
    }

    isHigher(otherCard) {
        if (this.rank !== otherCard.rank) {
            return this.rank > otherCard.rank
        }

        return this.color
    }

    getImg() {
        return this.rank + this.colors[this.color] + '.png'
    }

    toString() {
        return `[${this.rank} ${this.color}]`
    }
}

/* test code */
const judge = new RedSevenJudge()
