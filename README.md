# SmiteSession

### Smite API Session ID generator utilizing ES6 Promises

## Installation
```
npm install smite-session
```

## Usage
Simply require smite-session, set the config, then generate that Session ID
```javascript
var smiteSession = require('smite-session');

smiteSession.set({
    devId: 'XXXX',
    authKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
});

smiteSession.genSession()
    .then(function(data){
    console.log(data);
}).catch(function(error){
    console.error(error);
});
```

## Notes
The response is in JSON format. Here is an example of the structure.
```javascript
{ ret_msg: 'Approved',
  session_id: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  timestamp: '11/15/2015 3:29:29 AM' }
```