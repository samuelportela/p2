var express = require('express'),
  Faye = require('faye'),
  port,
  allowedRequesters,
  expressServer,
  fayeServer;

port = 8000;
allowedRequesters = ['127.0.0.1'];

expressServer = express.createServer();
expressServer.use(express.bodyParser());

fayeServer = new Faye.NodeAdapter({mount: '/faye'});

expressServer.all('*', function (request, response, next) {
  if (allowedRequesters.indexOf(request.connection.remoteAddress) == -1) {
    response.writeHead(403);
    response.end();
  } else {
    next();
  }
});

expressServer.post('/notifyBidCreation', function(req, res) {
  fayeServer.getClient().publish('/auctionsChannel', {
    userDisplayName: req.body.userDisplayName,
    auctionId: req.body.auctionId,
    auctionEndPrice: req.body.auctionEndPrice,
    auctionRemainingTime: req.body.auctionRemainingTime
  });
  
  fayeServer.getClient().publish('/remainingBidsChannel/' + req.body.userId, {
    userBidsToDecrease: req.body.userBidsToDecrease
  });
  
  res.send(req.body);
});

fayeServer.attach(expressServer);
expressServer.listen(port);
