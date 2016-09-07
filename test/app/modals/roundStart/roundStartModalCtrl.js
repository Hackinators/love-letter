// INITILIZE CONTROLLER
// ============================================================
angular.module("app")
	.controller("roundStartModalCtrl", function($scope, close, player, user) {

		// VARIABLES
		// ============================================================
		$scope.close = close;
		$scope.player = player;
		$scope.user = user;

		// FUNCTIONS
		// ============================================================
		$scope.playerReady = function() {
			close(true);
		};

	});
