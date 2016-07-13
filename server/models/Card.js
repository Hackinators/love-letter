// REQUIRE DEPENDENCIES
// ============================================================
var mongoose = require('mongoose')
               require('mongoose-function')(mongoose);

// DEFINE SCHEMA
// ============================================================
var cardSchema = mongoose.Schema({
  name: {type: String},
  image: {type: String},
  description: {type: String},
  power: {type: Number},
  totalCards: {type: Number},
  flavorText: {type: String},
  run: Function
});

// EXPORT SCHEMA
// ============================================================
module.exports = cardSchema;
