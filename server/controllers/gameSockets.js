var Game = require('../models/Game'),
	User = require('../models/User'),
	Lobby = require('../models/Lobby'),
	Chat = require('../models/Chat'),
	gameFunctions = require('../operations/gameFunctions');

module.exports = function(io) {
	io.sockets.on('connection', function(socket) {

		// ROOM
		// ============================================================
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

		// CHAT
		// ============================================================
		// GET CHAT
		socket.on('getChat', function() {
			Chat.findById(RoomId, function(err, chat) {
				if (err) return io.sockets.in(RoomId)
					.emit('err', err);
				io.sockets.in(RoomId)
					.emit('chat', chat);
			});
		}); // End getChat

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
		}); // End chat

		// GAME SETUP
		// ============================================================
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
		}); // End create

		// NEW ROUND
		socket.on('newRound', function(gameId) {
			Game.findById(gameId, function(err, game) {
				if (err) return io.sockets.in(RoomId)
					.emit('err', err);

				game = gameFunctions.newRound(game);

				game.save(function(err, game) {
					if (err) return io.sockets.in(RoomId)
						.emit('err', err);

					// Populate players
					game.populate('players.player', function(err, game) {
						// Error
						if (err) return io.sockets.in(RoomId)
							.emit('err', err);

						// Return Game if No Win
						return io.sockets.in(RoomId)
							.emit('gameNewRound', game);
					});
				});
			});
		}); // End newRound

		// DRAW CARD
		// ============================================================
		socket.on('drawCard', function(gameId) {
			Game.findById(gameId)
				.exec(function(err, game) {
					if (err) return io.sockets.in(RoomId)
						.emit('err', err);

					// Variables
					var userIndex = game.turnOrder[game.currentTurn];

					// Draw Card
					game.players[userIndex].hand.push(game.deck.splice(0, 1));

					game.save(function() {
						if (err) return io.sockets.in(RoomId)
							.emit('err', err);

						// Populate players
						game.populate('players.player', function(err, game) {
							// Error
							if (err) return io.sockets.in(RoomId)
								.emit('err', err);

							// Return Game
							return io.sockets.in(RoomId)
								.emit('gameDrewCard', game);
						});
					});
				});
		}); // End drawCard

		// PLAY CARD
		// ============================================================
		socket.on('playCard', function(gameId, cardIndex, targetPlayer, guess) {
			Game.findById(gameId)
				.exec(function(err, game) {
					if (err) return io.sockets.in(RoomId)
						.emit('err', err);

					// Indexes
					var userIndex = game.turnOrder[game.currentTurn];
					var targetIndex;

					// Get Target Player If One Exists
					if (targetPlayer)
						targetIndex = gameFunctions.getTargetIndex(game, targetPlayer);

					// Put Card in Players Discard and Get Power
					var power = game.players[userIndex].hand[cardIndex].testPower;

					game.players[userIndex].discard
						.push(game.players[userIndex].hand.splice(cardIndex, 1)[0]);

					// Remove Protection
					game.players[userIndex].protected = false;

					// Removed Player
					var removedPlayer;

					// Run Card Function if Needed
					switch (power) {

						// If Cards Power is 1
						case '1':
							if (game.players[targetIndex].hand[0].name === guess) {
								// Remove Player from Round
								game = gameFunctions.removeTurn(game, targetIndex, userIndex);

								// Set removedPlayer
								removedPlayer = game.players[targetIndex];
							}
							break;



							// If Cards Power is 3low
						case '3low':
							if (game.players[userIndex].hand[0].power > game.players[targetIndex].hand[0].power) {
								// Remove Target from Round
								game = gameFunctions.removeTurn(game, targetIndex, userIndex);

								// Set removedPlayer
								removedPlayer = game.players[targetIndex];
							} else if (game.players[userIndex].hand[0].power < game.players[targetIndex].hand[0].power) {
								// Remove Player from Round
								game = gameFunctions.removeTurn(game, userIndex, userIndex);

								// Set removedPlayer
								removedPlayer = game.players[userIndex];
							}
							break;



							// If Cards Power is 3high
						case '3high':
							if (game.players[userIndex].hand[0].power < game.players[targetIndex].hand[0].power) {
								// Remove Target from Round
								game = gameFunctions.removeTurn(game, targetIndex, userIndex);

								// Set removedPlayer
								removedPlayer = game.players[targetIndex];
							} else if (game.players[userIndex].hand[0].power > game.players[targetIndex].hand[0].power) {
								// Remove Player from Round
								game = gameFunctions.removeTurn(game, userIndex, userIndex);

								// Set removedPlayer
								removedPlayer = game.players[userIndex];
							}
							break;



							// If Cards Power is 4
						case '4':
							// Give Player Protection
							game.players[userIndex].protected = true;
							break;



							// If Cards Power is 5
						case '5':
							// Put Card in Discard
							var card = game.players[targetIndex].discard.push(game.players[targetIndex].hand.splice(0, 1)[0]);

							// Check For 8
							if (card.vp === 8) {
								// Remove Target from Round
								game = gameFunctions.removeTurn(game, targetIndex, userIndex);

								// Set removedPlayer
								removedPlayer = game.players[targetIndex];
							}

							// Check For Empty Deck
							else if (game.deck.length < 1)
								game.players[targetIndex].hand.push(game.game.extraCard);

							else
							// Draw a Card
								game.players[targetIndex].hand.push(game.deck.splice(0, 1)[0]);
							break;



							// If Cards Power is 6
						case '6':
							// Temp Card Holder
							var cardHolder = game.players[userIndex].hand[0];

							// Traid Cards
							game.players[userIndex].hand[0] = game.players[targetIndex].hand[0];
							game.players[targetIndex].hand[0] = cardHolder;
							break;



							// If Cards Power is 8
						case '8':
							// Remove Player
							game = gameFunctions.removeTurn(game, userIndex, userIndex);

							// Set removedPlayer
							removedPlayer = game.players[targetIndex];
					}

					// Save Game
					game.save(function(err, game) {

						// Populate Players
						game.populate('players.player', function(err, game) {

							// Error
							if (err) return io.sockets.in(RoomId)
								.emit('err', err);

							// If Power of Card is 2
							if (power === '2')
								return io.sockets.in(RoomId)
									.emit('gameShowCard', game, targetIndex);

							// If Power of Card is 5
							if (power === '5')
								return io.sockets.in(RoomId)
									.emit('gameDiscard', game, targetIndex);

							// If Power of Card is 6
							if (power === '6')
								return io.sockets.in(RoomId)
									.emit('gameSwapHands', game, targetIndex);

							// If Player Has Been Removed From Round
							if (removedPlayer)
								return io.sockets.in(RoomId)
									.emit('gameRemovePlayer', game, removedPlayer);

							// Return Game if No Other Conditions Met
							return io.sockets.in(RoomId)
								.emit('gamePlayedCard', game);
						});
					});
				});
		}); // End playCard

		// NEXT TURN
		// ============================================================
		socket.on('nextTurn', function(gameId) {
			Game.findById(gameId)
				.exec(function(err, game) {

					// Check For Win Before Starting Next Turn
					var roundWin = gameFunctions.checkForRoundWin(game);
					var gameWin;

					// If there is a round win, check for a game win and set game = roundWin
					if (roundWin !== null && roundWin !== 'tie') {
						gameWin = gameFunctions.checkForGameWin(roundWin);
						game = roundWin;
					}

					// increment Turn
					game = gameFunctions.nextTurn(game);

					// Save changes
					game.save(function() {
						// Error
						if (err) return io.sockets.in(RoomId)
							.emit('err', err);

						// Populate players
						game.populate('players.player', function(err, game) {
							// Error
							if (err) return io.sockets.in(RoomId)
								.emit('err', err);

							// Game Win
							if (gameWin)
								return io.sockets.in(RoomId)
									.emit('gameWin', game, gameWin);

							// Round Win
							if (roundWin)
								return io.sockets.in(RoomId)
									.emit('gameRoundWin', game);

							// Return Game
							return io.sockets.in(RoomId)
								.emit('gameNextTurn', game);
						});
					});
				});
		}); // End nextTurn

	}); // End io.sockets.on
}; // End module.exports
