// INITILIZE CONTROLLER
// ============================================================
angular.module("app")
	.controller("cardCtrl", function($scope) {

		// VARIABLES
		// ============================================================
		var socket = $scope.socket;

		// FUNCTIONS
		// ============================================================
		$scope.run = function(func) {
			console.log('playing card');

			var myFunc = eval('(' + func + ')');

			myFunc($scope.game._id, 0, $scope.game.players[0].player._id, 'Obi-Wan');
		};

	});
