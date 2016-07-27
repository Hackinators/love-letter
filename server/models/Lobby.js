// REQUIRE DEPENDENCIES
// ============================================================
var mongoose = require('mongoose');

// DEFINE SCHEMA
// ============================================================
var lobbySchema = mongoose.Schema({
  players: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  chat: {type: mongoose.Schema.Types.ObjectId, ref: 'Chat'}
});

// EXPORT SCHEMA
// ============================================================
module.exports = mongoose.model('Lobby', lobbySchema);
