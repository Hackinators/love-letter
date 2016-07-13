angular.module("app").controller("profileCtrl", function($scope, user) {
  $scope.user = user;

  var socket = io();
  $scope.socket = socket;

  socket.emit('create', ['5782d42dff790ad01f9eff45', '5782d584ff790ad01f9eff46']);

  socket.on('error', function(thing) {
    console.log(thing);

  });

  socket.on('game', function(game) {
    $scope.game = game;
    console.log(game);
    $scope.$apply();
  });

  $scope.run = function(func) {
    var myFunc = eval('('+func+')');

    myFunc($scope.game._id, 0, $scope.game.players[0].player, 'Obi-Wan');
  }
});
