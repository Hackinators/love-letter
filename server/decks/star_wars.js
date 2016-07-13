module.exports = [
  {
    name: 'Lightsaber',
    image: './images/starwars/lightsaber.jpg',
    description: 'This card has no effect when discarded. At the end of a round this card counts as a 7.',
    power: 0,
    totalCards: 1,
    flavorText: '"An elegant weapon for a more civilized age."',
    run: function(gameId, index, targetPlayer, guess) {
      socket.emit('zero', gameId,index, targetPlayer, guess);
    }
  },
  {
    name: 'Stormtrooper',
    image: './images/starwars/stormtrooper.jpg',
    description: 'Name a card other than Stormtrooper and choose another player. If that player has that card, he or she is out of the round.',
    power: 1,
    totalCards: 5,
    flavorText: '"These aren\'t the droids we\'re looking for."',
    run: function(gameId, index, targetPlayer, guess) {
      socket.emit('one', gameId, index, targetPlayer, guess);
    }
  },
  {
    name: 'Stormtrooper',
    image: './images/starwars/stormtrooper.jpg',
    description: 'Name a card other than Stormtrooper and choose another player. If that player has that card, he or she is out of the round.',
    power: 1,
    totalCards: 5,
    flavorText: '"These aren\'t the droids we\'re looking for."',
    run: function(gameId, index, targetPlayer, guess) {
      socket.emit('one', gameId, index, targetPlayer, guess);
    }
  },
  {
    name: 'Stormtrooper',
    image: './images/starwars/stormtrooper.jpg',
    description: 'Name a card other than Stormtrooper and choose another player. If that player has that card, he or she is out of the round.',
    power: 1,
    totalCards: 5,
    flavorText: '"These aren\'t the droids we\'re looking for."',
    run: function(gameId, index, targetPlayer, guess) {
      socket.emit('one', gameId, index, targetPlayer, guess);
    }
  },
  {
    name: 'Stormtrooper',
    image: './images/starwars/stormtrooper.jpg',
    description: 'Name a card other than Stormtrooper and choose another player. If that player has that card, he or she is out of the round.',
    power: 1,
    totalCards: 5,
    flavorText: '"These aren\'t the droids we\'re looking for."',
    run: function(gameId, index, targetPlayer, guess) {
      socket.emit('one', gameId, index, targetPlayer, guess);
    }
  },
  {
    name: 'Stormtrooper',
    image: './images/starwars/stormtrooper.jpg',
    description: 'Name a card other than Stormtrooper and choose another player. If that player has that card, he or she is out of the round.',
    power: 1,
    totalCards: 5,
    flavorText: '"These aren\'t the droids we\'re looking for."',
    run: function(gameId, index, targetPlayer, guess) {
      socket.emit('one', gameId, index, targetPlayer, guess);
    }
  },
  {
    name: 'Yoda',
    image: './images/starwars/yoda.jpg',
    description: 'Look at another players hand.',
    power: 2,
    totalCards: 2,
    flavorText: '"When nine hundred years old you reach, look as good you will not."',
    run: function(gameId, index, targetPlayer, guess) {
      socket.emit('two', gameId, index, targetPlayer, guess);
    }
  },
  {
    name: 'Yoda',
    image: './images/starwars/yoda.jpg',
    description: 'Look at another players hand.',
    power: 2,
    totalCards: 2,
    flavorText: '"When nine hundred years old you reach, look as good you will not."',
    run: function(gameId, index, targetPlayer, guess) {
      socket.emit('two', gameId, index, targetPlayer, guess);
    }
  },
  {
    name: 'Darth Vader',
    image: './images/starwars/darthVader.jpg',
    description: 'You and another player secretly compare hands. The player with the lower value is out of the round.',
    power: 3,
    totalCards: 1,
    flavorText: '"You underestimate the power of the Dark Side."',
    run: function(gameId, index, targetPlayer, guess) {
      socket.emit('threelow', gameId, index, targetPlayer, guess);
    }
  },
  {
    name: 'Darth Sidious',
    image: './images/starwars/darthsidious.jpg',
    description: 'You and another player secretly compare hands. The player with the higher value is out of the round.',
    power: 3,
    totalCards: 1,
    flavorText: '"Good, good... Let the hate flow through you."',
    run: function(gameId, index, targetPlayer, guess) {
      socket.emit('threehigh', gameId, index, targetPlayer, guess);
    }
  },
  {
    name: 'Obi-Wan Kenobi',
    image: './images/starwars/obiwan.jpeg',
    description: "Until your next turn, ignore all effects from other players' cards.",
    power: 4,
    totalCards: 2,
    flavorText: '"I haven\'t gone by the name of Obi-Wan since... oh, before you were born."',
    run: function(gameId, index, targetPlayer, guess) {
      socket.emit('four', gameId, index, targetPlayer, guess);
    }
  },
  {
    name: 'Obi-Wan Kenobi',
    image: './images/starwars/obiwan.jpeg',
    description: "Until your next turn, ignore all effects from other players' cards.",
    power: 4,
    totalCards: 2,
    flavorText: '"I haven\'t gone by the name of Obi-Wan since... oh, before you were born."',
    run: function(gameId, index, targetPlayer, guess) {
      socket.emit('four', gameId, index, targetPlayer, guess);
    }
  },
  {
    name: 'Han Solo and Chewbacca',
    image: './images/starwars/hanAndChewy.jpg',
    description: 'Choose any player (including yourself) to discard his or her hand and draw a new card.',
    power: 5,
    totalCards: 2,
    flavorText: '"Never tell me the odds."',
    run: function(gameId, index, targetPlayer, guess) {
      socket.emit('five', gameId, index, targetPlayer, guess);
    }
  },
  {
    name: 'Han Solo and Chewbacca',
    image: './images/starwars/hanAndChewy.jpg',
    description: 'Choose any player (including yourself) to discard his or her hand and draw a new card.',
    power: 5,
    totalCards: 2,
    flavorText: '"Never tell me the odds."',
    run: function(gameId, index, targetPlayer, guess) {
      socket.emit('five', gameId, index, targetPlayer, guess);
    }
  },
  {
    name: 'Leia Organa',
    image: './images/starwars/leia.png',
    description: 'Trade hands with another player of your choice.',
    power: 6,
    totalCards: 1,
    flavorText: '"Why, you stuck-up, half-witted, scruffy-looking nerf herder!"',
    run: function(gameId, index, targetPlayer, guess) {
      socket.emit('six', gameId, index, targetPlayer, guess);
    }
  },
  {
    name: 'R2-D2 and C3PO',
    image: './images/starwars/c-3po-r2-d2.jpg',
    description: 'If you have this card and either LEIA ORGANA or \"HAN SOLO and CHEWBACCA\" in your hand, you must discard this card.',
    power: 7,
    totalCards: 1,
    flavorText: '"Sir, the possibility of successfully navigating an asteroid field is approximately 3,720 to 1."',
    run: function(gameId, index, targetPlayer, guess) {
      socket.emit('seven', gameId, index, targetPlayer, guess);
    }
  },
  {
    name: 'Luke Skywalker',
    image: './images/starwars/luke.jpg',
    description: 'If you discard this card, you are out of the round.',
    power: 8,
    totalCards: 1,
    flavorText: '"You\'re gravely mistaken. You won\'t convert me as you did my father. "',
    run: function(gameId, index, targetPlayer, guess) {
      socket.emit('eight', gameId, index, targetPlayer, guess);
    }
  }
];
