var md5 = require('md5');
var _assign = require('lodash.assign');
var moment = require('moment');
var http = require('http');

//Establish config
var config = {
    devId: null,
    authKey: null
};

function set(update){
    _assign(config, update);
}


function genSession(options){

    var devId = config.devId;
    var authKey = config.authKey;
    var utcTime = new moment().utc().format("YYYYMMDDHHmmss");
    var authHash = md5(devId + "createsession" + authKey + utcTime);
    var baseUrl = 'http://api.smitegame.com/smiteapi.svc/createsessionjson/';
    var sessionUrl = baseUrl + devId + '/' + authHash + '/' + utcTime;

    return new Promise(function(resolve, reject){
        http.get(sessionUrl, function(res){
            console.log(utcTime);
            if(200 !== res.statusCode){
                reject(new Error(res.statusMessage));
            }else{
                var body = '';
                res
                    .on('data', function(chunk){
                            body += chunk;
                        }
                    )
                    .on('end', function(){
                            //console.log('body data: ' + body);
                            resolve(JSON.parse(body));
                        }
                    );
            }
        }).on('error', function(error){
            console.error(error);
            reject(new Error('error making API call: ' + error));//TODO: check if JSON
        });
    });
}

module.exports.set = set;
module.exports.genSession = genSession;