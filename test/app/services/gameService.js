// INITILIZE SERVICE
// ============================================================
angular.module("app").service("gameService", function($http) {

  // CRUD FUNCTIONS
  // ============================================================
  this.getGame = function(id) {
    var query = "";
    if (id) query = '?_id=' + id;
    return $http({
      method: 'GET',
      url: '/game' + query
    }).then(function(response) {
      if (id) return response.data[0];
      return response.data;
    });
  };
  this.createGame = function(game) {
    return $http({
      method: 'POST',
      url: '/game',
      data: game
    }).then(function(response) {
      return response;
    });
  };
  this.editGame = function(id, game) {
    return $http({
      method: 'PUT',
      url: "/game/" + id,
      data: game
    }).then(function(response) {
      return response;
    });
  };
  this.deleteGame = function(id) {
    return $http({
      method: 'DELETE',
      url: '/game/' + id
    }).then(function(response) {
      return response;
    });
  };

  // OTHER FUNCTIONS
  // ============================================================


});
