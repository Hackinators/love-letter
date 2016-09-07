angular.module("app")
	.controller("alertCtrl", function($scope, close, text, focus) {
		focus('focusMe');

		$scope.close = close;
		$scope.text = text;
	});
