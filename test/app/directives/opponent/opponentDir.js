// INITILIZE DIRECTIVE
// ============================================================
angular.module("app")
	.directive('opponent', function() {
		return {
			restrict: 'EA',
			templateUrl: './app/directives/opponent/opponentTmpl.html'
		};
	});
