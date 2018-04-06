(function(){

    'use strict';

    window.mainJsCore = {
        // Create a list that holds all of your cards
        cardIcons: [
            'fa-diamond',
            'fa-paper-plane-o',
            'fa-anchor',
            'fa-bolt',
            'fa-cube',
            'fa-anchor',
            'fa-leaf',
            'fa-bicycle',
            'fa-diamond',
            'fa-bomb',
            'fa-leaf',
            'fa-bomb',
            'fa-bolt',
            'fa-bicycle',
            'fa-paper-plane-o',
            'fa-cube'
        ],

        // Get Elements
        deck: document.getElementsByClassName('deck')[0],
        stars: document.getElementsByClassName('stars')[0],
        moves: document.getElementsByClassName('moves')[0],
        gameTime: document.getElementsByClassName('game-time')[0],
        restartBtn: document.getElementsByClassName('restart')[0],
        modal: document.getElementsByClassName('modal')[0],
        successMessage: document.getElementsByClassName('success-sub-msg')[0],
        playAgain: document.getElementsByClassName('play-again')[0],

        // init var
        openCards: [],
        matchedCards: [],
        moveCounter: 0,
        message: '',
        starNum: 3,
        starResultHtml: '',
        startDate: null,
        finalTime: 0,
        timerID: null,
        firstClick: true,

        // Constructor
        initialize: function() {
            let self = this;
            document.addEventListener('DOMContentLoaded',function() {
                self.build();
                self.events();
            });
        },

        // Build page elements, plugins init
        build: function() {
            let self = this;
            self.resetGame();
        },

        // Set page events
        events: function() {
            let self = this;
            // Deck Event
            self.deck.addEventListener('click', function(e) {
                let event = e || window.event;
                let target = event.target || event.srcElement;
                if (target.nodeName.toLocaleLowerCase() === 'li' && !self.hasClass(target, 'open')) {
                    if (self.firstClick) {
                        // Time Counter
                        self.startDate = new Date();
                        self.timerID = setInterval(function() {
                            self.finalTime = Math.round((new Date() - self.startDate)/1000);
                            self.gameTime.innerHTML = self.finalTime;
                        }, 1000);

                        self.firstClick = false;
                    }

                    self.displayCardSymbol(target);
                    self.addCardToOpenCards(target);
                    if (self.openCards.length === 2) {
                        self.showMoveCounter();
                        self.openCards[0].innerHTML === target.innerHTML ? self.lockMatchedCard() : self.hideCardSymbol();
                    }
                }
            })
            // Reset Event
            self.restartBtn.addEventListener('click', function() {
                self.resetGame();
            })

            self.playAgain.addEventListener('click', function() {
                self.modal.className = 'modal';
                self.resetGame();
            })
        },

        // Reset All Game Data
        resetGame: function() {
            let self = this;
            clearInterval(self.timerID);
            self.openCards = [];
            self.matchedCards = [];
            self.moveCounter = 0;
            self.message = '';
            self.starNum = 3;
            self.startDate = null;
            self.finalTime = 0;
            self.timerID = null;
            self.firstClick = true;
            self.starResultHtml = '';
            self.moves.innerHTML = '0';
            self.deck.innerHTML = '';
            self.stars.innerHTML = '<li><i class="fa fa-star"></i></li> <li><i class="fa fa-star"></i></li> <li><i class="fa fa-star"></i></li>';
            self.successMessage.innerHTML = 'With #{move} moves in #{time} seconds #{stars}.';
            self.gameTime.innerHTML = '0';
            self.shuffleCards(self.cardIcons);
        },

        /**
         * shuffleCards - shuffle ALL Cards
         * @param {array} arr - Card Icon Class Array
         */
        shuffleCards: function(arr) {
            this.shuffle(arr);
            let str = '';
            for(let i = 0; i < arr.length; i++) {
                str += `<li class="card"><i class="fa ${arr[i]}"></i></li>\n`;
            }
            this.deck.insertAdjacentHTML('afterbegin', str);
        },

        /**
         * showMoveCounter - Show Move Counter
         */
        showMoveCounter: function() {
            let self = this;
            self.moves.innerHTML = '';
            self.moveCounter++;

            if (self.moveCounter > 10 && self.moveCounter < 20) {
                self.starNum = 2;
                self.stars.innerHTML = `<li><i class="fa fa-star"></i></li>
                    <li><i class="fa fa-star"></i></li>`;
            } else if (self.moveCounter >= 20) {
                self.starNum = 1;
                self.stars.innerHTML = `<li><i class="fa fa-star"></i></li>`;
            } else {
                self.starNum = 3;
            }

            self.moves.insertAdjacentHTML('afterbegin', self.moveCounter);
        },

        displayCardSymbol: function(el) {
            el.className += ' open show animated flipInY';
        },

        addCardToOpenCards: function(el) {
            this.openCards.push(el);
        },

        hideCardSymbol: function() {
            let self = this;
            self.openCards.forEach(function(card) {
                card.className = 'card open show error animated shake';
                setTimeout(function() {
                    card.className = 'card';
                }, 1000)
            })
            self.openCards = [];
        },

        lockMatchedCard: function() {
            let self = this;
            self.openCards.forEach(function(card) {
                card.className = 'card open match animated bounceIn';
                self.matchedCards.push(card);
            })
            self.isWin();
            self.openCards = [];
        },

        isWin: function() {
            let self = this;
            if (self.matchedCards.length === 16) {
                setTimeout(function() {
                    self.alertMessage();
                }, 500)
            }
        },

        /**
         * alertMessage - if win the game, alert the success information
         */
        alertMessage: function() {
            let self = this;
            if (self.starNum === 3) {
                self.starResultHtml = `<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i>`;
            } else if (self.starNum === 2) {
                self.starResultHtml = `<i class="fa fa-star"></i><i class="fa fa-star"></i>`;
            } else if (self.starNum === 1) {
                self.starResultHtml = `<i class="fa fa-star">`;
            }
            self.modal.className += ' active';
            self.message = self.successMessage.textContent.replace('#{move}', self.moveCounter);
            self.message = self.message.replace('#{stars}', self.starResultHtml);
            self.message = self.message.replace('#{time}', self.finalTime);
            self.successMessage.innerHTML = '';
            self.successMessage.insertAdjacentHTML('afterbegin', self.message);
        },

        // Utils
        /**
         * [hasClass description]
         * @param  {object}  el         - Which element do you want to check
         * @param  {string}  className  - What is the class name,
         * @return {Boolean}            - True or false
         */
        hasClass: function(el, className) {
            if (el.classList) {
                return el.classList.contains(className);
            } else {
                return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
            }
        },

        /**
         * shuffle - Shuffle function from http://stackoverflow.com/a/2450976
         * @param  {array} array - A Array
         * @return {array} - Return random Cards
         */
        shuffle: function(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;

            while (currentIndex !== 0) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        },
    }

    window.mainJsCore.initialize();
})();