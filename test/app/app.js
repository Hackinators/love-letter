var app = angular.module("app", ['ui.router', 'luegg.directives'])

.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise("/");

	$stateProvider
		.state('home', {
			url: "/",
			templateUrl: "./app/routes/home/homeTmpl.html",
			controller: 'homeCtrl'
		})
		.state('login', {
			url: '/login',
			templateUrl: './app/routes/login/loginTmpl.html',
			controller: 'loginCtrl'
		})
		.state('profile', {
			url: '/profile',
			templateUrl: './app/routes/profile/profileTmpl.html',
			controller: 'profileCtrl',
			resolve: {
				user: function(authService, $state) {
					return authService.getCurrentUser()
						.then(function(response) {
							if (!response.data)
								return $state.go('login');
							return response.data;
						})
						.catch(function(err) {
							$state.go('login');
						});
				}
			}
		})
		.state('lobby', {
			url: '/lobby/:id',
			templateUrl: './app/routes/lobby/lobbyTmpl.html',
			controller: 'lobbyCtrl',
			resolve: {
				user: function(authService, $state) {
					return authService.getCurrentUser()
						.then(function(response) {
							if (!response.data)
								return $state.go('login');
							return response.data;
						})
						.catch(function(err) {
							$state.go('login');
						});
				},
				lobby: function(lobbyService, $stateParams) {
					return lobbyService.getLobby($stateParams.id)
						.then(function(response) {
							return response;
						});
				}
			}
		})
		.state('game', {
			url: '/game/:id',
			templateUrl: './app/routes/game/gameTmpl.html',
			controller: 'gameCtrl',
			resolve: {
				user: function(authService, $state) {
					return authService.getCurrentUser()
						.then(function(response) {
							if (!response.data)
								return $state.go('login');
							return response.data;
						})
						.catch(function(err) {
							return $state.go('login');
						});
				},
				game: function(gameService, $stateParams) {
					return gameService.getGame($stateParams.id)
						.then(function(response) {

							return response;
						});
				}
			}
		});

});
