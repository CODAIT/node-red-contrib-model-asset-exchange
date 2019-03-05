var should = require('should');
var helper = require('node-red-node-test-helper');
var node = require('../node.js');

helper.init(require.resolve('node-red'));

describe('image-segmenter node', function () {

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
        var flow = [{ id: 'n1', type: 'image-segmenter', name: 'image-segmenter' }];
        helper.load(node, flow, function () {
            var n1 = helper.getNode('n1');
            n1.should.have.property('name', 'image-segmenter');
            done();
        });
    });

    it('should handle get_metadata()', function (done) {
        var flow = [
            { id: 'n1', type: 'image-segmenter', name: 'image-segmenter',
                method: 'get_metadata',
                wires: [['n3']],
                service: 'n2' },
            { id: 'n2', type: 'image-segmenter-service', host: 'http://<host name>' }, // (4) define host name
            { id: 'n3', type: 'helper' }
        ];
        helper.load(node, flow, function () {
            var n3 = helper.getNode('n3');
            var n1 = helper.getNode('n1');
            n3.on('input', function (msg) {
                try {
                    msg.should.have.property('payload', '<output message>'); // (3) define output message
                    done();
                } catch (e) {
                    done(e);
                }
            });
            n1.receive({ payload: '<input message>' }); // (2) define input message
        });
    });
    it('should handle predict()', function (done) {
        var flow = [
            { id: 'n1', type: 'image-segmenter', name: 'image-segmenter',
                method: 'predict',
                predict_image: '<node property>', // (1) define node properties
                wires: [['n3']],
                service: 'n2' },
            { id: 'n2', type: 'image-segmenter-service', host: 'http://<host name>' }, // (4) define host name
            { id: 'n3', type: 'helper' }
        ];
        helper.load(node, flow, function () {
            var n3 = helper.getNode('n3');
            var n1 = helper.getNode('n1');
            n3.on('input', function (msg) {
                try {
                    msg.should.have.property('payload', '<output message>'); // (3) define output message
                    done();
                } catch (e) {
                    done(e);
                }
            });
            n1.receive({ payload: '<input message>' }); // (2) define input message
        });
    });
});
