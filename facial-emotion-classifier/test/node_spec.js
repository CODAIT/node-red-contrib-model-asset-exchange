var should = require('should');
var helper = require('node-red-node-test-helper');
var request = require('request');
var node = require('../node.js');

helper.init(require.resolve('node-red'));

describe('facial-emotion-classifier node', function () {

    before(function (done) {
        helper.startServer(done);
    });

    after(function (done) {
        helper.stopServer(done);
    });

    afterEach(function () {
        helper.unload();
    });

    it('should be loaded', function (done) {
        var flow = [{ id: 'n1', type: 'facial-emotion-classifier', name: 'facial-emotion-classifier' }];
        helper.load(node, flow, function () {
            var n1 = helper.getNode('n1');
            n1.should.have.property('name', 'facial-emotion-classifier');
            done();
        });
    });

    it('should handle get_labels()', function (done) {
        var flow = [
            { id: 'n1', type: 'facial-emotion-classifier', name: 'facial-emotion-classifier',
                method: 'get_labels',
                wires: [['n3']],
                service: 'n2' },
            { id: 'n2', type: 'facial-emotion-classifier-service', host: 'https://max-facial-emotion-classifier.max.us-south.containers.appdomain.cloud' },
            { id: 'n3', type: 'helper' }
        ];
        helper.load(node, flow, function () {
            var n3 = helper.getNode('n3');
            var n1 = helper.getNode('n1');
            n3.on('input', function (msg) {
                try {
                    msg.should.have.property('payload', {
                        "count": 8,
                        "labels": [
                          { "id": "0", "name": "neutral" },
                          { "id": "1", "name": "happiness" },
                          { "id": "2", "name": "surprise" },
                          { "id": "3", "name": "sadness" },
                          { "id": "4", "name": "anger" },
                          { "id": "5", "name": "disgust" },
                          { "id": "6", "name": "fear" },
                          { "id": "7", "name": "contempt" }
                        ]
                      }); 
                    done();
                } catch (e) {
                    done(e);
                }
            });
            n1.receive({ payload: '' });
        });
    });
    it('should handle get_model_metadata_api()', function (done) {
        var flow = [
            { id: 'n1', type: 'facial-emotion-classifier', name: 'facial-emotion-classifier',
                method: 'get_model_metadata_api',
                wires: [['n3']],
                service: 'n2' },
            { id: 'n2', type: 'facial-emotion-classifier-service', host: 'https://max-facial-emotion-classifier.max.us-south.containers.appdomain.cloud' },
            { id: 'n3', type: 'helper' }
        ];
        helper.load(node, flow, function () {
            var n3 = helper.getNode('n3');
            var n1 = helper.getNode('n1');
            n3.on('input', function (msg) {
                try {
                    msg.payload.should.have.property('id', 'max-facial-emotion-classifier');
                    done();
                } catch (e) {
                    done(e);
                }
            });
            n1.receive({ payload: '' });
        });
    });
    it('should handle predict()', function (done) {
        var flow = [
            { id: 'n1', type: 'facial-emotion-classifier', name: 'facial-emotion-classifier',
                method: 'predict',
                wires: [['n3']],
                service: 'n2' },
            { id: 'n2', type: 'facial-emotion-classifier-service', host: 'https://max-facial-emotion-classifier.max.us-south.containers.appdomain.cloud' },
            { id: 'n3', type: 'helper' }
        ];
        helper.load(node, flow, function () {
            var n3 = helper.getNode('n3');
            var n1 = helper.getNode('n1');
            n3.on('input', function (msg) {
                try {
                    msg.payload.should.have.keys(['entitiesDetected','prediction']);
                    msg.payload.should.have.property('entitiesDetected', 1);
                    msg.payload.prediction.should.matchAny('anger');
                    done();
                } catch (e) {
                    done(e);
                }
            });
            request('https://raw.githubusercontent.com/IBM/MAX-Facial-Emotion-Classifier/master/assets/angry.jpg', { encoding: null }, function (error, response, body) {
                n1.receive({ payload: Buffer.from(body) });
            });
        });
    });
});
