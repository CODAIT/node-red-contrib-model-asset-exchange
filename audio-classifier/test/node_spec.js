var should = require('should');
var helper = require('node-red-node-test-helper');
var request = require('request');
var node = require('../node.js');

helper.init(require.resolve('node-red'));

describe('audio-classifier node', function () {

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
        var flow = [{ id: 'n1', type: 'audio-classifier', name: 'audio-classifier' }];
        helper.load(node, flow, function () {
            var n1 = helper.getNode('n1');
            n1.should.have.property('name', 'audio-classifier');
            done();
        });
    });

    it('should handle get_metadata()', function (done) {
        var flow = [
            { id: 'n1', type: 'audio-classifier', name: 'audio-classifier',
                method: 'get_metadata',
                wires: [['n3']],
                service: 'n2' },
            { id: 'n2', type: 'audio-classifier-service', host: 'https://max-audio-classifier.max.us-south.containers.appdomain.cloud' },
            { id: 'n3', type: 'helper' }
        ];
        helper.load(node, flow, function () {
            var n3 = helper.getNode('n3');
            var n1 = helper.getNode('n1');
            n3.on('input', function (msg) {
                try {
                    msg.should.have.property('payload', {
                        "id": "audio_embeddings-tf-imagenet",
                        "name": "audio_embeddings TensorFlow Model",
                        "description": "audio_embeddings TensorFlow model trained on Audio Set",
                        "license": "Apache 2.0"
                    });
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
            { id: 'n1', type: 'audio-classifier', name: 'audio-classifier',
                method: 'predict',
                wires: [['n3']],
                service: 'n2' },
            { id: 'n2', type: 'audio-classifier-service', host: 'https://max-audio-classifier.max.us-south.containers.appdomain.cloud' },
            { id: 'n3', type: 'helper' }
        ];
        helper.load(node, flow, function () {
            var n3 = helper.getNode('n3');
            var n1 = helper.getNode('n1');
            n3.on('input', function (msg) {
                try {
                    msg.should.have.property('payload', 'Rain');
                    done();
                } catch (e) {
                    done(e);
                }
            });
            request('https://raw.githubusercontent.com/IBM/MAX-Audio-Classifier/master/assets/thunder.wav', { encoding: null }, function (error, response, body) {
                n1.receive({ payload: Buffer.from(body) });
            });
        });
    });
});
