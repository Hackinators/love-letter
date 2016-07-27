// INITILIZE CONTROLLER
// ============================================================
angular.module("app").controller("profileCtrl", function($scope, user, lobbyService, $state) {

  // VARIABLES
  // ============================================================
  $scope.user = user;


  // FUNCTIONS
  // ============================================================
  $scope.createLobby = function() {
    var players = user.friends;
    players.push(user._id);
    lobbyService.createLobby({
      players: players
    }).then(function(response) {
      $state.go('lobby', {id: response.data._id});
      return;
    });
  };

});
