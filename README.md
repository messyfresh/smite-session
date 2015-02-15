# SmiteSession
Smite API Session ID Generator automation to MongoDB.  Focus on your smite app instead of worrying about expiring session id's.

# How to use
There are 3 attributes you need to assign as environment variables to get started.
The following commands are for Ubuntu.

```
export devId=XXXX
export authKey=XXXXXXXXXXXXXXXXXX
export mongoUrl=mongodb://localhost:27017/database
```

After that simply use

```
npm start
```

And off it goes!!!

The script is only send a console message if there is an error.
The error with be the returned "ret_msg" along with a UTC Timestamp.

Feel free to fork this repo and hack away at it.  If you come up with some
great improvements let me know and we can pull the code.