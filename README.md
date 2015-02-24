# SmiteSession
Smite API Session ID Generator automation to MongoDB.  Focus on your smite app instead of worrying about expiring session ids.

# How to use
Simply install with npm

```
npm install smite-session
```

There are 3 attributes you need to assign as environment variables to get started.
The following commands are for Ubuntu.

```
export DEVID=XXXX
export AUTHKEY=XXXXXXXXXXXXXXXXXX
export MONGOLAB_URI=mongodb://localhost:27017/database
```

You can also assign these variables manually in your script (not recommended!)
After that simply include it in your script

```javascript
var smitesession = require('smite-session')
```

Then set it and forget it!!!

```javascript
smitesession.SessionSchedule();
```

The script will obtain a new Session Id every 10 minutes (To be safe) and push
it to the MongoDB. The way it is stored is as follows:

```
_id: {
    $oid: Randomly Generated Id
    },
    ret_msg: Approved  (If all went well)
    session_id: (session id)
    timestamp: Server returned timestamp
```

The script will also delete any old expired session ids, to maintain
a small database size.

The script will send a console message if there is an error.
The error with be the returned "ret_msg" from the Smite API Server along with a UTC Timestamp.

Feel free to fork this repo and hack away at it.  If you come up with some
great improvements let me know!