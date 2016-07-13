// CONFIG
// ============================================================
var config = require('./config');

// REQUIRE DEPENDENCIES
// ============================================================
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var session = require('express-session')({
  secret: config.session_secret,
  saveUninitialized: true,
  resave: true
});
var mongoose = require('mongoose');
var sharedsession = require('express-socket.io-session')

// CONTROLLERS
// ============================================================
var userCtrl = require('./controllers/userController');
var gameCtrl = require('./controllers/gameController');
var passport = require('./services/passport');

// INITILIZE APP
// ============================================================
var app = express();

// INITILIZE DEPENDENCIES
// ============================================================
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname + './../test'));

// MIDDLEWARE
// ============================================================
var isAuthed = function(req, res, next) {
  if (!req.isAuthenticated()) return res.status(401).send();
  return next();
};

// PASSPORT
// ============================================================
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

app.post('/login', passport.authenticate('local', {
  successRedirect: '/me'
}));
app.get('/logout', function(req, res, next) {
  req.logout();
  return res.status(200).send('logged out');
});

// SOCKET
// ============================================================
var server = require('http').createServer(app)
var io = require('socket.io').listen(server);

io.use(sharedsession(session));

io.on('connection', gameCtrl);

// ENDPOINTS
// ============================================================
// USER ENDPOINTS
app.get('/user', userCtrl.read);
app.post('/register', userCtrl.register);
app.put('/user/:id', userCtrl.update);
app.get('/me', userCtrl.me);
app.put('/user/friend/add/:friendId', userCtrl.addFriend);
app.put('/user/friend/remove/:friendId', userCtrl.removeFriend);
app.put('/user/win/', userCtrl.addWin);
app.put('/user/loss/', userCtrl.addLoss);

// VARIABLES
// ============================================================
var port = config.port;
var mongoURI = config.mongo_URI;

// MONGO CONNECTION
// ============================================================
mongoose.set('debug', true);
mongoose.connect(mongoURI);
mongoose.connection.once('open', function() {
  console.log('Connected to mongo at: ', mongoURI);
});

// LISTEN
// ============================================================
server.listen(port, function() {
  console.log('listening on port ', port);
})
