// Get all of the required NPM Modules
// ---------------------------------------------------------------------
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var parseString = require('xml2js');

// Setup the Express Server
// ---------------------------------------------------------------------
// need to forward port 80 to port 3000 for the server to work properly.
// sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
var app     = express();
var port    = 3000;

// static files for the server
app.use('/static', express.static('/vagrant/public_html'));

// other routes for various calls
app.get('/', function (req, res) {

    console.log("All query strings: " + JSON.stringify(req.query));

    if(isEmptyObject(req.query)){
        console.log('no query strings');
        res.send('no items to get');
    }

    if(req.query.hasOwnProperty('url')){
        var scrapedData = screenScrape(req.query.url);
        console.log(scrapedData);

        if(scrapedData){
            console.log('sending data');
            res.send(scrappedData);
        } else {
            console.log('something is wrong');
            res.send('something wrong');
        }
    }
});

// screen scrape example
app.get('/hours', function(req,res){
    request('https://lib.wvu.edu/', function(error, response, body){
        // if it exists get the data and put it into a json array
        if(!error && response.statusCode == 200){
            var $ = cheerio.load(body);
            var hours = $('.libraries ul').html();
            var hoursJson = { htmlHours: hours};
            res.json(hoursJson);
        }
    });
});

app.get('/serverHTML', function(req,res){
    request('http://localhost:3000/static/index.html', function(error, response, body){
        // if it exists get the data and put it into a json array
        if(!error && response.statusCode == 200){
            var $ = cheerio.load(body);
            var text = $('p').html();
            var time = $('time').html();
            var jsonElm = { content:text, time: time};
            res.json(jsonElm);
        }
    });
});

app.get('/json', function(req, res){
    request('http://localhost:3000/static/index.json', function(error, response, jsonData){
        if(!error && response.statusCode == 200){
            res.json(JSON.parse(jsonData));
        }
    });
});

app.get('/xml', function(req,res){
    request('http://localhost:3000/static/index.xml', function(error, response, xmlData){
        if(!error && response.statusCode == 200){
            parseString.parseString(xmlData, { explicitArray : false, ignoreAttrs : true }, function (err, result) {
                res.json(result);
            });
        }
    });
});

app.listen(3000, function () {
  console.log('The WVULibsGetter is getting your stuff.');
});

function isEmptyObject(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}