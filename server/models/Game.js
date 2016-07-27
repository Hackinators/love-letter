// REQUIRE DEPENDENCIES
// ============================================================
var mongoose = require('mongoose')
               require('mongoose-function')(mongoose);
var obj = mongoose.Schema.Types.ObjectId;
var Card = require('./Card');

// DEFINE SCHEMA
// ============================================================
var gameSchema = mongoose.Schema({
  players: [{
    player: {type: obj, ref: 'User'},
    vp: {type: Number, default: 0},
    hand: [Card],
    discard: [Card],
    protected: {type: Boolean, default: false}
  }],
  round: {type: Number, default: 0},
  playerCount: {type: Number, min: 2, max: 4},
  maxVp: {type: Number, enum:[7, 5, 4]},
  constTurnOrder: [{type: Number}],
  turnOrder: [{type: Number}],
  currentTurn: {type: Number, default: 0},
  roundWinner: {type: obj, ref: 'User'},
  chat: {type: obj, ref: 'Chat'},
  extraCard: Card,
  deck: [Card],
  theme: {type: String, default: 'Star Wars', enum: ['Star Wars', 'Hobbit']}
});

// EXPORT SCHEMA
// ============================================================
module.exports = mongoose.model('Game', gameSchema);
