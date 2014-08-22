var request = require('request'),
    JSONStream = require('JSONStream'),
    when = require('when');

exports.configure = function (config) {

    function responseResolver(deferred, bodyParser) {
        return function (error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (bodyParser) {
                    deferred.resolve(bodyParser(body));
                } else {
                    deferred.resolve();
                }
            }
        }
    }

    return  {
        /**
         * Gets the details for the specified user. Returns a promise.
         */
        getUser: function (userId) {
            var deferred = when.defer();

            request.get('https://' + config.domain + '.campfirenow.com/users/' + userId + '.json',
                responseResolver(deferred, function (body) {
                    return JSON.parse(body).user;
                }))
                .auth(config.apiToken, 'X');

            return deferred.promise;
        },

        /**
         * Sends a join request to the specified Campfire room. Returns a promise.
         */
        joinRoom: function (roomId) {
            var deferred = when.defer();

            request.post('https://' + config.domain + '.campfirenow.com/room/' + roomId + '/join.json',
                responseResolver(deferred))
                .auth(config.apiToken, 'X');

            return deferred.promise;
        },

        /**
         * Gets the most recent messages for the specified room. Returns a promise.
         */
        getRecentMessages: function (roomId) {
            var deferred = when.defer();

            request.get('https://' + config.domain + '.campfirenow.com/room/' + roomId + '/recent.json',
                responseResolver(deferred, function (body) {
                    return JSON.parse(body).messages;
                }))
                .auth(config.apiToken, 'X');

            return deferred.promise;
        },

        /**
         * Posts the specified message to the specified room.
         */
        postMessage: function (roomId, message) {
            var deferred = when.defer();

            request.post({
                url: 'https://' + config.domain + '.campfirenow.com/room/' + roomId + '/speak.json',
                auth: {
                    user: config.apiToken,
                    pass: 'X'
                },
                json: {
                    message: message
                }
            }, responseResolver(deferred));

            return deferred.promise;
        },

        /**
         * Opens a stream to the specified room.
         */
        openRoomStream: function (roomId) {
            return request.get('https://streaming.campfirenow.com/room/' + roomId + '/live.json')
                .auth(config.apiToken, 'X')
                .pipe(JSONStream.parse());
        }
    }
}
