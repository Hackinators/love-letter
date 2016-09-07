angular.module("app")
	.controller("confirmCtrl", function($scope, close, text, focus) {
		focus('focusMe');

		$scope.close = close;
		$scope.text = text;
	});
