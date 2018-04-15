var conn = require('./kafkaConnection').kafkaConnection();
var crypto = require('crypto');


var TIMEOUT = 8000;
module.exports = new KafkaClient;
var self;

function KafkaClient() {
    this.connection = conn;
    this.requests = {}; //store request by hash id waiting for response
    this.hasResponsQueue = false;
    this.producer = conn.getProducer();

    this.makeRequest = function(topic, content, callback) {
        self = this;
        var correlationId = crypto.randomBytes(16).toString('hex');

        var tId = setTimeout(function(corr_id) {
            console.log('timeout');
            callback(new Error("timeout " + corr_id));
            delete self.requests[corr_id];
        }, TIMEOUT, correlationId);

        self.requests[correlationId] = {
            callback: callback,
            timeout: tId
        };
        this.setupResponseQueue(self.producer, topic, function() {
            console.log('in response before payload setup');
            var payloads = [//payloads must be an array of objects
                {   topic: topic,
                    messages: JSON.stringify({
                        correlationId: correlationId,
                        replyTo: topic+"Reply",
                        data: content
                    }),
                    partition: 0
                }
            ];
            console.log('in response after payloads setup');
            console.log(self.producer.ready);
            self.producer.send(payloads, function(err, data) {
                console.log('in producer send');
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

        //subscription
        var consumer = this.connection.getConsumer(topic+"Reply");
        consumer.on('error', function (err) {
            console.log(err);
        });
        consumer.on('offsetOutOfRange', function (topic) {
            topic.maxNum = 2;
            console.log('offset out of range');
            var offset = self.connection.getOffset();
            offset.fetch([topic], function (err, offsets) {
                if (err) {
                    return console.error(err);
                }
                var min = Math.min.apply(null, offsets[topic.topic][topic.partition]);
                consumer.setOffset(topic.topic, topic.partition, min);
            });
        });
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
        this.hasResponsQueue = true;
        console.log('returning next');
        return next();
    };
}
