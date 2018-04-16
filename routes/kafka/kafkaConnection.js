var kafka = require('kafka-node');

module.exports.kafkaConnection = function() {
     var getConsumer = function () {
        if (!this.kafkaConsumer) {
            this.client = new kafka.Client("localhost:2181");//a client connection to zookeeper and brokers
            this.kafkaConsumer = new kafka.Consumer(this.client,
                [
                    { topic: 'loginReply', partition: 0 },
                    { topic: 'postprojectReply', partition: 0 },
                    { topic: 'registerReply', partition: 0 },
                    { topic: 'profileeditReply', partition: 0 },
                    { topic: 'allprojectsReply', partition: 0}
                    { topic: 'getbidlistReply', partition: 0}
                    { topic: 'bidReply', partition: 0}
                    { topic: 'hireReply', partition: 0}
                    { topic: 'makepaymentReply', partition: 0}
                    { topic: 'yourallprojectsReply', partition: 0}
                    { topic: 'searchbarbynameReply', partition: 0}
                ]);
            this.client.on('ready', function () {
                console.log('consumer ready!')
            })
        }
        return this.kafkaConsumer;
    };

    var getProducer = function() {
        if (!this.kafkaProducer) {
            this.client = new kafka.Client("localhost:2181");//a client connection to zookeeper and brokers
            var HighLevelProducer = kafka.HighLevelProducer;
            this.kafkaProducer = new HighLevelProducer(this.client);
            console.log('producer ready');
        }
        return this.kafkaProducer;
    };

    var getOffset = function () {
        if (! this.kafkaOffset) {
            this.client = new kafka.Client("localhost:2181");//a client connection to zookeeper and brokers
            this.kafkaOffset = new kafka.Offset(this.client);
        }
        return this.kafkaOffset;
    };

    return {
        getConsumer: getConsumer,
        getProducer: getProducer,
        getOffset: getOffset
    }
};
