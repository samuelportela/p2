var express = require('express'),
  nowjs = require("now"),
  countdown = require('./countdown.js'),
  $ = require('jquery'),
  allowedRequesters = [],
  port,
  app,
  everyone,
  timer,
  updateCounter;

timer = new countdown.CountdownTimer({
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

// configuring application
allowedRequesters.push('127.0.0.1');
port = 8000;

// initializing expressjs
app = express.createServer();
app.listen(port);

// initializing nowjs
everyone = nowjs.initialize(app);

// nowjs code
everyone.now.sendMessage = function (message) {
    everyone.now.receberMensagem(this.now.name, message);
};

// expressjs code
app.use(express.bodyParser());

app.all('*', function (request, response, next) {
    if (allowedRequesters.indexOf(request.connection.remoteAddress) != -1) {
        next();
    } else {
        // console.log('This address does not have access: ' + request.connection.remoteAddress + '\n');
        response.writeHead(404);
        response.write('Your address: ' + request.connection.remoteAddress + '\n');
        response.end();
    }
});

app.get('/', function (request, response) {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    response.write('Your address: ' + request.connection.remoteAddress + '\n');
    response.end();
});

app.post('/message', function (request, response) {
    everyone.now.receberMensagem('Mensagem do sistema', request.body.message);
    response.end();
});
