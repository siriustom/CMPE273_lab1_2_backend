var kafka = require('kafka-node');

function kafkaConnection() {
    this.getConsumer = function(topic) {
        if (!this.kafkaConsumer) {
            this.client = new kafka.Client("localhost:2181");//a client connection to zookeeper and brokers
            this.kafkaConsumer = new kafka.Consumer(this.client, [{ topic: topic, partition: 0 }]);
            this.client.on('ready', function () {
                console.log('consumer ready!')
            })
        }
        return this.kafkaConsumer;
    };

    this.getProducer = function() {
        if (!this.kafkaProducer) {
            this.client = new kafka.Client("localhost:2181");//a client connection to zookeeper and brokers
            var HighLevelProducer = kafka.HighLevelProducer;
            this.kafkaProducer = new HighLevelProducer(this.client);
            console.log('producer ready');
        }
        return this.kafkaProducer;
    };
}
exports = module.exports = new kafkaConnection;