var server = require('http').createServer()
  , url = require('url')
  , WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ server: server })
  , express = require('express')
  , app = express()
  , uuid = require('uuid/v4')
  , port = process.env.PORT || 4080

app.use(function (req, res) {
  res.send({ msg: "hello" }); // change to variable locations once test passes
});

var totem = {}
totem.broadcast = function(dataString) {
  console.log(dataString);
  // TODO: don't broadcast back to the original client
  wss.clients.forEach(function each(client){
    client.send(dataString);
  });
}
totem.onMessage = function(msgJson) {
  totem.broadcast(msgJson);
}
totem.onConnect = function connection(ws) {
  console.log("Client connected");
  ws.on('message', totem.onMessage);
  ws.totemId = uuid();
  ws.send(JSON.stringify({type: "newConnection", id: ws.totemId}));
  ws.send(JSON.stringify({id: "UIC", latitude: 41.874937, longitude: -87.652971, description: "whatever", name: "whatever"}));
  ws.send(JSON.stringify({id: "Jak", latitude: 41.877761, longitude: -87.649725, description: "whatever", name: "whatever"}));
}

wss.on('connection', totem.onConnect);
server.on('request', app);
server.listen(port, function () { console.log('Listening on ' + server.address().port) });
