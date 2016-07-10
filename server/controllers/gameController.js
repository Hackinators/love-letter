// REQUIRE DEPENDENCIES
// ============================================================
var mongoose = require('mongoose');

// DEFINE SCHEMA
// ============================================================
var gameSchema = mongoose.Schema({
  
});

// EXPORT SCHEMA
// ============================================================
module.exports = mongoose.model('Game', gameSchema);
