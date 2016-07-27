// INITILIZE SERVICE
// ============================================================
angular.module("app").service("lobbyService", function($http) {

  // CRUD FUNCTIONS
  // ============================================================
  this.getLobby = function(id) {
    var query = "";
    if (id) query = '?_id=' + id;
    return $http({
      method: 'GET',
      url: '/lobby' + query
    }).then(function(response) {
      if (id) return response.data[0];
      return response.data;
    });
  };
  this.createLobby = function(lobby) {
    return $http({
      method: 'POST',
      url: '/lobby',
      data: lobby
    }).then(function(response) {
      return response;
    });
  };
  this.editLobby = function(id, lobby) {
    return $http({
      method: 'PUT',
      url: "/lobby/" + id,
      data: lobby
    }).then(function(response) {
      return response;
    });
  };
  this.deleteLobby = function(id) {
    return $http({
      method: 'DELETE',
      url: '/lobby/' + id
    }).then(function(response) {
      return response;
    });
  };

  // OTHER FUNCTIONS
  // ============================================================
  this.addPlayer = function(id, playerId) {
    return $http({
      method: 'PUT',
      url: "/lobby/player/add/" + id + '/' + playerId
    }).then(function(response) {
      return response;
    });
  };
  this.removePlayer = function(id, playerId) {
    return $http({
      method: 'PUT',
      url: "/lobby/player/remove/" + id + '/' + playerId
    }).then(function(response) {
      return response;
    });
  };

});
