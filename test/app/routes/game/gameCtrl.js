/*jshint -W061 */

// INITILIZE CONTROLLER
// ============================================================
angular.module("app")
	.controller("gameCtrl", function($scope, user, game, modalService) {

		// VARIABLES
		// ============================================================
		$scope.user = user;
		$scope.game = game;

		var socket = io();
		$scope.socket = socket;

		// ROOM INITILIZATION
		// ============================================================
		socket.on('connect', function() {
			socket.emit('joinRoom', game.chat);
		});

		// ROUND INITILIZATION
		// ============================================================
		$scope.emitRoundStartMessage = function() {
			var player;
			var playerIndex;

			for (var i = 0; i < $scope.game.players.length; i++) {
				if ($scope.game.players[i].player._id === $scope.user._id) {
					player = $scope.game.players[i];
					playerIndex = i;
				}
			}

			if ($scope.game.roundStart === true && player.ready === false) {
				modalService.roundStart($scope.game.players[$scope.game.turnOrder[$scope.game.currentTurn]].player, $scope.user)
					.then(function(response) {
						if (response) {
							socket.emit('playerReady', $scope.game._id, playerIndex);
						}
					});
			}
		};
		$scope.emitRoundStartMessage();

		// FUNCTIONS
		// ============================================================

		// Start New Round
		$scope.newRound = function() {
			socket.emit('newRound', $scope.game._id);
		};

		// Draw a Card
		$scope.drawCard = function() {
			socket.emit('drawCard', $scope.game._id);
		};

		// Play a Card
		$scope.playCard = function(card, index) {

			// TODO: run function based on card
			var targetPlayer = $scope.game.players[0].player._id;
			var guess = 'Obi-Wan Kenobi';

			var myFunc = eval('(' + card.run + ')');

			myFunc($scope.game._id, index, targetPlayer, guess);
		};

		// Update Current Turn
		$scope.nextTurn = function() {
			socket.emit('nextTurn', $scope.game._id);
		};

		// SOCKET.ON
		// ============================================================
		socket.on('err', function(err) {
			console.log(err);
		});

		// Player Ready
		socket.on('playerReady', function(game) {
			$scope.game = game;
			$scope.$apply();
		});

		// New Round
		socket.on('gameNewRound', function(game) {
			$scope.game = game;
			$scope.$apply();
		});

		// Draw Card
		socket.on('gameDrewCard', function(game) {
			$scope.game = game;
			$scope.$apply();
		});

		// Show Card to player
		socket.on('gameShowCard', function(game, targetIndex) {
			$scope.game = game;
			$scope.$apply();
		});

		// Discard Card
		socket.on('gameDiscard', function(game, targetIndex) {
			$scope.game = game;
			$scope.$apply();
		});

		// Swap Hands
		socket.on('gameSwapHands', function(game, targetIndex) {
			$scope.game = game;
			$scope.$apply();
		});

		// Remove Player From Round
		socket.on('gameRemovePlayer', function(game, player) {
			$scope.game = game;
			$scope.$apply();
		});

		// Default Card Play
		socket.on('gameplayedCard', function(game) {
			$scope.game = game;
			$scope.$apply();
		});

		// Next Turn
		socket.on('gameNextTurn', function(game, targetIndex) {
			$scope.game = game;
			$scope.$apply();
		});

		// Win the Game
		socket.on('gameWin', function(game, player) {
			$scope.game = game;
			$scope.$apply();
		});

		// Win the Round
		socket.on('gameRoundWin', function(game, targetIndex) {
			$scope.game = game;
			$scope.$apply();
		});




		// FILTERS
		// ============================================================
		$scope.opponentFilter = function(player) {
			if (player.player._id !== user._id) {
				return player;
			}
			return false;
		};

		$scope.playerFilter = function(player) {
			if (player.player._id === user._id) {
				return player;
			}
			return false;
		};
	});
