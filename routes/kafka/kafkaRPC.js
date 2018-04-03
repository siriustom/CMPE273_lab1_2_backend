var crypto = require('crypto');
var conn = require('./kafkaConnection');

var TIMEOUT = 8000;
var self;

exports = module.exports =  kafkaRPC;

function kafkaRPC() {
    self = this;
    this.connection = conn;
    this.requests = {}; //store request by hash id waiting for response
    this.hasResponsQueue = false;
    this.producer = this.connection.getProducer();

    this.makeRequest = function(topic, content, callback) {
        self = this;
        var correlationId = crypto.randomBytes(16).toString('hex');

        var tId = setTimeout(function(corr_id) {
            console.log('timeout');
            callback(new Error("timeout " + corr_id));
            delete self.requests[corr_id];
        }, TIMEOUT, correlationId);

        var entry = {
            callback: callback,
            timeout: tId
        };

        self.requests[correlationId] = entry;
        self.setupResponseQueue(self.producer, topic, function() {
            console.log('in response before payload setup');
            var payloads = [//payloads must be an array of objects
                {   topic: topic,
                    messages: JSON.stringify({
                        correlationId: correlationId,
                        replyTo: 'response',
                        data: content
                    }),
                    partition: 0
                }
            ];
            console.log('in response after payloads setup');
            console.log(self.producer.ready);
            self.producer.send(payloads, function(err, data) {
                console.log('in response send callback has been called');
                if (err) {
                    console.log(err);
                }
                console.log(data);
            });
        });
    };

    this.setupResponseQueue = function(producer, topic, next) {
        if (this.hasResponsQueue) {
            return next();
        }
        console.log('there is not a response queue');
        self = this;

        //subscription
        var consumer = self.connection.getConsumer('response');
        consumer.on('message', function (message) {
            console.log('message received');
            var data = JSON.parse(message.value);
            var correlationId = data.correlationId;
            if (correlationId in self.requests) {
                var entry = self.requests[correlationId];
                clearTimeout(entry.timeout);
                delete self.requests[correlationId];
                entry.callback(null, data.data);
            }
        });
        self.hasResponsQueue = true;
        console.log('returning next');
        return next();
    };
}
