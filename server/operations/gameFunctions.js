var decks = {
  'Star Wars': require('./../decks/star_wars'),
  'Hobbit': require('./../decks/hobbit')
};

module.exports = {

  randomizeTurns: function(numberOfPlayers) {
    var players = [];

    for (var i = 0; i < numberOfPlayers; i++)
      players.push(i);

    var newPlayers = [];
    var playersLength = players.length;

    for (var j = 0; j < playersLength; j++) {
      newPlayers.push(players.splice(Math.floor(Math.random() * players.length), 1)[0]);
    }

    return newPlayers;
  },

  shuffleCards: function(theme) {
    var deck = decks[theme].map(function(item){return item;});

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

  removeTurn: function(game, targetIndex, userIndex) {
    var before = false;

    for (var j = 0; j < game.turnOrder.length; j++) {
      // See if target comes before user or is equal to user
      if (userIndex === game.turnOrder[j]) before = true;

      // Remove Player
      if (targetIndex === game.turnOrder[j]) {
        game.turnOrder.splice(j, 1);

        if (before) game.currentTurn--;
      }
    }

    return game;
  },

  nextTurn: function(game) {
    if (game.currentTurn >= game.turnOrder.length - 1) game.currentTurn = 0;
    else game.currentTurn++;

    game.players[game.turnOrder[game.currentTurn]].hand.push(game.deck.splice(0, 1)[0]);

    return game;
  },

  newRound: function(game) {
    // Reset Variables
    game.turnOrder = game.constTurnOrder.map(function(item){return item;});
    game.round++;
    game.extraCard = null;

    // Choose who starts the next round based on round winner
    for (var i = 0; i < game.players.length; i++) {
      // Clear Hand
      game.players[i].hand = [];
      game.players[i].deck = [];

      // Find Round Winner
      if (game.roundWinner === game.players[i].player) {

        // Find player in turnOrder
        for (var j = 0; j < game.turnOrder.length; j++) {
          if (game.turnOrder[j] === i) {

            // Set Current Turn to next player
            if (j >= game.turnOrder.length) game.currentTurn = 0;
            else game.currentTurn = j + 1;
          }
        }
      }
    }

    // Shuffle Deck
    var deck = this.shuffleCards(game.theme);

    // Deal Cards
    game = this.dealCards(game);

    // Return Game for New Round
    return game;
  },

  checkForRoundWin: function(game) {
    // Check if one player is left
    if (game.turnOrder.length === 1) {
      game.roundWinner = game.players[game.turnOrder[0]].player;
      game.players[game.turnOrder[0]].vp++;
      return game;
    }

    // Check to see if deck is gone
    else if (game.deck.length < 1) {
      var highest = [{
        player: game.players[game.turnOrder[0]].player,
        power: game.players[game.turnOrder[0]].hand[0].power,
        index: game.turnOrder[0],
        total: this.calculateHandTotal(game.players[game.turnOrder[0]])
      }];

      // Find who is the Highest
      for (var i = 1; i < game.turnOrder.length; i++) {
        var currentPlayer = game.players[game.turnOrder[i]];
        var handPower = currentPlayer.hand[0].power;

        if (handPower > highest[0].power)
          highest = [{
            player: currentPlayer.player,
            power: handPower,
            index: game.turnOrder[i],
            total: this.calculateHandTotal(currentPlayer)
          }];
        else if (handPower === highest[0].power)
          highest.push({
            player: currentPlayer.player,
            power: handPower,
            index: game.turnOrder[i],
            total: this.calculateHandTotal(currentPlayer)
          });
      }

      // If only one player, Return Game
      if (highest.length === 1) {
        game.roundWinner = highest[0].player;
        game.players[highest[0].index].vp++;
        return game;
      }

      // If there is a tie, compare hands and return game
      else {
        var winner = highest[0];

        for (var j = 1; j < highest.length; j++) {
          if (highest[j].total > winner.total)
            winner = highest[j];

          // If there is a tie, return 'tie'
          else if (highest[j].total === winner.total);
          return 'tie';
        }

        // Return winner
        game.roundWinner = winner.player;
        game.players[winner.index].vp++;
        return game;
      }
    }

    // Return nothing if no round win
    else return null;
  },

  calculateHandTotal: function(player) {
    var total = player.hand[0].power;

    for (var i = 0; i < array.length; i++) {
      total += player.discard[i].power;
    }

    return total;
  },

  checkForGameWin: function(game) {
    for (var i = 0; i < game.players.length; i++) {
      if (game.players[i].vp === game.maxVp) return game.players[i];
    }
    return null;
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
      });
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
