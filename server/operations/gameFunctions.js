var StarWars = require('./../decks/star_wars'),
    Hobbit = require('./../decks/hobbit');

module.exports = {

  randomizeTurns: function(numberOfPlayers) {
    var players = [];

    for (var i = 0; i < numberOfPlayers; i++)
      players.push(i);

    var newPlayers = [];
    var playersLength = players.length;

    for (var i = 0; i < playersLength; i++) {
      newPlayers.push(players.splice(Math.floor(Math.random() * players.length), 1)[0]);
    }

    return newPlayers;
  },

  shuffleCards: function(theme) {
    if (theme === 'Star Wars') var deck = StarWars.map(function(item) {
      return item;
    });
    if (theme === 'Hobbit') var deck = Hobbit.map(function(item) {
      return item;
    });

    var newDeck = [];
    var deckLength = deck.length;
    for (var i = 0; i < deckLength; i++) {
      newDeck.push(deck.splice(Math.floor(Math.random() * deck.length), 1)[0]);
    }

    return newDeck;
  },

  dealCards: function(game) {
    for (var i = 0; i < game.players.length; i++)
      game.players[i].hand.push(game.deck.splice(0, 1)[0]);

    game.extraCard = game.deck.splice(0, 1)[0];

    return game;
  },

  removeTurn: function(game, i) {
    for (var j = 0; j < game.turnOrder.length; j++) {
      if (i === game.turnOrder[j]) {
        game.turnOrder.splice(j, 1);
      }
    }

    return game;
  },

  makeGame: function(players, theme) {
    var game = {
      playerCount: players.length,
      players: []
    };

    for (var i = 0; i < players.length; i++) {
      game.players.push({
        player: players[i],
        vp: 0,
        hand: [],
        discard: []
      })
    }

    if (game.playerCount === 2) game.maxVp = 7;
    else if (game.playerCount === 3) game.maxVp = 5;
    else if (game.playerCount === 4) game.maxVp = 4;
    else return null;

    game.constTurnOrder = this.randomizeTurns(game.playerCount);
    game.turnOrder = game.constTurnOrder;

    game.deck = this.shuffleCards(theme);

    game.theme = theme;

    game = this.dealCards(game);

    return game;
  }
};
