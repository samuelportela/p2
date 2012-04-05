var countdown = require('./countdown.js'),
  $ = require('jquery'),
  updateCounter;

var timer = new countdown.CountdownTimer({
  seconds: 5,
  onTick: function(hour, minute, second) {
    updateCounter(hour, minute, second);
  },
  onComplete: function() {
    console.log('complete');
  }
});

updateCounter = function(hour, minute, second) {
  console.log(hour + ':' + minute + ':' + second);
}

timer.start();
