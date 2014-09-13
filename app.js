var express = require('express');
var app     = express();
var bodyParser = require('body-parser')
var server  = require('http').createServer(app);
var _ = require('underscore-node');
var geolib = require('geolib');
var Factual = require('factual-api');
var factual = new Factual('r87lYmE5RDLMQOOcETtoZqnLYEvurbTBfUIUAt8y', '6HZGifE7NYj85JvcKnAqQQ0UKn7gYgFzn7oroQGH');
console.log("Node server started on port 5000");
app.use('/', express.static(__dirname + '/'));

app.get('/', function(req,res) {
  res.sendfile(__dirname + '/index.html');
  search = req.query || "";
});

app.get('/locations/:coords', function(req,res) {
  var coordsString = req.params.coords;
  factual.get('/t/places-us', {limit:50, filters:{category_ids:{"$includes_any":[312,347]}}, sort: "$distance", geo:{"$circle":{"$center":[coordsString.substring(0,coordsString.indexOf('&')), coordsString.substring(coordsString.indexOf('&')+1)],"$meters":20000}}}, function (error, response) {
    res.send(response.data)
  });
});


server.listen(process.env.PORT || 5000)
