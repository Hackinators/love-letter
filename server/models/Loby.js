// REQUIRE DEPENDENCIES
// ============================================================
var mongoose = require('mongoose');

// DEFINE SCHEMA
// ============================================================
var lobySchema = mongoose.Schema({
  players: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  chat: [{
    player: {type: String},
    message: {type: String},
    created: {type: Date, default: new Date()}
  }]
});

// EXPORT SCHEMA
// ============================================================
module.exports = mongoose.model('Model', lobySchema);
