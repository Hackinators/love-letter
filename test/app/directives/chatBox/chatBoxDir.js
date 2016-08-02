// INITILIZE DIRECTIVE
// ============================================================
angular.module("app")
	.directive('chatbox', function() {
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
