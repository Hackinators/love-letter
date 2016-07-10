// REQUIRE DEPENDENCIES
// ============================================================
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var obj = mongoose.Schema.Types.ObjectId;

// DEFINE SCHEMA
// ============================================================
var User = mongoose.Schema({
  name: {
    full: {type: String, require: true},
    first: {type: String, require: true},
    last: {type: String, require: true}
  },
  userName: {type: String, require: true},
  email: {type: String, index: true, trim: true, required: true},
  password: {type: String, required: true},
  joined: {type: Date, default: new Date()},
  wins: {type: Number, default: 0},
  losses: {type: Number, default: 0},
  friends: [{type: obj, ref: 'User'}]
});

User.pre('save', function(next) {
	var user = this;
	if (!user.isModified('password'))	return next();
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
  return next(null, user);
});

User.methods.verifyPassword = function(reqBodyPassword) {
  var user = this;
  return bcrypt.compareSync(reqBodyPassword, user.password);
};

// EXPORT SCHEMA
// ============================================================
module.exports = mongoose.model('User', User);
