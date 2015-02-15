// Credentials
var devId = process.env.devId;
var authKey = process.env.authKey;
var mongoUrl = process.env.mongoUrl;

// Variables used for app
var md5 = require('MD5'),
    mongo = require('mongodb').MongoClient,
    request = require('request'),
    moment = require('moment'),
    schedule = require('node-schedule');


schedule.scheduleJob('0,10,20,30,40,50 * * * *', function createSession(){
//schedule.scheduleJob('* * * * *', function createSession(){

    var utcTime = moment().utc().format("YYYYMMDDHHmmss"),
        sessionHash = md5(devId + "createsession" + authKey + utcTime),
        fullUrl = ('http://api.smitegame.com/smiteapi.svc/' + 'createsessionJson/' + devId + '/' + sessionHash + '/' + utcTime);

request({url: fullUrl}, function(error, response, body){
    var jsonBody =JSON.parse(body);
    if(jsonBody.ret_msg == 'Approved'){
        mongo.connect(mongoUrl, function(err, db){
            if(err){
                console.log("MongoDB Connect Error: " + err);
            } else {
                var collection = db.collection('sessionid');
                collection.remove({}, {w: 0});
                collection.insert({_id: utcTime, session_id: jsonBody.session_id}, function(err){
                    if(err){
                        console.log(err);
                    }
                    db.close();
                });
            }
        });
    } else {
        console.log(jsonBody);
        console.log(utcTime);
    }
});
});

console.log("SmiteSession Running");