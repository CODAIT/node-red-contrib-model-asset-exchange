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
            { id: 'n2', type: 'human-pose-estimator-service', host: 'https://max-human-pose-estimator.codait-prod-41208c73af8fca213512856c7a09db52-0000.us-east.containers.appdomain.cloud' },
            { id: 'n3', type: 'helper' }
        ];
        helper.load(node, flow, function () {
            var n3 = helper.getNode('n3');
            var n1 = helper.getNode('n1');
            n3.on('input', function (msg) {
                try {
                    msg.payload.should.have.property('id', 'max human pose estimator');
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
            { id: 'n2', type: 'human-pose-estimator-service', host: 'https://max-human-pose-estimator.codait-prod-41208c73af8fca213512856c7a09db52-0000.us-east.containers.appdomain.cloud' },
            { id: 'n3', type: 'helper' }
        ];
        helper.load(node, flow, function () {
            var n3 = helper.getNode('n3');
            var n1 = helper.getNode('n1');
            n3.on('input', function (msg) {
                try {
                    msg.should.have.property('payload', [
                        { "part_id": 0, "part_name": "Nose", "score": "0.83899", "x": 428, "y": 205 },
                        { "part_id": 1, "part_name": "Neck", "score": "0.71769", "x": 444, "y": 269 },
                        { "part_id": 2, "part_name": "RShoulder", "score": "0.75556", "x": 392, "y": 269 },
                        { "part_id": 3, "part_name": "RElbow", "score": "0.56429", "x": 367, "y": 330 },
                        { "part_id": 4, "part_name": "RWrist", "score": "0.51554", "x": 364, "y": 392 },
                        { "part_id": 5, "part_name": "LShoulder", "score": "0.56893", "x": 503, "y": 274 },
                        { "part_id": 6, "part_name": "LElbow", "score": "0.66824", "x": 511, "y": 348 },
                        { "part_id": 7, "part_name": "LWrist", "score": "0.48784", "x": 469, "y": 399 },
                        { "part_id": 8, "part_name": "RHip", "score": "0.25196", "x": 397, "y": 410 },
                        { "part_id": 11, "part_name": "LHip", "score": "0.24573", "x": 464, "y": 410 },
                        { "part_id": 14, "part_name": "REye", "score": "0.85231", "x": 417, "y": 197 },
                        { "part_id": 15, "part_name": "LEye", "score": "0.88991", "x": 439, "y": 195 },
                        { "part_id": 16, "part_name": "REar", "score": "0.21390", "x": 411, "y": 202 },
                        { "part_id": 17, "part_name": "LEar", "score": "0.81776", "x": 464, "y": 197 }
                    ]);
                    done();
                } catch (e) {
                    done(e);
                }
            });
            request('https://raw.githubusercontent.com/IBM/MAX-Human-Pose-Estimator/master/assets/Pilots.jpg', { encoding: null }, function (error, response, body) {
                n1.receive({ payload: Buffer.from(body) });
            });
        });
    });
});
