var should = require('should');
var helper = require('node-red-node-test-helper');
var request = require('request');
var node = require('../node.js');

helper.init(require.resolve('node-red'));

describe('human-pose-estimator node', function () {

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
        var flow = [{ id: 'n1', type: 'human-pose-estimator', name: 'human-pose-estimator' }];
        helper.load(node, flow, function () {
            var n1 = helper.getNode('n1');
            n1.should.have.property('name', 'human-pose-estimator');
            done();
        });
    });

    it('should handle get_metadata()', function (done) {
        var flow = [
            { id: 'n1', type: 'human-pose-estimator', name: 'human-pose-estimator',
                method: 'get_metadata',
                wires: [['n3']],
                service: 'n2' },
            { id: 'n2', type: 'human-pose-estimator-service', host: 'https://max-human-pose-estimator.max.us-south.containers.appdomain.cloud' },
            { id: 'n3', type: 'helper' }
        ];
        helper.load(node, flow, function () {
            var n3 = helper.getNode('n3');
            var n1 = helper.getNode('n1');
            n3.on('input', function (msg) {
                try {
                    msg.should.have.property('payload', {
                        "id": "human-pose-estimator-tensorflow",
                        "name": "Openpose TensorFlow Model",
                        "description": "Openpose TensorFlow model trained on COCO data to detect human poses",
                        "license": "Apache License 2.0"
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
            { id: 'n1', type: 'human-pose-estimator', name: 'human-pose-estimator',
                method: 'predict',
                wires: [['n3']],
                service: 'n2' },
            { id: 'n2', type: 'human-pose-estimator-service', host: 'https://max-human-pose-estimator.max.us-south.containers.appdomain.cloud' }, // (4) define host name
            { id: 'n3', type: 'helper' }
        ];
        helper.load(node, flow, function () {
            var n3 = helper.getNode('n3');
            var n1 = helper.getNode('n1');
            n3.on('input', function (msg) {
                try {
                    msg.should.have.property('payload', [
                        { part_id: 0, part_name: 'Nose', score: '0.70019', x: 311, y: 314 },
                        { part_id: 1, part_name: 'Neck', score: '0.15868', x: 242, y: 412 },
                        { part_id: 5, part_name: 'LShoulder', score: '0.16317', x: 327, y: 437 },
                        { part_id: 14, part_name: 'REye', score: '0.74264', x: 268, y: 264 },
                        { part_id: 15, part_name: 'LEye', score: '0.64253', x: 332, y: 264 },
                        { part_id: 16, part_name: 'REar', score: '0.24679', x: 206, y: 287 }
                    ]);
                    done();
                } catch (e) {
                    done(e);
                }
            });
            request('https://upload.wikimedia.org/wikipedia/en/7/7d/Lenna_%28test_image%29.png', { encoding: null }, function (error, response, body) {
                n1.receive({ payload: Buffer.from(body) });
            });
        });
    });
});
