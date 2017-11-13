/**
 * Created by joshtanke on 11/6/17.
 */
console.log('The server is starting');

var states = [" AL", " AK", " AZ", " AR", " CA", " CO", " CT", " DC", " DE", " FL", " GA",
    " HI", " ID", " IL", " IN", " IA", " KS", " KY", " LA", " ME", " MD",
    " MA", " MI", " MN", " MS", " MO", " MT", " NE", " NV", " NH", " NJ",
    " NM", " NY", " NC", " ND", " OH", " OK", " OR", " PA", " RI", " SC",
    " SD", " TN", " TX", " UT", " VT", " VA", " WA", " WV", " WI", " WY"];


var express = require("express"),
    app = require("express")(),
    http = require("http").Server(app),
    io = require("socket.io")(http),
    util = require("util"),
    fs = require("fs"),
    url = require('url'),
    twit = require('twit'),
    request = require('request');


var t = new twit({
    consumer_key:           'Bcr0OHT5Ic3lxZp8WP8hqnICm',
    consumer_secret:        'QAL0tndRxOmZeMqsGLezkczIshBSsFQ3t6A2iQNVrJy4o2Nr0b',
    access_token:           '927742788178870273-P8iLYQLiAuzqiAqsb9dGdr6N0Z9vZXn',
    access_token_secret:    'zDGenJnZHA20YkRiyw3XvpPuP1H857lfGiz3WkVC0wBgu'
});



app.use(express.static(__dirname));
app.get("/", function(req, res) {
    res.sendfile(__irname + "/index.html");
});


var stream = null;
http.listen(5000);



io.sockets.on('connection', function(socket){
    console.log('User Connected');

    socket.on('client_data', function(data){
        console.log('Search for tweets containing: ' + data);
        stream = t.stream('statuses/filter', { track: data });

        stream.on('tweet', function (tweet) {

            if (tweet.user.location != null){
                console.log(tweet)

                if (states.includes((tweet.user.location).slice(-3))){

                    var url = 'http://nominatim.openstreetmap.org/search/' + tweet.user.location + '?format=json';
                    request({
                        url: url,
                        json: true
                    }, function (error, response, body) {

                        if (!error && response.statusCode === 200) {
                            if (body[0] != undefined){
                                var locationOutput = {"lat": Number(body[0].lat), "lng": Number(body[0].lon)};
                                socket.broadcast.emit('location', locationOutput);
                                socket.emit('location', locationOutput);


                            }
                        }
                    });


                }
            }
        })
    });

    socket.on('stop', function () {
        stream.stop();
        console.log('Stream Stopped');
    });

    socket.on('clear', function () {
        stream.stop();
        console.log('Map Cleared');
    });

    socket.on('disconnect', function() {
        if (stream != null){
            stream.stop();
        }
        console.log('User Disconnected');
    });
});