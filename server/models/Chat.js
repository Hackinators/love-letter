// REQUIRE DEPENDENCIES
// ============================================================
var mongoose = require('mongoose');

// DEFINE SCHEMA
// ============================================================
var chatSchema = mongoose.Schema({
  messages: [{
    player: {type: String},
    message: {type: String},
    created: {type: Date}
  }]
});

// EXPORT SCHEMA
// ============================================================
module.exports = mongoose.model('Chat', chatSchema);
