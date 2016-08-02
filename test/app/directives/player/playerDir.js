// INITILIZE DIRECTIVE
// ============================================================
angular.module("app")
	.directive('player', function() {
		return {
			restrict: 'EA',
			templateUrl: './app/directives/player/playerTmpl.html'
		};
	});
