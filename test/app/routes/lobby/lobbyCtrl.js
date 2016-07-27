// INITILIZE CONTROLLER
// ============================================================
angular.module("app")
	.controller("lobbyCtrl", function($scope, lobby, user, $state) {

		// VARIABLES
		// ============================================================
		$scope.user = user;
		$scope.lobby = lobby;

		var socket = io();
		$scope.socket = socket;


		// ROOM INITILIZATION
		// ============================================================
		socket.on('connect', function() {
			socket.emit('joinRoom', lobby.chat);

			socket.emit('chat', lobby.chat, {
				player: 'Lobby',
				message: user.username + ' has joined the channel',
				created: new Date()
			});
		});

		// FUNCTIONS
		// ============================================================
		$scope.createGame = function() {
			socket.emit('create', lobby.players, lobby.chat);
		};

		$scope.addPlayer = function() {

		};

		// Socket.on
		socket.on('chat', function(chat) {
			$scope.chat = chat;
			$scope.$apply();
		});

		socket.on('newGame', function(game) {
			$state.go('game', {
				id: game._id
			});
		});

		// Socket.on ERRORS
		socket.on('err', function(err) {
			console.log(err);
		});
	});
