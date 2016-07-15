// REQUIRE DEPENDENCIES
// ============================================================
var Game = require('./../models/Game'),
    User = require('./../models/User'),
    gameFunctions = require('./../operations/gameFunctions');

// SOCKET FUNCTIONS
// ============================================================
module.exports = function(socket) {

  // MAKE GAME
  socket.on('create', function(players, lobyId, chat) {
    var game = new Game(gameFunctions.makeGame(players, 'Star Wars'));
    game.chat = chat;
    game.save(function(err, newGame) {
      if (err) return socket.emit('err' + lobyId, err);
      else socket.emit('newGame' + lobyId, newGame);
    });
  })

  // New Round
  socket.on('newRound', function(gameId) {
    Game.findById(gameId, function(err, game) {
      if (err) return socket.emit('err' + gameId, err);

      game = gameFunctions.newRound(game);

      game.save(function(err, game) {
        if (err) return socket.emit('err' + gameId, err);

        // Return Game
        return socket.emit('newRound' + game._id, game);
      });
    })
  });

  // CARD ZERO
  socket.on('zero', function(gameId, cardIndex){
    var userId = socket.handshake.session.passport.user;

    Game.findOne({_id: gameId}).exec(function(err, game) {
      if (err) return socket.emit('err' + gameId, err);

      for (var i = 0; i < game.players.length; i++) {
        // Find Current Player
        if (game.players[i].player+'' === userId) {
          // Remove Protection
          game.players[i].protected = false;

          // Put Card in Discard
          game.players[i].discard.push(game.players[i].hand.splice(cardIndex, 1)[0]);
        }
      }

      // Check For Round Winner
      var roundWin = false;
      var round = gameFunctions.checkForRoundWin(game);

      // If Tie, Set round win to true, but dont change anything.
      if (round === 'tie') roundWin = true;
      // If Clear Winner, Set round win and update game
      else if (round) {
        game = round;
        roundWin = true;
      }

      // Check For Game Win
      var gameWin = gameFunctions.checkForGameWin(game);

      game.save(function(err, game) {
        if (err) return socket.emit('err' + gameId, err);

        // If Game Win
        if (gameWin) return socket.emit('win' + game._id, game, gameWin);

        // If Round Win
        if (roundWin) return socket.emit('roundWin' + game._id, game);

        // Return Game if No Win
        return socket.emit('game' + game._id, game);
      });
    })
  });

  // CARD ONE
  socket.on('one', function(gameId, cardIndex, targetPlayer, guess){
    var userId = socket.handshake.session.passport.user;

    Game.findOne({_id: gameId}).exec(function(err, game) {
      if (err) return socket.emit('err' + gameId, err);

      var userIndex;

      // Find Current Player
      for (var i = 0; i < game.players.length; i++) {
        if (game.players[i].player+'' === userId) {
          // Remove Protection
          game.players[i].protected = false;

          // Put Card in Discard
          game.players[i].discard.push(game.players[i].hand.splice(cardIndex, 1)[0]);

          // Set User Index
          userIndex = i;
        }
      }

      // Find Target Player
      for (var i = 0; i < game.players.length; i++) {
        if (game.players[i].player+'' === targetPlayer) {
          // Check for Card Match
          if (game.players[i].hand[0].name === guess) {
            // Remove Player from Round
            game = gameFunctions.removeTurn(game, i, userIndex);
          }
        }
      }

      // Check For Round Winner
      var roundWin = false;
      var round = gameFunctions.checkForRoundWin(game);

      // If Tie, Set round win to true, but dont change anything.
      if (round === 'tie') roundWin = true;
      // If Clear Winner, Set round win and update game
      else if (round) {
        game = round;
        roundWin = true;
      }

      // Check For Game Win
      var gameWin = gameFunctions.checkForGameWin(game);

      game.save(function(err, game) {
        if (err) return socket.emit('err' + gameId, err);

        // If Game Win
        if (gameWin) return socket.emit('win' + game._id, game, gameWin);

        // If Round Win
        if (roundWin) return socket.emit('roundWin' + game._id, game);

        // Return Game if No Win
        return socket.emit('game' + game._id, game);
      });
    })
  });

  // CARD TWO
  socket.on('two', function(gameId, cardIndex, targetPlayer){
    var userId = socket.handshake.session.passport.user;

    Game.findOne({_id: gameId}).exec(function(err, game) {
      if (err) return socket.emit('err' + gameId, err);

      for (var i = 0; i < game.players.length; i++) {
        // Find Current Player
        if (game.players[i].player+'' === userId) {
          // Remove Protection
          game.players[i].protected = false;

          // Put Card in Discard
          game.players[i].discard.push(game.players[i].hand.splice(cardIndex, 1)[0]);
        }
      }

      // Check For Round Winner
      var roundWin = false;
      var round = gameFunctions.checkForRoundWin(game);

      // If Tie, Set round win to true, but dont change anything.
      if (round === 'tie') roundWin = true;
      // If Clear Winner, Set round win and update game
      else if (round) {
        game = round;
        roundWin = true;
      }

      // Check For Game Win
      var gameWin = gameFunctions.checkForGameWin(game);

      game.save(function(err, game) {
        if (err) return socket.emit('err' + gameId, err);

        // If Game Win
        if (gameWin) return socket.emit('win' + game._id, game, gameWin);

        // If Round Win
        if (roundWin) return socket.emit('roundWin' + game._id, game);

        // Return Game if No Win
        return socket.emit('game' + game._id, game);
      });
    })
  });

  // CARD THREE LOW
  socket.on('threelow', function(gameId, cardIndex, targetPlayer){
    var userId = socket.handshake.session.passport.user;

    Game.findOne({_id: gameId}).exec(function(err, game) {
      if (err) return socket.emit('err' + gameId, err);

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
        game = gameFunctions.removeTurn(game, targetIndex, userIndex);
      else if (game.players[userIndex].hand[0].power < game.players[targetIndex].hand[0].power)
        // Remove Player from Round
        game = gameFunctions.removeTurn(game, userIndex, userIndex);


      // Check For Round Winner
      var roundWin = false;
      var round = gameFunctions.checkForRoundWin(game);

      // If Tie, Set round win to true, but dont change anything.
      if (round === 'tie') roundWin = true;
      // If Clear Winner, Set round win and update game
      else if (round) {
        game = round;
        roundWin = true;
      }

      // Check For Game Win
      var gameWin = gameFunctions.checkForGameWin(game);

      game.save(function(err, game) {
        if (err) return socket.emit('err' + gameId, err);

        // If Game Win
        if (gameWin) return socket.emit('win' + game._id, game, gameWin);

        // If Round Win
        if (roundWin) return socket.emit('roundWin' + game._id, game);

        // Return Game if No Win
        return socket.emit('game' + game._id, game);
      });
    })
  });

  // CARD THREE HIGH
  socket.on('threehigh', function(gameId, cardIndex, targetPlayer){
    var userId = socket.handshake.session.passport.user;

    Game.findOne({_id: gameId}).exec(function(err, game) {
      if (err) return socket.emit('err' + gameId, err);

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
        game = gameFunctions.removeTurn(game, targetIndex, userIndex);
      else if (game.players[userIndex].hand[0].power > game.players[targetIndex].hand[0].power)
        // Remove Player from Round
        game = gameFunctions.removeTurn(game, userIndex, userIndex);


      // Check For Round Winner
      var roundWin = false;
      var round = gameFunctions.checkForRoundWin(game);

      // If Tie, Set round win to true, but dont change anything.
      if (round === 'tie') roundWin = true;
      // If Clear Winner, Set round win and update game
      else if (round) {
        game = round;
        roundWin = true;
      }

      // Check For Game Win
      var gameWin = gameFunctions.checkForGameWin(game);

      game.save(function(err, game) {
        if (err) return socket.emit('err' + gameId, err);

        // If Game Win
        if (gameWin) return socket.emit('win' + game._id, game, gameWin);

        // If Round Win
        if (roundWin) return socket.emit('roundWin' + game._id, game);

        // Return Game if No Win
        return socket.emit('game' + game._id, game);
      });
    })
  });

  // CARD FOUR
  socket.on('four', function(gameId, cardIndex, targetPlayer){
    var userId = socket.handshake.session.passport.user;

    Game.findOne({_id: gameId}).exec(function(err, game) {
      if (err) return socket.emit('err' + gameId, err);

      for (var i = 0; i < game.players.length; i++) {
        // Find Current Player
        if (game.players[i].player+'' === userId) {
          // Put Card in Discard
          game.players[i].discard.push(game.players[i].hand.splice(cardIndex, 1)[0]);

          // Give Player Protection
          game.players[i].protected = true;
        }
      }

      // Check For Round Winner
      var roundWin = false;
      var round = gameFunctions.checkForRoundWin(game);

      // If Tie, Set round win to true, but dont change anything.
      if (round === 'tie') roundWin = true;
      // If Clear Winner, Set round win and update game
      else if (round) {
        game = round;
        roundWin = true;
      }

      // Check For Game Win
      var gameWin = gameFunctions.checkForGameWin(game);

      game.save(function(err, game) {
        if (err) return socket.emit('err' + gameId, err);

        // If Game Win
        if (gameWin) return socket.emit('win' + game._id, game, gameWin);

        // If Round Win
        if (roundWin) return socket.emit('roundWin' + game._id, game);

        // Return Game if No Win
        return socket.emit('game' + game._id, game);
      });
    })
  });

  // CARD FIVE
  socket.on('five', function(gameId, cardIndex, targetPlayer){
    var userId = socket.handshake.session.passport.user;

    Game.findOne({_id: gameId}).exec(function(err, game) {
      if (err) return socket.emit('err' + gameId, err);

      var userIndex;

      for (var i = 0; i < game.players.length; i++) {
        // Find Current Player
        if (game.players[i].player+'' === userId) {
          // Remove Protection
          game.players[i].protected = false;

          // Put Card in Discard
          game.players[i].discard.push(game.players[i].hand.splice(cardIndex, 1)[0]);

          // Get User Index
          userIndex = i;
        }
      }

      for (var i = 0; i < game.players.length; i++) {
        // Find Target Player
        if (game.players[i].player+'' === targetPlayer) {
          // Put Card in Discard
          var card = game.players[i].discard.push(game.players[i].hand.splice(0, 1)[0]);

          // Check For 8
          if (card.vp === 8)
            // Remove Target from Round
            game = gameFunctions.removeTurn(game, i, userIndex);

          // Check For Empty Deck
          else if (game.deck.length < 1)
            game.players[i].hand.push(game.game.extraCard);

          else
            // Draw a Card
            game.players[i].hand.push(game.deck.splice(0, 1)[0]);
        }
      }

      // Check For Round Winner
      var roundWin = false;
      var round = gameFunctions.checkForRoundWin(game);

      // If Tie, Set round win to true, but dont change anything.
      if (round === 'tie') roundWin = true;
      // If Clear Winner, Set round win and update game
      else if (round) {
        game = round;
        roundWin = true;
      }

      // Check For Game Win
      var gameWin = gameFunctions.checkForGameWin(game);

      game.save(function(err, game) {
        if (err) return socket.emit('err' + gameId, err);

        // If Game Win
        if (gameWin) return socket.emit('win' + game._id, game, gameWin);

        // If Round Win
        if (roundWin) return socket.emit('roundWin' + game._id, game);

        // Return Game if No Win
        return socket.emit('game' + game._id, game);
      });
    })
  });

  // CARD SIX
  socket.on('six', function(gameId, cardIndex, targetPlayer){
    var userId = socket.handshake.session.passport.user;

    Game.findOne({_id: gameId}).exec(function(err, game) {
      if (err) return socket.emit('err' + gameId, err);

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



      // Check For Round Winner
      var roundWin = false;
      var round = gameFunctions.checkForRoundWin(game);

      // If Tie, Set round win to true, but dont change anything.
      if (round === 'tie') roundWin = true;
      // If Clear Winner, Set round win and update game
      else if (round) {
        game = round;
        roundWin = true;
      }

      // Check For Game Win
      var gameWin = gameFunctions.checkForGameWin(game);

      game.save(function(err, game) {
        if (err) return socket.emit('err' + gameId, err);

        // If Game Win
        if (gameWin) return socket.emit('win' + game._id, game, gameWin);

        // If Round Win
        if (roundWin) return socket.emit('roundWin' + game._id, game);

        // Return Game if No Win
        return socket.emit('game' + game._id, game);
      });
    })
  });

  // CARD SEVEN
  socket.on('seven', function(gameId, cardIndex, targetPlayer){
    var userId = socket.handshake.session.passport.user;

    Game.findOne({_id: gameId}).exec(function(err, game) {
      if (err) return socket.emit('err' + gameId, err);

      for (var i = 0; i < game.players.length; i++) {
        // Find Current Player
        if (game.players[i].player+'' === userId) {
          // Remove Protection
          game.players[i].protected = false;

          // Put Card in Discard
          game.players[i].discard.push(game.players[i].hand.splice(cardIndex, 1)[0]);
        }
      }

      // Check For Round Winner
      var roundWin = false;
      var round = gameFunctions.checkForRoundWin(game);

      // If Tie, Set round win to true, but dont change anything.
      if (round === 'tie') roundWin = true;
      // If Clear Winner, Set round win and update game
      else if (round) {
        game = round;
        roundWin = true;
      }

      // Check For Game Win
      var gameWin = gameFunctions.checkForGameWin(game);

      game.save(function(err, game) {
        if (err) return socket.emit('err' + gameId, err);

        // If Game Win
        if (gameWin) return socket.emit('win' + game._id, game, gameWin);

        // If Round Win
        if (roundWin) return socket.emit('roundWin' + game._id, game);

        // Return Game if No Win
        return socket.emit('game' + game._id, game);
      });
    })
  });

  // CARD EIGHT
  socket.on('eight', function(gameId, cardIndex, targetPlayer){
    var userId = socket.handshake.session.passport.user;

    Game.findOne({_id: gameId}).exec(function(err, game) {
      if (err) return socket.emit('err' + gameId, err);

      for (var i = 0; i < game.players.length; i++) {
        // Find Current Player
        if (game.players[i].player+'' === userId) {
          // Remove Protection
          game.players[i].protected = false;

          // Put Card in Discard
          game.players[i].discard.push(game.players[i].hand.splice(cardIndex, 1)[0]);

          game = gameFunctions.removeTurn(game, i, i);
        }
      }

      // Check For Round Winner
      var roundWin = false;
      var round = gameFunctions.checkForRoundWin(game);

      // If Tie, Set round win to true, but dont change anything.
      if (round === 'tie') roundWin = true;
      // If Clear Winner, Set round win and update game
      else if (round) {
        game = round;
        roundWin = true;
      }

      // Check For Game Win
      var gameWin = gameFunctions.checkForGameWin(game);

      game.save(function(err, game) {
        if (err) return socket.emit('err' + gameId, err);

        // If Game Win
        if (gameWin) return socket.emit('win' + game._id, game, gameWin);

        // If Round Win
        if (roundWin) return socket.emit('roundWin' + game._id, game);

        // Return Game if No Win
        return socket.emit('game' + game._id, game);
      });
    })
  });
};
