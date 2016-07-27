// REQUIRE DEPENDENCIES
// ============================================================
var Lobby = require('./../models/Lobby');
var Chat = require('./../models/Chat');

var welcomeMessage = {messages: [{
  player: 'Lobby',
  message: 'Welcome to the lobby!',
  created: new Date()
}]};

// EXPORT METHODS
// ============================================================
module.exports = {

  // CRUD METHODS
  // ============================================================
  read: function(req, res) {
    Lobby.find(req.query, function(err, lobby) {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(lobby);
    });
  },
  create: function(req, res) {
    Chat.create(welcomeMessage, function(err, chat) {
      req.body.chat = chat._id;
      Lobby.create(req.body, function(err, lobby) {
        if (err) {
          res.status(500).send(err);
        }
        res.status(200).send(lobby);
      });
    });
  },
  update: function(req, res) {
    Lobby.findByIdAndUpdate(req.params.id, req.body, function(err, lobby) {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(lobby);
    });
  },
  delete: function(req, res) {
    Lobby.findByIdAndRemove(req.params.id, function(err, lobby) {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(lobby);
    });
  },

  // OTHER METHODS
  // ============================================================
  addPlayer: function(req, res, next) {
    Lobby.findByIdAndUpdate(req.params.id, {$push: {"players": req.params.playerId}}, {new: true})
        .exec(function(err, user) {
            if (err) {
                res.status(500).send(err);
            }
            res.status(200).send(user);
        });
  },
  removePlayer: function(req, res, next) {
    Lobby.findByIdAndUpdate(req.params.id, {$pull: {"players": req.params.playerId}}, {new: true, safe: true})
        .exec(function(err, user) {
            if (err) {
                res.status(500).send(err);
            }
            res.status(200).send(user);
        });
  }

};
