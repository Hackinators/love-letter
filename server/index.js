// CONFIG
// ============================================================
var config = require('./config');



// REQUIRE DEPENDENCIES
// ============================================================
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var sharedsession = require('express-socket.io-session');
var session = require('express-session')({
  secret: config.session_secret,
  saveUninitialized: true,
  resave: true
});



// CONTROLLERS
// ============================================================
var userCtrl = require('./controllers/userController');
var gameCtrl = require('./controllers/gameController');
var lobbyCtrl = require('./controllers/lobbyController');
var passport = require('./services/passport');



// INITILIZE APP
// ============================================================
var app = express();



// INITILIZE DEPENDENCIES
// ============================================================
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname + './../test'));



// SOCKET
// ============================================================
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
io.use(sharedsession(session));

var gameSockets = require('./controllers/gameSockets')(io);



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

// LOBY ENDPOINTS
app.get('/lobby', lobbyCtrl.read);
app.post('/lobby', lobbyCtrl.create);
app.put('/lobby/:id', lobbyCtrl.update);
app.delete('/lobby/:id', lobbyCtrl.delete);
app.put('/lobby/player/add/:id/:playerId', lobbyCtrl.addPlayer);
app.put('/lobby/player/remove/:id/:playerId', lobbyCtrl.removePlayer);

// GAME ENDPOINTS
app.get('/game', gameCtrl.read);
app.post('/game', gameCtrl.create);
app.put('/game/:id', gameCtrl.update);
app.delete('/game/:id', gameCtrl.delete);



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
});
