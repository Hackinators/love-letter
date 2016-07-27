var Game = require('../models/Game'),
	User = require('../models/User'),
	Lobby = require('../models/Lobby'),
	Chat = require('../models/Chat'),
	gameFunctions = require('../operations/gameFunctions');

module.exports = function(io) {
	io.sockets.on('connection', function(socket) {

		var RoomId;

		// JOIN ROOM
		socket.on('joinRoom', function(roomId) {
			socket.join(roomId);
			RoomId = roomId;
		});

		// LEAVE ROOM
		socket.on('leaveRoom', function(roomId) {
			socket.leave(roomId);
		});

		// GET CHAT
		socket.on('getChat', function() {
			Chat.findById(RoomId, function(err, chat) {
				if (err) return io.sockets.in(RoomId)
					.emit('err', err);
				io.sockets.in(RoomId)
					.emit('chat', chat);
			});
		});

		// CHAT
		socket.on('chat', function(chatId, message) {
			Chat.findByIdAndUpdate(chatId, {
					$push: {
						"messages": message
					}
				}, {
					new: true
				})
				.exec(function(err, chat) {
					if (err) return io.sockets.in(RoomId)
						.emit('err', err);
					io.sockets.in(RoomId)
						.emit('chat', chat);
				});
		});

		// MAKE GAME
		socket.on('create', function(players, chat) {
			var game = new Game(gameFunctions.makeGame(players, 'Star Wars'));
			game.chat = chat;
			game.save(function(err, game) {
				// Error
				if (err) return io.sockets.in(RoomId)
					.emit('err', err);

				// Return Game if No Win
				return io.sockets.in(RoomId)
					.emit('newGame', game);
			});
		});

		// New Round
		socket.on('newRound', function(gameId) {
			Game.findById(gameId, function(err, game) {
				if (err) return io.sockets.in(RoomId)
					.emit('err', err);

				game = gameFunctions.newRound(game);

				game.save(function(err, game) {

					game.populate('players.player', function(err, game) {
						// Error
						if (err) return io.sockets.in(RoomId)
							.emit('err', err);

						// Return Game if No Win
						return io.sockets.in(RoomId)
							.emit('game', game);
					});
				});
			});
		});

		// CARD ZERO
		socket.on('zero', function(gameId, cardIndex) {
			var userId = socket.handshake.session.passport.user;

			Game.findOne({
					_id: gameId
				})
				.exec(function(err, game) {
					if (err) return io.sockets.in(RoomId)
						.emit('err', err);

					for (var i = 0; i < game.players.length; i++) {
						// Find Current Player
						if (game.players[i].player + '' === userId) {
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

						game.populate('players.player', function(err, game) {
							// Error
							if (err) return io.sockets.in(RoomId)
								.emit('err', err);

							// If Game Win
							if (gameWin) return io.sockets.in(RoomId)
								.emit('win', game, gameWin);

							// If Round Win
							if (roundWin) return io.sockets.in(RoomId)
								.emit('roundWin', game);

							// Return Game if No Win
							return io.sockets.in(RoomId)
								.emit('game', game);
						});
					});
				});
		});

		// CARD ONE
		socket.on('one', function(gameId, cardIndex, targetPlayer, guess) {
			var userId = socket.handshake.session.passport.user;

			Game.findOne({
					_id: gameId
				})
				.exec(function(err, game) {
					if (err) return io.sockets.in(RoomId)
						.emit('err', err);

					var userIndex;

					// Find Current Player
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].player + '' === userId) {
							// Remove Protection
							game.players[i].protected = false;

							// Put Card in Discard
							game.players[i].discard.push(game.players[i].hand.splice(cardIndex, 1)[0]);

							// Set User Index
							userIndex = i;
						}
					}

					// Find Target Player
					for (var j = 0; j < game.players.length; j++) {
						if (game.players[j].player + '' === targetPlayer) {
							// Check for Card Match
							if (game.players[j].hand[0].name === guess) {
								// Remove Player from Round
								game = gameFunctions.removeTurn(game, j, userIndex);
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

						game.populate('players.player', function(err, game) {
							// Error
							if (err) return io.sockets.in(RoomId)
								.emit('err', err);

							// If Game Win
							if (gameWin) return io.sockets.in(RoomId)
								.emit('win', game, gameWin);

							// If Round Win
							if (roundWin) return io.sockets.in(RoomId)
								.emit('roundWin', game);

							// Return Game if No Win
							return io.sockets.in(RoomId)
								.emit('game', game);
						});
					});
				});
		});

		// CARD TWO
		socket.on('two', function(gameId, cardIndex, targetPlayer) {
			var userId = socket.handshake.session.passport.user;

			Game.findOne({
					_id: gameId
				})
				.exec(function(err, game) {
					if (err) return io.sockets.in(RoomId)
						.emit('err', err);

					for (var i = 0; i < game.players.length; i++) {
						// Find Current Player
						if (game.players[i].player + '' === userId) {
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

						game.populate('players.player', function(err, game) {
							// Error
							if (err) return io.sockets.in(RoomId)
								.emit('err', err);

							// If Game Win
							if (gameWin) return io.sockets.in(RoomId)
								.emit('win', game, gameWin);

							// If Round Win
							if (roundWin) return io.sockets.in(RoomId)
								.emit('roundWin', game);

							// Return Game if No Win
							return io.sockets.in(RoomId)
								.emit('game', game);
						});
					});
				});
		});

		// CARD THREE LOW
		socket.on('threelow', function(gameId, cardIndex, targetPlayer) {
			var userId = socket.handshake.session.passport.user;

			Game.findOne({
					_id: gameId
				})
				.exec(function(err, game) {
					if (err) return io.sockets.in(RoomId)
						.emit('err', err);

					var userIndex;
					var targetIndex;

					for (var i = 0; i < game.players.length; i++) {
						// Find Current Player
						if (game.players[i].player + '' === userId) {
							// Remove Protection
							game.players[i].protected = false;

							// Put Card in Discard
							game.players[i].discard.push(game.players[i].hand.splice(cardIndex, 1)[0]);

							// Save User Index
							userIndex = i;
						}

						if (game.players[i].player + '' === targetPlayer) {
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

						game.populate('players.player', function(err, game) {
							// Error
							if (err) return io.sockets.in(RoomId)
								.emit('err', err);

							// If Game Win
							if (gameWin) return io.sockets.in(RoomId)
								.emit('win', game, gameWin);

							// If Round Win
							if (roundWin) return io.sockets.in(RoomId)
								.emit('roundWin', game);

							// Return Game if No Win
							return io.sockets.in(RoomId)
								.emit('game', game);
						});
					});
				});
		});

		// CARD THREE HIGH
		socket.on('threehigh', function(gameId, cardIndex, targetPlayer) {
			var userId = socket.handshake.session.passport.user;

			Game.findOne({
					_id: gameId
				})
				.exec(function(err, game) {
					if (err) return io.sockets.in(RoomId)
						.emit('err', err);

					var userIndex;
					var targetIndex;

					for (var i = 0; i < game.players.length; i++) {
						// Find Current Player
						if (game.players[i].player + '' === userId) {
							// Remove Protection
							game.players[i].protected = false;

							// Put Card in Discard
							game.players[i].discard.push(game.players[i].hand.splice(cardIndex, 1)[0]);

							// Save User Index
							userIndex = i;
						}

						if (game.players[i].player + '' === targetPlayer) {
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

						game.populate('players.player', function(err, game) {
							// Error
							if (err) return io.sockets.in(RoomId)
								.emit('err', err);

							// If Game Win
							if (gameWin) return io.sockets.in(RoomId)
								.emit('win', game, gameWin);

							// If Round Win
							if (roundWin) return io.sockets.in(RoomId)
								.emit('roundWin', game);

							// Return Game if No Win
							return io.sockets.in(RoomId)
								.emit('game', game);
						});
					});
				});
		});

		// CARD FOUR
		socket.on('four', function(gameId, cardIndex, targetPlayer) {
			var userId = socket.handshake.session.passport.user;

			Game.findOne({
					_id: gameId
				})
				.exec(function(err, game) {
					if (err) return io.sockets.in(RoomId)
						.emit('err', err);

					for (var i = 0; i < game.players.length; i++) {
						// Find Current Player
						if (game.players[i].player + '' === userId) {
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

						game.populate('players.player', function(err, game) {
							// Error
							if (err) return io.sockets.in(RoomId)
								.emit('err', err);

							// If Game Win
							if (gameWin) return io.sockets.in(RoomId)
								.emit('win', game, gameWin);

							// If Round Win
							if (roundWin) return io.sockets.in(RoomId)
								.emit('roundWin', game);

							// Return Game if No Win
							return io.sockets.in(RoomId)
								.emit('game', game);
						});
					});
				});
		});

		// CARD FIVE
		socket.on('five', function(gameId, cardIndex, targetPlayer) {
			var userId = socket.handshake.session.passport.user;

			Game.findOne({
					_id: gameId
				})
				.exec(function(err, game) {
					if (err) return io.sockets.in(RoomId)
						.emit('err', err);

					var userIndex;

					for (var i = 0; i < game.players.length; i++) {
						// Find Current Player
						if (game.players[i].player + '' === userId) {
							// Remove Protection
							game.players[i].protected = false;

							// Put Card in Discard
							game.players[i].discard.push(game.players[i].hand.splice(cardIndex, 1)[0]);

							// Get User Index
							userIndex = i;
						}
					}

					for (var j = 0; j < game.players.length; j++) {
						// Find Target Player
						if (game.players[j].player + '' === targetPlayer) {
							// Put Card in Discard
							var card = game.players[j].discard.push(game.players[j].hand.splice(0, 1)[0]);

							// Check For 8
							if (card.vp === 8)
							// Remove Target from Round
								game = gameFunctions.removeTurn(game, j, userIndex);

							// Check For Empty Deck
							else if (game.deck.length < 1)
								game.players[i].hand.push(game.game.extraCard);

							else
							// Draw a Card
								game.players[j].hand.push(game.deck.splice(0, 1)[0]);
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

						game.populate('players.player', function(err, game) {
							// Error
							if (err) return io.sockets.in(RoomId)
								.emit('err', err);

							// If Game Win
							if (gameWin) return io.sockets.in(RoomId)
								.emit('win', game, gameWin);

							// If Round Win
							if (roundWin) return io.sockets.in(RoomId)
								.emit('roundWin', game);

							// Return Game if No Win
							return io.sockets.in(RoomId)
								.emit('game', game);
						});
					});
				});
		});

		// CARD SIX
		socket.on('six', function(gameId, cardIndex, targetPlayer) {
			var userId = socket.handshake.session.passport.user;

			Game.findOne({
					_id: gameId
				})
				.exec(function(err, game) {
					if (err) return io.sockets.in(RoomId)
						.emit('err', err);

					var userIndex;
					var targetIndex;

					for (var i = 0; i < game.players.length; i++) {
						// Find Current Player
						if (game.players[i].player + '' === userId) {
							// Remove Protection
							game.players[i].protected = false;

							// Put Card in Discard
							game.players[i].discard.push(game.players[i].hand.splice(cardIndex, 1)[0]);

							// Save User Index
							userIndex = i;
						}

						if (game.players[i].player + '' === targetPlayer) {
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

						game.populate('players.player', function(err, game) {
							// Error
							if (err) return io.sockets.in(RoomId)
								.emit('err', err);

							// If Game Win
							if (gameWin) return io.sockets.in(RoomId)
								.emit('win', game, gameWin);

							// If Round Win
							if (roundWin) return io.sockets.in(RoomId)
								.emit('roundWin', game);

							// Return Game if No Win
							return io.sockets.in(RoomId)
								.emit('game', game);
						});
					});
				});
		});

		// CARD SEVEN
		socket.on('seven', function(gameId, cardIndex, targetPlayer) {
			var userId = socket.handshake.session.passport.user;

			Game.findOne({
					_id: gameId
				})
				.exec(function(err, game) {
					if (err) return io.sockets.in(RoomId)
						.emit('err', err);

					for (var i = 0; i < game.players.length; i++) {
						// Find Current Player
						if (game.players[i].player + '' === userId) {
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

						game.populate('players.player', function(err, game) {
							// Error
							if (err) return io.sockets.in(RoomId)
								.emit('err', err);

							// If Game Win
							if (gameWin) return io.sockets.in(RoomId)
								.emit('win', game, gameWin);

							// If Round Win
							if (roundWin) return io.sockets.in(RoomId)
								.emit('roundWin', game);

							// Return Game if No Win
							return io.sockets.in(RoomId)
								.emit('game', game);
						});
					});
				});
		});

		// CARD EIGHT
		socket.on('eight', function(gameId, cardIndex, targetPlayer) {
			var userId = socket.handshake.session.passport.user;

			Game.findOne({
					_id: gameId
				})
				.exec(function(err, game) {
					if (err) return io.sockets.in(RoomId)
						.emit('err', err);

					for (var i = 0; i < game.players.length; i++) {
						// Find Current Player
						if (game.players[i].player + '' === userId) {
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

						game.populate('players.player', function(err, game) {
							// Error
							if (err) return io.sockets.in(RoomId)
								.emit('err', err);

							// If Game Win
							if (gameWin) return io.sockets.in(RoomId)
								.emit('win', game, gameWin);

							// If Round Win
							if (roundWin) return io.sockets.in(RoomId)
								.emit('roundWin', game);

							// Return Game if No Win
							return io.sockets.in(RoomId)
								.emit('game', game);
						});
					});
				});
		});
	});
};
