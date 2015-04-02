// Credentials
var devId = process.env.DEVID;
var authKey = process.env.AUTHKEY;
var mongoUrl = process.env.MONGOLAB_URI;

// Variables used for app
var md5 = require('MD5'),
    mongo = require('mongodb').MongoClient,
    request = require('request'),
    moment = require('moment'),
    schedule = require('node-schedule');

var utcTime = moment().utc().format("YYYYMMDDHHmmss"),
    sessionHash = md5(devId + "createsession" + authKey + utcTime),
    fullUrl = ('http://api.smitegame.com/smiteapi.svc/' + 'createsessionJson/' + devId + '/' + sessionHash + '/' + utcTime);

if (devId == null) {
    devId = process.env.DEVID;
}
if (authKey == null) {
    authKey = process.env.AUTHKEY;
}
if (mongoUrl == undefined) {
    mongoUrl = process.env.MONGOLAB_URI;
}


function SessionSchedule() {
    schedule.scheduleJob('0,10,20,30,40,50 * * * *', function createSession() {
        console.log("Starting Create Session");

        request({
            url: fullUrl
        }, function(error, response, body) {
            try {
                var jsonBody = JSON.parse(body);
            } catch(err){
                console.log("JSON Parse error: " + err);
                console.log("Trying Again");
                createSession();
            }
            if (jsonBody.ret_msg == 'Approved') {
                mongo.connect(mongoUrl, function(err, db) {
                    if (err) {
                        console.log("MongoDB Connect Error: " + err);
                    } else {
                        var collection = db.collection('sessionid');
                        collection.remove({}, {
                            w: 0
                        }, function(err, response){
                            if (err) throw err;
                            else if (response !== null){
                                console.log(response);
                            } else {
                                collection.insert({
                                    ret_msg: jsonBody.ret_msg,
                                    session_id: jsonBody.session_id,
                                    timestamp: jsonBody.timestamp
                                }, console.log("Inserted: " + jsonBody.session_id + " into DB"), function (err) {
                                    if (err) {
                                        console.log("Mongo Insert Error: " + err);
                                    }
                                    db.close();
                                });
                            }
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

SessionSchedule();

exports.devId = devId;
exports.authKey = authKey;
exports.mongoUrl = mongoUrl;
exports.SessionSchedule = SessionSchedule;