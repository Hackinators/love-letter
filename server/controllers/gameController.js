// REQUIRE DEPENDENCIES
// ============================================================
var Game = require('./../models/Game'),
    User = require('./../models/User'),
    gameFunctions = require('./../operations/gameFunctions');

// SOCKET FUNCTIONS
// ============================================================
module.exports = function(socket) {

  // MAKE GAME
  socket.on('create', function(players) {
    var game = new Game(gameFunctions.makeGame(players, 'Star Wars'));
    game.save(function(err, newGame) {
      if (err) socket.emit('err', err);
      else socket.emit('game', game);
    });
  })

  // New Round
  socket.on('newRound', function() {

  });

  // CARD ZERO
  socket.on('zero', function(gameId, cardIndex){
    var userId = socket.handshake.session.passport.user;

    Game.findOne({_id: gameId}).exec(function(err, game) {
      if (err) return socket.emit('err', err);

      for (var i = 0; i < game.players.length; i++) {
        // Find Current Player
        if (game.players[i].player+'' === userId) {
          // Remove Protection
          game.players[i].protected = false;

          // Put Card in Discard
          game.players[i].discard.push(game.players[i].hand.splice(cardIndex, 1)[0]);
        }
      }

      // TODO: Check For Winner

      game.save(function(err, game) {
        if (err) return socket.emit('err', err);
        return socket.emit('game', game);
      })
    })
  });

  // CARD ONE
  socket.on('one', function(gameId, cardIndex, targetPlayer, guess){
    var userId = socket.handshake.session.passport.user;

    Game.findOne({_id: gameId}).exec(function(err, game) {
      if (err) return socket.emit('err', err);

      for (var i = 0; i < game.players.length; i++) {
        // Find Current Player
        if (game.players[i].player+'' === userId) {
          // Remove Protection
          game.players[i].protected = false;

          // Put Card in Discard
          game.players[i].discard.push(game.players[i].hand.splice(cardIndex, 1)[0]);
        }

        // Find Target Player
        if (game.players[i].player+'' === targetPlayer) {
          // Check for Card Match
          if (game.players[i].hand[0].name === guess) {
            // Remove Player from Round
            game = gameFunctions.removeTurn(game, i);
          }
        }
      }

      // TODO: Check For Winner

      game.save(function(err, game) {
        if (err) return socket.emit('err', err);
        return socket.emit('game', game);
      })
    })
  });

  // CARD TWO
  socket.on('two', function(gameId, cardIndex, targetPlayer, guess){
    var userId = socket.handshake.session.passport.user;

    Game.findOne({_id: gameId}).exec(function(err, game) {
      if (err) return socket.emit('err', err);

      for (var i = 0; i < game.players.length; i++) {
        // Find Current Player
        if (game.players[i].player+'' === userId) {
          // Remove Protection
          game.players[i].protected = false;

          // Put Card in Discard
          game.players[i].discard.push(game.players[i].hand.splice(cardIndex, 1)[0]);
        }
      }

      // TODO: Check For Winner

      game.save(function(err, game) {
        if (err) return socket.emit('err', err);
        return socket.emit('game', game);
      })
    })
  });

  // CARD THREE LOW
  socket.on('threelow', function(gameId, cardIndex, targetPlayer, guess){
    var userId = socket.handshake.session.passport.user;

    Game.findOne({_id: gameId}).exec(function(err, game) {
      if (err) return socket.emit('err', err);

      var userIndex;
      var targetIndex;

      for (var i = 0; i < game.players.length; i++) {
        // Find Current Player
        if (game.players[i].player+'' === userId) {
          // Remove Protection
          game.players[i].protected = false;

          // Put Card in Discard
          game.players[i].discard.push(game.players[i].hand.splice(cardIndex, 1)[0]);

          // Save User Index
          userIndex = i;
        }

        if (game.players[i].player+'' === targetPlayer) {
          // Save User Index
          targetIndex = i;
        }
      }

      // Compare Values
      if (game.players[userIndex].hand[0].power > game.players[targetIndex].hand[0].power)
        // Remove Target from Round
        game = gameFunctions.removeTurn(game, targetIndex);
      else if (game.players[userIndex].hand[0].power < game.players[targetIndex].hand[0].power)
        // Remove Player from Round
        game = gameFunctions.removeTurn(game, userIndex);


      // TODO: Check For Winner

      game.save(function(err, game) {
        if (err) return socket.emit('err', err);
        return socket.emit('game', game);
      })
    })
  });

  // CARD THREE HIGH
  socket.on('threehigh', function(gameId, cardIndex, targetPlayer, guess){
    var userId = socket.handshake.session.passport.user;

    Game.findOne({_id: gameId}).exec(function(err, game) {
      if (err) return socket.emit('err', err);

      var userIndex;
      var targetIndex;

      for (var i = 0; i < game.players.length; i++) {
        // Find Current Player
        if (game.players[i].player+'' === userId) {
          // Remove Protection
          game.players[i].protected = false;

          // Put Card in Discard
          game.players[i].discard.push(game.players[i].hand.splice(cardIndex, 1)[0]);

          // Save User Index
          userIndex = i;
        }

        if (game.players[i].player+'' === targetPlayer) {
          // Save User Index
          targetIndex = i;
        }
      }

      // Compare Values
      if (game.players[userIndex].hand[0].power < game.players[targetIndex].hand[0].power)
        // Remove Target from Round
        game = gameFunctions.removeTurn(game, targetIndex);
      else if (game.players[userIndex].hand[0].power > game.players[targetIndex].hand[0].power)
        // Remove Player from Round
        game = gameFunctions.removeTurn(game, userIndex);


      // TODO: Check For Winner

      game.save(function(err, game) {
        if (err) return socket.emit('err', err);
        return socket.emit('game', game);
      })
    })
  });

  // CARD FOUR
  socket.on('four', function(gameId, cardIndex, targetPlayer, guess){
    var userId = socket.handshake.session.passport.user;

    Game.findOne({_id: gameId}).exec(function(err, game) {
      if (err) return socket.emit('err', err);

      for (var i = 0; i < game.players.length; i++) {
        // Find Current Player
        if (game.players[i].player+'' === userId) {
          // Put Card in Discard
          game.players[i].discard.push(game.players[i].hand.splice(cardIndex, 1)[0]);

          // Give Player Protection
          game.players[i].protected = true;
        }
      }

      // TODO: Check For Winner

      game.save(function(err, game) {
        if (err) return socket.emit('err', err);
        return socket.emit('game', game);
      })
    })
  });

  // CARD FIVE
  socket.on('five', function(gameId, cardIndex, targetPlayer, guess){
    var userId = socket.handshake.session.passport.user;

    Game.findOne({_id: gameId}).exec(function(err, game) {
      if (err) return socket.emit('err', err);

      for (var i = 0; i < game.players.length; i++) {
        // Find Current Player
        if (game.players[i].player+'' === userId) {
          // Remove Protection
          game.players[i].protected = false;

          // Put Card in Discard
          game.players[i].discard.push(game.players[i].hand.splice(cardIndex, 1)[0]);
        }

        if (game.players[i].player+'' === targetPlayer) {
          // Put Card in Discard
          var card = game.players[i].discard.push(game.players[i].hand.splice(0, 1)[0]);

          // Check For 8
          if (card.vp === 8)
            // Remove Target from Round
            game = gameFunctions.removeTurn(game, i);
          else
            // Draw a Card
            game.players[i].hand.push(game.deck.splice(0, 1)[0]);
        }
      }

      // TODO: Check For Winner

      game.save(function(err, game) {
        if (err) return socket.emit('err', err);
        return socket.emit('game', game);
      })
    })
  });

  // CARD SIX
  socket.on('six', function(gameId, cardIndex, targetPlayer, guess){
    var userId = socket.handshake.session.passport.user;

    Game.findOne({_id: gameId}).exec(function(err, game) {
      if (err) return socket.emit('err', err);

      var userIndex;
      var targetIndex;

      for (var i = 0; i < game.players.length; i++) {
        // Find Current Player
        if (game.players[i].player+'' === userId) {
          // Remove Protection
          game.players[i].protected = false;

          // Put Card in Discard
          game.players[i].discard.push(game.players[i].hand.splice(cardIndex, 1)[0]);

          // Save User Index
          userIndex = i;
        }

        if (game.players[i].player+'' === targetPlayer) {
          // Save User Index
          targetIndex = i;
        }
      }

      // Hold Card
      var cardHolder = game.players[userIndex].hand[0];

      // Traid Cards
      game.players[userIndex].hand[0] = game.players[targetIndex].hand[0];
      game.players[targetIndex].hand[0] = cardHolder;

      // TODO: Check For Winner

      game.save(function(err, game) {
        if (err) return socket.emit('err', err);
        return socket.emit('game', game);
      })
    })
  });

  // CARD SEVEN
  socket.on('seven', function(gameId, cardIndex, targetPlayer, guess){
    var userId = socket.handshake.session.passport.user;

    Game.findOne({_id: gameId}).exec(function(err, game) {
      if (err) return socket.emit('err', err);

      for (var i = 0; i < game.players.length; i++) {
        // Find Current Player
        if (game.players[i].player+'' === userId) {
          // Remove Protection
          game.players[i].protected = false;

          // Put Card in Discard
          game.players[i].discard.push(game.players[i].hand.splice(cardIndex, 1)[0]);
        }
      }

      // TODO: Check For Winner

      game.save(function(err, game) {
        if (err) return socket.emit('err', err);
        return socket.emit('game', game);
      })
    })
  });

  // CARD EIGHT
  socket.on('eight', function(gameId, cardIndex, targetPlayer, guess){
    var userId = socket.handshake.session.passport.user;

    Game.findOne({_id: gameId}).exec(function(err, game) {
      if (err) return socket.emit('err', err);

      for (var i = 0; i < game.players.length; i++) {
        // Find Current Player
        if (game.players[i].player+'' === userId) {
          // Remove Protection
          game.players[i].protected = false;

          // Put Card in Discard
          game.players[i].discard.push(game.players[i].hand.splice(cardIndex, 1)[0]);

          game = gameFunctions.removeTurn(game, index);
        }
      }

      // TODO: Check For Winner

      game.save(function(err, game) {
        if (err) return socket.emit('err', err);
        return socket.emit('game', game);
      })
    })
  });
};
