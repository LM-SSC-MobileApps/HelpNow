var Twitter = require('twitter');
var http = require('http');
var client;
var keywords;
var lastTweetID;

var helpRequest = { EventID: '1', RequestStateID: '1', Notes: 'Reported from Twitter', AreaSize: '0.25', UnitOfMeasure: 'km', Quantity: '1', RequestUrgencyID: '1', LAT: '23.733', LONG: '90.416', ResourceTypeID: '1' };

var options = {
    host: 'localhost',
    path: '/api/resourcerequest',
    port: '8080',
    auth: 'a1ada5ab-b8c2-11e5-847d-00ffd0ea9272:H3lpN0w2016',
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
    }
};

var lastIDOptions = {
    host: 'localhost',
    path: '/api/socialmedia/1',
    port: '8080',
    auth: 'a1ada5ab-b8c2-11e5-847d-00ffd0ea9272:H3lpN0w2016',
    method: 'PUT',
    headers: {
        "Content-Type": "application/json"
    }
}

var keywordOptions = {
    host: 'localhost',
    path: '/api/event',
    port: '8080',
    auth: 'a1ada5ab-b8c2-11e5-847d-00ffd0ea9272:H3lpN0w2016',
    method: 'GET',
    headers: {
        "Content-Type": "application/json"
    }
};

var socialMediaOptions = {
    host: 'localhost',
    path: '/api/socialmedia',
    port: '8080',
    auth: 'a1ada5ab-b8c2-11e5-847d-00ffd0ea9272:H3lpN0w2016',
    method: 'GET',
    headers: {
        "Content-Type": "application/json"
    }
}

keywordCallback = function (response) {
    var str = '';
    response.on('data', function (chunk) {
        str += chunk;
        //console.log(str);
    });

    response.on('end', function () {

        var jsonObject = JSON.parse(str);
        var events = jsonObject.json;
        var keywordStr = '';
        for (var i = 0; i < events.length; i++) {
            if (events[i].Keywords != null) {
                keywordStr += events[i].Keywords;
                keywords = keywordStr.split(',');
                for (var j = 0; j < keywords.length; j++) {
                    keywords[j] = keywords[j].trim();
                    searchTwitter(keywords[j], events[i].EventID);
                }
                keywordStr = '';
            }
        }
        //console.log(keywords);
    });
}

resourceRequestCallback = function (response) {
    var str = '';
    response.on('data', function (chunk) {
        str += chunk;
    });

    response.on('end', function () {
        //console.log(str);
    });
}

socialMediaCallback = function (response) {
    var str = '';
    response.on('data', function (chunk) {
        str += chunk;
    });

    response.on('end', function () {
        var jsonObject = JSON.parse(str);
        lastTweetID = jsonObject.json[0].LastRecordedID;
        //console.log(lastTweetID);
    });
}

lastIDCallback = function (response) {
    var str = '';
    response.on('data', function (chunk) {
        str += chunk;
    });

    response.on('end', function () {
        console.log(str);
    });
}

module.exports.setupTwitter = function () {
    client = new Twitter({
        consumer_key: "aqdTWpE3FgXVDUA05tRdM15l2",
        consumer_secret: "1T9BwntvJKXQyQ7KDIAEQVCiQH71yqrVoS4DD9YxYaq47mfplq",
        access_token_key: "1413814112-7n1rv7B2SvUw4AUx69e7FljcN3k9hs7asRiXEwg",
        access_token_secret: "DbkRa4Q3zVXFyg6OLPRjMojF9AXVOtO9Bk7grpnRnPt8p"
    });
};

module.exports.getSocialMediaKeywords = function () {
    getLastTwitterId();
    var req = http.request(keywordOptions, keywordCallback).end();
}

function getLastTwitterId() {
    var req = http.request(socialMediaOptions, socialMediaCallback).end();
}

function searchTwitter(queryParameter, eventID) {
    var lastID = 0;
    client.get('search/tweets', { q: queryParameter, since_id: lastTweetID }, function (error, tweets, response) {
        if (error) {
            console.log(error);
        }
        else {
            for (i = 0; i < tweets.statuses.length; i++) {
                if (tweets.statuses[i].id_str > lastID)
                    lastID = tweets.statuses[i].id_str;
                //console.log(tweets.statuses[i].id + ' ' + tweets.statuses[i].text);
                if (tweets.statuses[i].text.indexOf(queryParameter) > -1 && tweets.statuses[i].text.indexOf("food") > -1) {
                    console.log(tweets.statuses[i].text);
                    helpRequest.ResourceTypeID = 2;
                    var req = http.request(options, resourceRequestCallback);
                    req.write(JSON.stringify(helpRequest));
                    req.end();
                }
                if (tweets.statuses[i].text.indexOf(queryParameter) > -1 && tweets.statuses[i].text.indexOf("water") > -1) {
                    console.log(tweets.statuses[i].text);
                    helpRequest.ResourceTypeID = 1;
                    var req = http.request(options, resourceRequestCallback);
                    req.write(JSON.stringify(helpRequest));
                    req.end();
                }
                if (tweets.statuses[i].text.indexOf(queryParameter) > -1 && tweets.statuses[i].text.indexOf("medicine") > -1) {
                    console.log(tweets.statuses[i].text);
                    helpRequest.ResourceTypeID = 6;
                    var req = http.request(options, resourceRequestCallback);
                    req.write(JSON.stringify(helpRequest));
                    req.end();
                }
                if (tweets.statuses[i].text.indexOf(queryParameter) > -1 && tweets.statuses[i].text.indexOf("shelter") > -1) {
                    console.log(tweets.statuses[i].text);
                    helpRequest.ResourceTypeID = 3;
                    var req = http.request(options, resourceRequestCallback);
                    req.write(JSON.stringify(helpRequest));
                    req.end();
                }
                if (tweets.statuses[i].text.indexOf(queryParameter) > -1 && tweets.statuses[i].text.indexOf("medical") > -1) {
                    console.log(tweets.statuses[i].text);
                    helpRequest.ResourceTypeID = 4;
                    var req = http.request(options, resourceRequestCallback);
                    req.write(JSON.stringify(helpRequest));
                    req.end();
                }
                if (tweets.statuses[i].text.indexOf(queryParameter) > -1 && tweets.statuses[i].text.indexOf("clothing") > -1) {
                    console.log(tweets.statuses[i].text);
                    helpRequest.ResourceTypeID = 5;
                    var req = http.request(options, resourceRequestCallback);
                    req.write(JSON.stringify(helpRequest));
                    req.end();
                }
                if (tweets.statuses[i].text.indexOf(queryParameter) > -1 && tweets.statuses[i].text.indexOf("rescue") > -1) {
                    console.log(tweets.statuses[i].text);
                    helpRequest.ResourceTypeID = 8;
                    var req = http.request(options, resourceRequestCallback);
                    req.write(JSON.stringify(helpRequest));
                    req.end();
                }
                if (tweets.statuses[i].text.indexOf(queryParameter) > -1 && tweets.statuses[i].text.indexOf("evacuation") > -1) {
                    console.log(tweets.statuses[i].text);
                    helpRequest.ResourceTypeID = 7;
                    var req = http.request(options, resourceRequestCallback);
                    req.write(JSON.stringify(helpRequest));
                    req.end();
                }
            }
            if (lastID > 0) {
                
                var socialMediaObject = { LastRecordedID: lastID }
                var req = http.request(lastIDOptions, lastIDCallback);
                req.write(JSON.stringify(socialMediaObject));
                req.end();
            }
            //console.log("Query Parameter: " + queryParameter + " Event ID: " + eventID + " Last ID: " + lastID);
        }
    });
};