// REQUIRE DEPENDENCIES
// ============================================================
var Game = require('./../models/Game');

// EXPORT METHODS
// ============================================================
module.exports = {

  // CRUD METHODS
  // ============================================================
  read: function(req, res) {
    Game.find(req.query)
        .populate('players.player')
        .exec(function(err, game) {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(game);
    });
  },
  create: function(req, res) {
    Game.create(req.body, function(err, game) {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(game);
    });
  },
  update: function(req, res) {
    Game.findByIdAndUpdate(req.params.id, req.body, function(err, game) {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(game);
    });
  },
  delete: function(req, res) {
    Game.findByIdAndRemove(req.params.id, function(err, game) {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(game);
    });
  }

  // OTHER METHODS
  // ============================================================


};
