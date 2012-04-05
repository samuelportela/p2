var $ = require('jquery');

var CountdownTimer = function(options) {
  this.settings = $.extend(
    {   
      seconds: 30,
      onTick: null,
      onComplete: null
    },
    options || {}
  );
};

CountdownTimer.prototype = {

  start: function() {
    this.secondsRemaining = this.settings.seconds;
    this.interval = setInterval($.proxy(this.tick, this), 1000);
  },

  reset: function() {
    if(this.interval){
      clearInterval(this.interval);
    }
    
    this.start();
  },

  tick: function() {
    this.hoursRemaining         = Math.floor(this.secondsRemaining / (60 * 60));

    this.minutesRemaining       = this.secondsRemaining % (60 * 60);
    this.hourMinutesRemaining   = Math.floor(this.minutesRemaining / 60);

    this.minuteSecondsRemaining = this.minutesRemaining % 60;
    this.hourSecondsRemaining   = Math.ceil(this.minuteSecondsRemaining);

    this.fHrs = this.formatNumber(this.hoursRemaining);
    this.fMins = this.formatNumber(this.hourMinutesRemaining);
    this.fSecs = this.formatNumber(this.hourSecondsRemaining);

    if (this.settings.onTick) {
      this.settings.onTick(this.fHrs, this.fMins, this.fSecs);
    }
    
    if(this.secondsRemaining == 0) {
      this.complete();
    }
    
    this.secondsRemaining -= 1;
  },

  complete: function() {
    clearInterval(this.interval);
    if(this.settings.onComplete){
      this.settings.onComplete();
    }
  },

  formatNumber: function(n) {
    var s = String(n);
    if(s.length == 1){
      s = '0' + s;
    }
    return s;
  }
};

module.exports.CountdownTimer = CountdownTimer;
