module.exports = [
  {
    name: 'The One Ring',
    image: './images/hobbit/',
    description: 'This card has no effect when discarded. At the end of a round this card counts as a 7.',
    power: 0,
    totalCards: 1,
    flavorText: '"What has it got in its nasty little pocketses?"',
    run: function(gameId, index, targetPlayer) {
      socket.emit('zero', gameId, index, targetPlayer);
    }
  },
  {
    name: 'Smaug',
    image: './images/hobbit/',
    description: 'Name a card other than Smaug and choose another player. If that player has that card, he or she is out of the round.',
    power: 1,
    totalCards: 5,
    flavorText: '"I am fire, I am death!"',
    run: function(gameId, index, targetPlayer) {
      socket.emit('one', gameId, index, targetPlayer);
    }
  },
  {
    name: 'Smaug',
    image: './images/hobbit/',
    description: 'Name a card other than Smaug and choose another player. If that player has that card, he or she is out of the round.',
    power: 1,
    totalCards: 5,
    flavorText: '"I am fire, I am death!"',
    run: function(gameId, index, targetPlayer) {
      socket.emit('one', gameId, index, targetPlayer);
    }
  },
  {
    name: 'Smaug',
    image: './images/hobbit/',
    description: 'Name a card other than Smaug and choose another player. If that player has that card, he or she is out of the round.',
    power: 1,
    totalCards: 5,
    flavorText: '"I am fire, I am death!"',
    run: function(gameId, index, targetPlayer) {
      socket.emit('one', gameId, index, targetPlayer);
    }
  },
  {
    name: 'Smaug',
    image: './images/hobbit/',
    description: 'Name a card other than Smaug and choose another player. If that player has that card, he or she is out of the round.',
    power: 1,
    totalCards: 5,
    flavorText: '"I am fire, I am death!"',
    run: function(gameId, index, targetPlayer) {
      socket.emit('one', gameId, index, targetPlayer);
    }
  },
  {
    name: 'Smaug',
    image: './images/hobbit/',
    description: 'Name a card other than Smaug and choose another player. If that player has that card, he or she is out of the round.',
    power: 1,
    totalCards: 5,
    flavorText: '"I am fire, I am death!"',
    run: function(gameId, index, targetPlayer) {
      socket.emit('one', gameId, index, targetPlayer);
    }
  },
  {
    name: 'Bard the Bowman',
    image: './images/hobbit/',
    description: 'Look at another players hand.',
    power: 2,
    totalCards: 2,
    flavorText: '"If you awaken the beast, it will destroy us all!"',
    run: function(gameId, index, targetPlayer) {
      socket.emit('two', gameId, index, targetPlayer);
    }
  },
  {
    name: 'Bard the Bowman',
    image: './images/hobbit/',
    description: '',
    power: 2,
    totalCards: 2,
    flavorText: '"If you awaken the beast, it will destroy us all!"',
    run: function(gameId, index, targetPlayer) {
      socket.emit('two', gameId, index, targetPlayer);
    }
  },
  {
    name: 'Legolas Greenleaf',
    image: './images/hobbit/',
    description: 'You and another player secretly compare hands. The player with the lower value is out of the round.',
    power: 3,
    totalCards: 1,
    flavorText: '"It is not our fight."',
    run: function(gameId, index, targetPlayer) {
      socket.emit('threelow', gameId, index, targetPlayer);
    }
  },
  {
    name: 'Tauriel',
    image: './images/hobbit/',
    description: 'You and another player secretly compare hands. The player with the higher value is out of the round.',
    power: 3,
    totalCards: 1,
    flavorText: '"This is our Fight!"',
    run: function(gameId, index, targetPlayer) {
      socket.emit('threehigh', gameId, index, targetPlayer);
    }
  },
  {
    name: 'Gandalf the Gray',
    image: './images/hobbit/',
    description: "Until your next turn, ignore all effects from other players' cards.",
    power: 4,
    totalCards: 2,
    flavorText: '"War is comming."',
    run: function(gameId, index, targetPlayer) {
      socket.emit('four', gameId, index, targetPlayer);
    }
  },
  {
    name: 'Gandalf the Gray',
    image: './images/hobbit/',
    description: "Until your next turn, ignore all effects from other players' cards.",
    power: 4,
    totalCards: 2,
    flavorText: '"War is comming."',
    run: function(gameId, index, targetPlayer) {
      socket.emit('four', gameId, index, targetPlayer);
    }
  },
  {
    name: 'Kili the Dwarf and Fili the Dwarf',
    image: './images/hobbit/',
    description: 'Choose any player (including yourself) to discard his or her hand and draw a new card.',
    power: 5,
    totalCards: 2,
    flavorText: '"At your service."',
    run: function(gameId, index, targetPlayer) {
      socket.emit('five', gameId, index, targetPlayer);
    }
  },
  {
    name: 'Kili the Dwarf and Fili the Dwarf',
    image: './images/hobbit/',
    description: 'Choose any player (including yourself) to discard his or her hand and draw a new card.',
    power: 5,
    totalCards: 2,
    flavorText: '"At your service."',
    run: function(gameId, index, targetPlayer) {
      socket.emit('five', gameId, index, targetPlayer);
    }
  },
  {
    name: 'Thorin Oakenshield',
    image: './images/hobbit/',
    description: 'Trade hands with another player of your choice.',
    power: 6,
    totalCards: 1,
    flavorText: '"Will you ride with me, one last time?"',
    run: function(gameId, index, targetPlayer) {
      socket.emit('six', gameId, index, targetPlayer);
    }
  },
  {
    name: 'Bilbo Baggins',
    image: './images/hobbit/',
    description: 'If you have this card and either THORIN OAKENSHIELD or KILI and FILI in your hand, you must discard this card.',
    power: 7,
    totalCards: 1,
    flavorText: '"I did not come to steal from you, O Smaug the Unassessably Wealthy."',
    run: function(gameId, index, targetPlayer) {
      socket.emit('seven', gameId, index, targetPlayer);
    }
  },
  {
    name: 'Arkenstone',
    image: './images/hobbit/',
    description: 'If you discard this card, you are out of the round.',
    power: 8,
    totalCards: 1,
    flavorText: '"You seek that which would bestow upon you the right to rule: the Arkenstone!"',
    run: function(gameId, index, targetPlayer) {
      socket.emit('eight', gameId, index, targetPlayer);
    }
  }
];
