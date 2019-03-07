var should = require('should');
var helper = require('node-red-node-test-helper');
var request = require('request');
var node = require('../node.js');

helper.init(require.resolve('node-red'));

describe('image-caption-generator node', function () {

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
        var flow = [{ id: 'n1', type: 'image-caption-generator', name: 'image-caption-generator' }];
        helper.load(node, flow, function () {
            var n1 = helper.getNode('n1');
            n1.should.have.property('name', 'image-caption-generator');
            done();
        });
    });

    it('should handle get_metadata()', function (done) {
        var flow = [
            { id: 'n1', type: 'image-caption-generator', name: 'image-caption-generator',
                method: 'get_metadata',
                wires: [['n3']],
                service: 'n2' },
            { id: 'n2', type: 'image-caption-generator-service', host: 'https://max-image-caption-generator.max.us-south.containers.appdomain.cloud' },
            { id: 'n3', type: 'helper' }
        ];
        helper.load(node, flow, function () {
            var n3 = helper.getNode('n3');
            var n1 = helper.getNode('n1');
            n3.on('input', function (msg) {
                try {
                    msg.payload.should.have.property('id', 'im2txt-tensorflow');
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
            { id: 'n1', type: 'image-caption-generator', name: 'image-caption-generator',
                method: 'predict',
                wires: [['n3']],
                service: 'n2' },
            { id: 'n2', type: 'image-caption-generator-service', host: 'https://max-image-caption-generator.max.us-south.containers.appdomain.cloud' },
            { id: 'n3', type: 'helper' }
        ];
        helper.load(node, flow, function () {
            var n3 = helper.getNode('n3');
            var n1 = helper.getNode('n1');
            n3.on('input', function (msg) {
                try {
                    msg.should.have.property('payload', 'a man riding a wave on top of a surfboard .');
                    done();
                } catch (e) {
                    done(e);
                }
            });
            request('https://raw.githubusercontent.com/IBM/MAX-Image-Caption-Generator/master/assets/surfing.jpg', { encoding: null }, function (error, response, body) {
                n1.receive({ payload: Buffer.from(body) });
            });
        });
    });
});
