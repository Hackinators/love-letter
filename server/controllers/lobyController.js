// REQUIRE DEPENDENCIES
// ============================================================
var Loby = require('./../models/Loby');

// EXPORT METHODS
// ============================================================
module.exports = {

  // CRUD METHODS
  // ============================================================
  read: function(req, res) {
    Loby.find(req.query, function(err, loby) {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(loby);
    });
  },
  create: function(req, res) {
    Loby.create(req.body, function(err, loby) {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(loby);
    });
  },
  update: function(req, res) {
    Loby.findByIdAndUpdate(req.params.id, req.body, function(err, loby) {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(loby);
    });
  },
  delete: function(req, res) {
    Loby.findByIdAndRemove(req.params.id, function(err, loby) {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(loby);
    });
  }

  // OTHER METHODS
  // ============================================================
  

};
