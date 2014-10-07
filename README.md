streamfire
==========
[![Build Status](https://travis-ci.org/kelveden/streamfire.png?branch=master)](https://travis-ci.org/kelveden/streamfire)

Simple [Campfire](http://campfirenow.com) client that streams the room to terminal stdout.

Features
--------

* Stream the content from a specified campfire room to stdout.
* Allow sending of messages to the same room via stdin.
* Paste multi-line messages.

That's it. Well, that's not completely true; there are the following bonus features too:

* Auto-complete the name of a user in the room.
* List the users currently logged into the room.
* Open the room in a browser.
* Search a given room for messages matching a specific search term.

To get the most from streamfire you'll need a terminal emulator that supports ANSI colours - Personally, I use [terminology](https://www.enlightenment.org/p.php?p=about/terminology) from the Enlightenment project if only because you just need to click on image links from streamfire to see a popup of the image :-)

Installation
------------
streamfire runs as a nodejs executable. So, to create a global symlink to the streamfire binaries:

    npm install -g streamfire

Or, if you prefer to use from source then take advantage of `npm link`:

    git clone git@github.com:kelveden/streamfire.git
    cd streamfire
    npm install
    sudo npm link
  
That will create a symlink from the source into your global node modules. Reverse the process with `sudo npm unlink`.

Configuration
-------------
streamfire needs to know your Campfire API token and domain. To this end create a file `~/.streamfire/config.json` and put
the following in it:

    {
      "domain": "your-campfire-domain",
      "apiToken": "your-campfire-api-token",
      "alertOn": [ "match1", "match2", ..., "matchX" ],
      "locale": "en-GB",
      "showTodaysAlertsOnStartup": true,
      "rooms": [
        { "id": 1234, "alias": "myroom" },
        { "id": 5678, "alias": "anotherroom" }
      ]
    }

 * The `domain` is your campfirenew domain; e.g. `mydomain.campfirenow.com`. 
 * The `apiToken` is your API authentication token as provided in your "myinfo" section of Campfire itself.
 * The `alertOn` field is a list of text fragments to match against messages in each room. (Each text fragment is treated as a case-insensitive
regular expression internally; so feel free to use regular expressions.) When a match occurs the body of the matching
message will be sent as a notification to the underlying OS. (This is done by pushing the message via
[node-growl](https://github.com/visionmedia/node-growl) so see the documentation for that if you are not getting alerts.)
 * The `locale` field is used to format dates in the room output. (Defaults to "en-GB" if not specified.)
 * If true, the `showTodaysAlertsOnStartup` flag tells streamfire to automatically display all old alerts for the day whenever
 you startup streamfire. (i.e. Exactly the same as pressing 'F4'.) Default is `false`.
 * The `rooms` field allows specification of room aliases so that you can enter the alias rather than the room id at the command line
 (e.g. `streamfire myroom` instead of `streamfire 1234`.)

Usage
-----
### To list all available rooms and aliases

    streamfire

### To join a room:

    streamfire (<your-room-id>|<your-room-alias>)

E.g. `streamfire myroom`. If you connect successfully you'll get shown all the recent messages in the room.

### To search a room:

    streamfire-search (<your-room-id>|<your-room-alias>) <search-term>
    
E.g. `streamfire myroom "some term or other"`. The output will be a list of all messages that match.


Creating new messages
---------------------
 * Simply type into stdin and hit `<Enter>` to send a message to the room.
 * Paste in multi-line text into a single message - but make sure that the last line has a carriage return at the end, otherwise that line won't be sent.
 * Start typing the name of a user already in the room and then use tab to auto-complete.

More goodies
------------

Press `F1` once in a room to get a list of the available hotkeys. They currently are:

 * `F1`: Display help
 * `F2`: List users currently in room
 * `F3`: Open room in default browser
 * `F4`: Re-show alerts from today
 * `F5`: Re-show alerts from yesterday
 * `F6`: Re-show messages from today - useful if lot's of interaction between you and other users has created a bit of a mess on-screen as messages criss-cross stdin and stdout.
