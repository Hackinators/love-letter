// REQUIRE DEPENDENCIES
// ============================================================
var User = require('./../models/User');

// EXPORT METHODS
// ============================================================
module.exports = {

    // CRUD METHODS
    // ============================================================
    read: function(req, res) {
        User.find(req.query, function(err, user) {
            if (err) {
                res.status(500).send(err);
            }
            res.status(200).send(user);
        });
    },
    register: function(req, res, next) {
        User.create(req.body, function(err, result) {
            if (err) return res.status(500).send(err);
            newUser = result.toObject();
            delete newUser.password;
            res.status(200).json(newUser);
        });
    },
    update: function(req, res) {
        User.findByIdAndUpdate(req.params.id, req.body, function(err, user) {
            if (err) {
                res.status(500).send(err);
            }
            res.status(200).send(user);
        });
    },

    // OTHER METHODS
    // ============================================================
    me: function(req, res, next) {
        if (!req.user) return res.status(401).send('current user not defined');
        delete req.user.password;
        return res.status(200).json(req.user);
    },

    addFriend: function(req, res, next) {
        User.findByIdAndUpdate(req.user._id, {$push: {"friends": req.params.friendId}}, {new: true})
            .exec(function(err, user) {
                if (err) {
                    res.status(500).send(err);
                }
                res.status(200).send(user);
            })
    },
    removeFriend: function(req, res, next) {
      User.findByIdAndUpdate(req.user._id, {$pull: {"friends": req.params.friendId}}, {new: true, safe: true})
          .exec(function(err, user) {
              if (err) {
                  res.status(500).send(err);
              }
              res.status(200).send(user);
          })
    },

    addWin: function(req, res, next) {
      User.findByIdAndUpdate(req.user._id, {$inc: {'wins': 1}}, {new: true})
          .exec(function(err, user) {
              if (err) {
                  res.status(500).send(err);
              }
              res.status(200).send(user);
          })
    },
    addLoss: function(req, res, next) {
      User.findByIdAndUpdate(req.user._id, {$inc: {'losses': 1}}, {new: true})
          .exec(function(err, user) {
              if (err) {
                  res.status(500).send(err);
              }
              res.status(200).send(user);
          })
    }
};
