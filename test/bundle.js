var app = angular.module("app", ['ui.router', 'luegg.directives']).config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise("/");

	$stateProvider.state('home', {
		url: "/",
		templateUrl: "./app/routes/home/homeTmpl.html",
		controller: 'homeCtrl'
	}).state('login', {
		url: '/login',
		templateUrl: './app/routes/login/loginTmpl.html',
		controller: 'loginCtrl'
	}).state('profile', {
		url: '/profile',
		templateUrl: './app/routes/profile/profileTmpl.html',
		controller: 'profileCtrl',
		resolve: {
			user: ["authService", "$state", function (authService, $state) {
				return authService.getCurrentUser().then(function (response) {
					if (!response.data) return $state.go('login');
					return response.data;
				}).catch(function (err) {
					$state.go('login');
				});
			}]
		}
	}).state('lobby', {
		url: '/lobby/:id',
		templateUrl: './app/routes/lobby/lobbyTmpl.html',
		controller: 'lobbyCtrl',
		resolve: {
			user: ["authService", "$state", function (authService, $state) {
				return authService.getCurrentUser().then(function (response) {
					if (!response.data) return $state.go('login');
					return response.data;
				}).catch(function (err) {
					$state.go('login');
				});
			}],
			lobby: ["lobbyService", "$stateParams", function (lobbyService, $stateParams) {
				return lobbyService.getLobby($stateParams.id).then(function (response) {
					return response;
				});
			}]
		}
	}).state('game', {
		url: '/game/:id',
		templateUrl: './app/routes/game/gameTmpl.html',
		controller: 'gameCtrl',
		resolve: {
			user: ["authService", "$state", function (authService, $state) {
				return authService.getCurrentUser().then(function (response) {
					if (!response.data) return $state.go('login');
					return response.data;
				}).catch(function (err) {
					return $state.go('login');
				});
			}],
			game: ["gameService", "$stateParams", function (gameService, $stateParams) {
				return gameService.getGame($stateParams.id).then(function (response) {

					return response;
				});
			}]
		}
	});
}]);
angular.module("app").service("authService", ["$http", function ($http) {

  this.login = function (user) {
    return $http({
      method: 'post',
      url: '/login',
      data: user
    }).then(function (response) {
      return response;
    });
  };

  this.logout = function () {
    return $http({
      method: 'get',
      url: '/logout'
    }).then(function (response) {
      return response;
    });
  };

  this.getCurrentUser = function () {
    return $http({
      method: 'GET',
      url: '/me'
    }).then(function (response) {
      return response;
    });
  };

  this.registerUser = function (user) {
    return $http({
      method: 'POST',
      url: '/register',
      data: user
    }).then(function (response) {
      return response;
    });
  };

  this.editUser = function (id, user) {
    return $http({
      method: 'PUT',
      url: "/user/" + id,
      data: user
    }).then(function (response) {
      return response;
    });
  };
}]);
// INITILIZE SERVICE
// ============================================================
angular.module("app").service("gameService", ["$http", function ($http) {

  // CRUD FUNCTIONS
  // ============================================================
  this.getGame = function (id) {
    var query = "";
    if (id) query = '?_id=' + id;
    return $http({
      method: 'GET',
      url: '/game' + query
    }).then(function (response) {
      if (id) return response.data[0];
      return response.data;
    });
  };
  this.createGame = function (game) {
    return $http({
      method: 'POST',
      url: '/game',
      data: game
    }).then(function (response) {
      return response;
    });
  };
  this.editGame = function (id, game) {
    return $http({
      method: 'PUT',
      url: "/game/" + id,
      data: game
    }).then(function (response) {
      return response;
    });
  };
  this.deleteGame = function (id) {
    return $http({
      method: 'DELETE',
      url: '/game/' + id
    }).then(function (response) {
      return response;
    });
  };

  // OTHER FUNCTIONS
  // ============================================================

}]);
// INITILIZE SERVICE
// ============================================================
angular.module("app").service("lobbyService", ["$http", function ($http) {

  // CRUD FUNCTIONS
  // ============================================================
  this.getLobby = function (id) {
    var query = "";
    if (id) query = '?_id=' + id;
    return $http({
      method: 'GET',
      url: '/lobby' + query
    }).then(function (response) {
      if (id) return response.data[0];
      return response.data;
    });
  };
  this.createLobby = function (lobby) {
    return $http({
      method: 'POST',
      url: '/lobby',
      data: lobby
    }).then(function (response) {
      return response;
    });
  };
  this.editLobby = function (id, lobby) {
    return $http({
      method: 'PUT',
      url: "/lobby/" + id,
      data: lobby
    }).then(function (response) {
      return response;
    });
  };
  this.deleteLobby = function (id) {
    return $http({
      method: 'DELETE',
      url: '/lobby/' + id
    }).then(function (response) {
      return response;
    });
  };

  // OTHER FUNCTIONS
  // ============================================================
  this.addPlayer = function (id, playerId) {
    return $http({
      method: 'PUT',
      url: "/lobby/player/add/" + id + '/' + playerId
    }).then(function (response) {
      return response;
    });
  };
  this.removePlayer = function (id, playerId) {
    return $http({
      method: 'PUT',
      url: "/lobby/player/remove/" + id + '/' + playerId
    }).then(function (response) {
      return response;
    });
  };
}]);
angular.module("app").service("userService", ["$http", function ($http) {

  this.getUsers = function () {
    return $http({
      method: 'GET',
      url: '/user'
    }).then(function (response) {
      return response;
    });
  };

  this.getUser = function (id) {
    return $http({
      method: 'GET',
      url: '/user?_id=' + id
    }).then(function (response) {
      return response;
    });
  };

  // Not Needed
  //
  // this.deleteUser = function(id) {
  //   return $http({
  //     method: 'DELETE',
  //     url: '/user/' + id
  //   }).then(function(response) {
  //     return response;
  //   });
  // };
}]);
// INITILIZE CONTROLLER
// ============================================================
angular.module("app").controller("gameCtrl", ["$scope", "user", "game", function ($scope, user, game) {

	// VARIABLES
	// ============================================================
	$scope.user = user;
	$scope.game = game;

	var socket = io();
	$scope.socket = socket;

	// ROOM INITILIZATION
	// ============================================================
	socket.on('connect', function () {
		socket.emit('joinRoom', game.chat);
	});

	// FUNCTIONS
	// ============================================================
	$scope.run = function (func) {
		var myFunc = eval('(' + func + ')');

		myFunc($scope.game._id, 0, $scope.game.players[0].player, 'Obi-Wan');
	};

	$scope.startNextRound = function () {
		socket.emit('newRound', game._id);
	};

	// socket.on
	socket.on('err', function (err) {
		console.log(err);
	});

	socket.on('game', function (game) {
		$scope.game = game;
		$scope.$apply();
	});

	socket.on('newRound', function (game) {
		$scope.game = game;
		$scope.$apply();
	});

	socket.on('roundWin', function (game) {
		$scope.game = game;
		$scope.$apply();
	});

	socket.on('win', function (game, gameWin) {
		console.log(gameWin);

		$scope.game = game;
		$scope.$apply();
	});

	// FILTERS
	// ============================================================
	$scope.opponentFilter = function (player) {
		if (player.player._id !== user._id) {
			return player;
		}
		return false;
	};
}]);
angular.module("app").controller("homeCtrl", ["$scope", function ($scope) {
  $scope.hello = 'Hello World!';
}]);
// INITILIZE CONTROLLER
// ============================================================
angular.module("app").controller("lobbyCtrl", ["$scope", "lobby", "user", "$state", function ($scope, lobby, user, $state) {

	// VARIABLES
	// ============================================================
	$scope.user = user;
	$scope.lobby = lobby;

	var socket = io();
	$scope.socket = socket;

	// ROOM INITILIZATION
	// ============================================================
	socket.on('connect', function () {
		socket.emit('joinRoom', lobby.chat);

		socket.emit('chat', lobby.chat, {
			player: 'Lobby',
			message: user.username + ' has joined the channel',
			created: new Date()
		});
	});

	// FUNCTIONS
	// ============================================================
	$scope.createGame = function () {
		socket.emit('create', lobby.players, lobby.chat);
	};

	$scope.addPlayer = function () {};

	// Socket.on
	socket.on('chat', function (chat) {
		$scope.chat = chat;
		$scope.$apply();
	});

	socket.on('newGame', function (game) {
		$state.go('game', {
			id: game._id
		});
	});

	// Socket.on ERRORS
	socket.on('err', function (err) {
		console.log(err);
	});
}]);
angular.module("app").controller("loginCtrl", ["$scope", "authService", "$state", function ($scope, authService, $state) {

  $scope.user = {
    email: 'xoman5144@gmail.com',
    password: 'Legoman#5144'
  };

  $scope.login = function (user) {
    authService.login(user).then(function (response) {
      if (!response.data) {
        alert('User does not exist');
        $scope.user.password = '';
      } else {
        $state.go('profile');
      }
    }).catch(function (err) {
      alert('Unable to login');
    });
  };

  $scope.register = function (user) {
    authService.registerUser(user).then(function (response) {
      if (!response.data) {
        alert('Unable to create user');
      } else {
        alert('User Created');
        $scope.newUser = {};
      }
    }).catch(function (err) {
      alert('Unable to create user');
    });
  };
}]);
// INITILIZE CONTROLLER
// ============================================================
angular.module("app").controller("profileCtrl", ["$scope", "user", "lobbyService", "$state", function ($scope, user, lobbyService, $state) {

  // VARIABLES
  // ============================================================
  $scope.user = user;

  // FUNCTIONS
  // ============================================================
  $scope.createLobby = function () {
    var players = user.friends;
    players.push(user._id);
    lobbyService.createLobby({
      players: players
    }).then(function (response) {
      $state.go('lobby', { id: response.data._id });
      return;
    });
  };
}]);
// INITILIZE CONTROLLER
// ============================================================
angular.module("app").controller("cardCtrl", ["$scope", function ($scope) {

  // VARIABLES
  // ============================================================
  var socket = $scope.socket;

  // FUNCTIONS
  // ============================================================
  $scope.run = function (func) {
    var myFunc = eval('(' + func + ')');

    myFunc($scope.game._id, 0, $scope.game.players[0].player, 'Obi-Wan');
  };
}]);
// INITILIZE DIRECTIVE
// ============================================================
angular.module("app").directive('cardDir', function () {
  return {
    restrict: 'EA',
    templateUrl: './app/directives/card/cardTmpl.html',
    controller: 'cardCtrl',
    scope: {
      socket: '=',
      inCurrentPlayersHand: '=',
      card: '='
    }
  };
});
// INITILIZE CONTROLLER
// ============================================================
angular.module("app").controller("chatBoxCtrl", ["$scope", function ($scope) {

  // VARIABLES
  // ============================================================
  var socket = $scope.socket;
  var username = $scope.username;
  $scope.placeholder = "Input Message...";

  // EMIT
  socket.emit('getChat');

  // FUNCTIONS
  // ============================================================
  $scope.sendMessage = function (message) {
    if ($scope.chatInput) {
      socket.emit('chat', $scope.chat._id, {
        player: username,
        message: message,
        created: new Date()
      });
      $scope.chatInput = '';
    }
  };

  // Socket.on
  socket.on('chat', function (chat) {
    $scope.chat = chat;
    $scope.$apply();
  });
}]);
// INITILIZE DIRECTIVE
// ============================================================
angular.module("app").directive('chatboxDir', function () {
  return {
    restrict: 'EA',
    templateUrl: './app/directives/chatBox/chatBoxTmpl.html',
    controller: 'chatBoxCtrl',
    scope: {
      socket: '=',
      chatId: '=',
      username: '='
    }
  };
});
angular.module("app").controller("navCtrl", ["$scope", "authService", "$state", function ($scope, authService, $state) {
  $scope.logout = function () {
    authService.logout().then(function (response) {
      $state.go('login');
    });
  };
}]);
angular.module('app').directive('navDir', function () {
  return {
    restrict: 'EA',
    templateUrl: './app/directives/nav/navTmpl.html',
    controller: 'navCtrl'
  };
});