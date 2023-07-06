class Card {
    constructor(image) {
      this.image = image;
      this.isFlipped = false;
      this.element = document.createElement("div");
      this.element.classList.add("card");
      this.element.style.backgroundImage = `url('images/n-card-cover.png')`;
      this.element.connectedCard = this;
    }
  
    flip() {
      this.isFlipped = !this.isFlipped;
      this.element.style.backgroundImage = `url('images/${this.isFlipped ? this.image : "n-card-cover.png"}')`;
    }
  
    disconnectFromDOM() {
      this.element.connectedCard = null;
    }
  }
  
  class Deck {
    constructor() {
      this.cardsImages = [
        "n1.png", "n2.png", "n3.png", "n4.png", "n5.png", "n6.png",
        "n7.png", "n8.png", "n9.png", "n10.png"
      ];
      this.cards = [];
      this.initializeCards();
    }
  
    initializeCards() {
      this.cards = this.cardsImages.flatMap((image) => {
        return [new Card(image), new Card(image)];
      });
      this.shuffle();
    }
  
    shuffle() {
      for (let i = this.cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
      }
    }
  
    removeCard(card) {
      const index = this.cards.indexOf(card);
      if (index !== -1) {
        this.cards.splice(index, 1);
        card.disconnectFromDOM();
      }
    }
  }
  
  class GameManager {
    constructor(board, score) {
      this.boardElement = document.querySelector(board);
      this.scoreElement = document.querySelector(score);
      this.startGameButton = document.querySelector("#startGame");
      this.deck = new Deck();
      this.firstCard = null;
      this.secondCard = null;
      this.attemptNumber = 0;
  
      this.boardElement.addEventListener("click", this.selectCard.bind(this));
      this.startGameButton.addEventListener("click", this.startGame.bind(this));
    }
  
    startGame() {
      this.attemptNumber = 0;
      this.deck = new Deck();
      this.boardElement.innerHTML = "";
      this.shuffleAndDeal();
    }
  
    shuffleAndDeal() {
      this.deck.shuffle();
      this.deck.cards.forEach((card) => {
        this.boardElement.appendChild(card.element);
      });
    }
  
    selectCard(e) {
      const clickedCard = e.target.connectedCard;
      if (!clickedCard || !clickedCard instanceof Card) return;
  
      clickedCard.flip();
      clickedCard.element.classList.add('flipped');
  
      if (this.firstCard && this.secondCard) {
        this.firstCard.flip();
        this.secondCard.flip();
        this.firstCard = null;
        this.secondCard = null;
      }
  
      if (!this.firstCard) {
        this.firstCard = clickedCard;
      } else if (!this.secondCard) {
        this.attemptNumber++;
        this.secondCard = clickedCard;
  
        if (this.firstCard.image === this.secondCard.image) {
          this.deck.removeCard(this.firstCard);
          this.deck.removeCard(this.secondCard);
          this.firstCard = null;
          this.secondCard = null;
        }
      }
  
      this.scoreElement.textContent = this.attemptNumber;
    }
  }
  
  const board = "#board";
  const score = "#atemptNumOutput";
  const startGameButton = "#startGame";
  
  const gm = new GameManager(board, score);
  gm.startGame();
  