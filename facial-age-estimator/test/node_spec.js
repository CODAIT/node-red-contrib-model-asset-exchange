var should = require('should');
var helper = require('node-red-node-test-helper');
var request = require('request');
var node = require('../node.js');

helper.init(require.resolve('node-red'));

describe('facial-age-estimator node', function () {

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
        var flow = [{ id: 'n1', type: 'facial-age-estimator', name: 'facial-age-estimator' }];
        helper.load(node, flow, function () {
            var n1 = helper.getNode('n1');
            n1.should.have.property('name', 'facial-age-estimator');
            done();
        });
    });

    it('should handle get_metadata()', function (done) {
        var flow = [
            { id: 'n1', type: 'facial-age-estimator', name: 'facial-age-estimator',
                method: 'get_metadata',
                wires: [['n3']],
                service: 'n2' },
            { id: 'n2', type: 'facial-age-estimator-service', host: 'https://max-facial-age-estimator.max.us-south.containers.appdomain.cloud' },
            { id: 'n3', type: 'helper' }
        ];
        helper.load(node, flow, function () {
            var n3 = helper.getNode('n3');
            var n1 = helper.getNode('n1');
            n3.on('input', function (msg) {
                try {
                    msg.payload.should.have.property('id', 'ssrnet');
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
            { id: 'n1', type: 'facial-age-estimator', name: 'facial-age-estimator',
                method: 'predict',
                wires: [['n3']],
                service: 'n2' },
            { id: 'n2', type: 'facial-age-estimator-service', host: 'https://max-facial-age-estimator.max.us-south.containers.appdomain.cloud' },
            { id: 'n3', type: 'helper' }
        ];
        helper.load(node, flow, function () {
            var n3 = helper.getNode('n3');
            var n1 = helper.getNode('n1');
            n3.on('input', function (msg) {
                try {
                    msg.should.have.property('payload', 39);
                    done();
                } catch (e) {
                    done(e);
                }
            });
            request('https://raw.githubusercontent.com/IBM/MAX-Facial-Age-Estimator/master/assets/tom_cruise.jpg', { encoding: null }, function (error, response, body) {
                n1.receive({ payload: Buffer.from(body) });
            });
        });
    });
});
