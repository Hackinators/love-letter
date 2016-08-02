// INITILIZE CONTROLLER
// ============================================================
angular.module("app")
	.controller("gameCtrl", function($scope, user, game) {

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

		// FUNCTIONS
		// ============================================================
		$scope.run = function(func) {
			var myFunc = eval('(' + func + ')');

			myFunc($scope.game._id, 0, $scope.game.players[0].player, 'Obi-Wan');
		};

		$scope.startNextRound = function() {
			socket.emit('newRound', game._id);
		};

		// socket.on
		socket.on('err', function(err) {
			console.log(err);
		});

		socket.on('game', function(game) {
			$scope.game = game;
			$scope.$apply();
		});

		socket.on('newRound', function(game) {
			$scope.game = game;
			$scope.$apply();
		});

		socket.on('roundWin', function(game) {
			$scope.game = game;
			$scope.$apply();
		});

		socket.on('win', function(game, gameWin) {
			console.log(gameWin);

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
