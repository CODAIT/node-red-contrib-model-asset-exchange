var should = require('should');
var helper = require('node-red-node-test-helper');
var node = require('../node.js');

helper.init(require.resolve('node-red'));

describe('inception-resnet-v2 node', function () {

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
        var flow = [{ id: 'n1', type: 'inception-resnet-v2', name: 'inception-resnet-v2' }];
        helper.load(node, flow, function () {
            var n1 = helper.getNode('n1');
            n1.should.have.property('name', 'inception-resnet-v2');
            done();
        });
    });

    it('should handle get_metadata()', function (done) {
        var flow = [
            { id: 'n1', type: 'inception-resnet-v2', name: 'inception-resnet-v2',
                method: 'get_metadata',
                wires: [['n3']],
                service: 'n2' },
            { id: 'n2', type: 'inception-resnet-v2-service', host: 'http://max-inception-resnet-v2.max.us-south.containers.appdomain.cloud' }, // hosted instance URL
            { id: 'n3', type: 'helper' }
        ];
        helper.load(node, flow, function () {
            var n3 = helper.getNode('n3');
            var n1 = helper.getNode('n1');
            n3.on('input', function (msg) {
                try {
                    msg.should.have.property('payload', {
                                             "id":"inception_resnet_v2-keras-imagenet",
                                             "name":"inception_resnet_v2 Keras Model",
                                             "description":"inception_resnet_v2 Keras model trained on ImageNet",
                                             "license":"Apache2"}); // metadata endpoint response
                    done();
                } catch (e) {
                    done(e);
                }
            });
            n1.receive({ payload: '' }); // metadata method does not require an input
        });
    });
    it('should handle predict()', function (done) {
        var flow = [
            { id: 'n1', type: 'inception-resnet-v2', name: 'inception-resnet-v2',
                method: 'predict',
                wires: [['n3']],
                service: 'n2' },
            { id: 'n2', type: 'inception-resnet-v2-service', host: 'http://max-inception-resnet-v2.max.us-south.containers.appdomain.cloud' }, // hosted instance URL
            { id: 'n3', type: 'helper' }
        ];
        helper.load(node, flow, function () {
            var n3 = helper.getNode('n3');
            var n1 = helper.getNode('n1');
            n3.on('input', function (msg) {
                try {
                    msg.should.have.property('payload', 'tabby'); // response for below input
                    done();
                } catch (e) {
                    done(e);
                }
            });
            n1.receive({ payload: 'https://raw.githubusercontent.com/IBM/MAX-Inception-ResNet-v2/master/assets/cat.jpg' }); // input payload from pre-packaged assets
        });
    });
});
