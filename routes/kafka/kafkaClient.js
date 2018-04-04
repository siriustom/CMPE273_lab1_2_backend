var kafkaRPC = new (require('./kafkaRPC'))();

function make_request(topic, payload, callback) {
    console.log('i am in make request');
    console.log(payload.username);
    kafkaRPC.makeRequest(topic, payload, function(err, response) {

        if (err) {
            console.error(err);
        } else {
            console.log("response", response);
            callback(null, response);
        }
    });
}

exports.make_request = make_request;
