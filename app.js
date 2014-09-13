var express = require('express');
var app     = express();
var bodyParser = require('body-parser')
var server  = require('http').createServer(app);
var _ = require('underscore-node');
var geolib = require('geolib');
var Factual = require('factual-api');
var factual = new Factual('r87lYmE5RDLMQOOcETtoZqnLYEvurbTBfUIUAt8y', '6HZGifE7NYj85JvcKnAqQQ0UKn7gYgFzn7oroQGH');
console.log("Node server started on port 5000");
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded()); // to support URL-encoded bodies

app.use('/', express.static(__dirname + '/'));
app.get('/', function(req,res) {
  res.sendfile(__dirname + '/index.html');
  search = req.query || "";
});

app.get('/locations', function(req, res){
  res.send('hi')
})

factual.get('/t/places-us', {geo:{"$circle":{"$center":[34.058583, -118.416582],"$meters":1000}}}, function (error, res) {
  // console.log(res.data);
});


server.listen(process.env.PORT || 5000)
