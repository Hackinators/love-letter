// INITILIZE CONTROLLER
// ============================================================
angular.module("app").controller("chatBoxCtrl", function($scope) {

  // VARIABLES
  // ============================================================
  var socket = $scope.socket;
  var username = $scope.username;
  $scope.placeholder = "Input Message...";

  // EMIT
  socket.emit('getChat');

  // FUNCTIONS
  // ============================================================
  $scope.sendMessage = function(message) {
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
  socket.on('chat', function(chat) {
    $scope.chat = chat;
    $scope.$apply();
  });

});
