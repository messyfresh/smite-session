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


function SessionSchedule(devId, authKey, mongoUrl){schedule.scheduleJob('0,10,20,30,40,50 * * * *', function createSession(){
    
    if (devId == null){
        devId = process.env.devId;
    }
    if (authKey == null){
        authKey = process.env.authKey;
    }
    if (mongoUrl == undefined){
        mongoUrl = process.env.mongoUrl;
    }

    var utcTime = moment().utc().format("YYYYMMDDHHmmss"),
        sessionHash = md5(devId + "createsession" + authKey + utcTime),
        fullUrl = ('http://api.smitegame.com/smiteapi.svc/' + 'createsessionJson/' + devId + '/' + sessionHash + '/' + utcTime);

request({url: fullUrl}, function(error, response, body){
    var jsonBody = JSON.parse(body);
    if(jsonBody.ret_msg == 'Approved'){
        mongo.connect(mongoUrl, function(err, db){
            if(err){
                console.log("MongoDB Connect Error: " + err);
            } else {
                var collection = db.collection('sessionid');
                collection.remove({}, {w: 0});
                collection.insert({ ret_msg: jsonBody.ret_msg, session_id: jsonBody.session_id, timestamp: jsonBody.timestamp}, function(err){
                    if(err){
                        console.log("Mongo Insert Error: " + err);
                    }
                    db.close();
                });
            }
        });
    } else {
        console.log("API ERROR: ");
        console.log(jsonBody);
        console.log(utcTime);
    }
});
});
}


exports.devId = devId;
exports.authKey = authKey;
exports.mongoUrl = mongoUrl;
exports.SessionSchedule = SessionSchedule;
