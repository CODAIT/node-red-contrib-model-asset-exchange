var should = require('should');
var helper = require('node-red-node-test-helper');
var request = require('request');
var node = require('../node.js');

helper.init(require.resolve('node-red'));

describe('object-detector node', function () {

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
        var flow = [{ id: 'n1', type: 'object-detector', name: 'object-detector' }];
        helper.load(node, flow, function () {
            var n1 = helper.getNode('n1');
            n1.should.have.property('name', 'object-detector');
            done();
        });
    });

    it('should handle get_labels()', function (done) {
        var flow = [
            { id: 'n1', type: 'object-detector', name: 'object-detector',
                method: 'get_labels',
                wires: [['n3']],
                service: 'n2' },
            { id: 'n2', type: 'object-detector-service', host: 'https://max-object-detector.codait-prod-41208c73af8fca213512856c7a09db52-0000.us-east.containers.appdomain.cloud' },
            { id: 'n3', type: 'helper' }
        ];
        helper.load(node, flow, function () {
            var n3 = helper.getNode('n3');
            var n1 = helper.getNode('n1');
            n3.on('input', function (msg) {
                try {
                    msg.should.have.property('payload', {
                        "count":  80,
                        "labels": [
                            { "id": "1", "name": "person" },
                            { "id": "2", "name": "bicycle" },
                            { "id": "3", "name": "car" },
                            { "id": "4", "name": "motorcycle" },
                            { "id": "5", "name": "airplane" },
                            { "id": "6", "name": "bus" },
                            { "id": "7", "name": "train" },
                            { "id": "8", "name": "truck" },
                            { "id": "9", "name": "boat" },
                            { "id": "10", "name": "traffic light" },
                            { "id": "11", "name": "fire hydrant" },
                            { "id": "13", "name": "stop sign" },
                            { "id": "14", "name": "parking meter" },
                            { "id": "15", "name": "bench" },
                            { "id": "16", "name": "bird" },
                            { "id": "17", "name": "cat" },
                            { "id": "18", "name": "dog" },
                            { "id": "19", "name": "horse" },
                            { "id": "20", "name": "sheep" },
                            { "id": "21", "name": "cow" },
                            { "id": "22", "name": "elephant" },
                            { "id": "23", "name": "bear" },
                            { "id": "24", "name": "zebra" },
                            { "id": "25", "name": "giraffe" },
                            { "id": "27", "name": "backpack" },
                            { "id": "28", "name": "umbrella" },
                            { "id": "31", "name": "handbag" },
                            { "id": "32", "name": "tie" },
                            { "id": "33", "name": "suitcase" },
                            { "id": "34", "name": "frisbee" },
                            { "id": "35", "name": "skis" },
                            { "id": "36", "name": "snowboard" },
                            { "id": "37", "name": "sports ball" },
                            { "id": "38", "name": "kite" },
                            { "id": "39", "name": "baseball bat" },
                            { "id": "40", "name": "baseball glove" },
                            { "id": "41", "name": "skateboard" },
                            { "id": "42", "name": "surfboard" },
                            { "id": "43", "name": "tennis racket" },
                            { "id": "44", "name": "bottle" },
                            { "id": "46", "name": "wine glass" },
                            { "id": "47", "name": "cup" },
                            { "id": "48", "name": "fork" },
                            { "id": "49", "name": "knife" },
                            { "id": "50", "name": "spoon" },
                            { "id": "51", "name": "bowl" },
                            { "id": "52", "name": "banana" },
                            { "id": "53", "name": "apple" },
                            { "id": "54", "name": "sandwich" },
                            { "id": "55", "name": "orange" },
                            { "id": "56", "name": "broccoli" },
                            { "id": "57", "name": "carrot" },
                            { "id": "58", "name": "hot dog" },
                            { "id": "59", "name": "pizza" },
                            { "id": "60", "name": "donut" },
                            { "id": "61", "name": "cake" },
                            { "id": "62", "name": "chair" },
                            { "id": "63", "name": "couch" },
                            { "id": "64", "name": "potted plant" },
                            { "id": "65", "name": "bed" },
                            { "id": "67", "name": "dining table" },
                            { "id": "70", "name": "toilet" },
                            { "id": "72", "name": "tv" },
                            { "id": "73", "name": "laptop" },
                            { "id": "74", "name": "mouse" },
                            { "id": "75", "name": "remote" },
                            { "id": "76", "name": "keyboard" },
                            { "id": "77", "name": "cell phone" },
                            { "id": "78", "name": "microwave" },
                            { "id": "79", "name": "oven" },
                            { "id": "80", "name": "toaster" },
                            { "id": "81", "name": "sink" },
                            { "id": "82", "name": "refrigerator" },
                            { "id": "84", "name": "book" },
                            { "id": "85", "name": "clock" },
                            { "id": "86", "name": "vase" },
                            { "id": "87", "name": "scissors" },
                            { "id": "88", "name": "teddy bear" },
                            { "id": "89", "name": "hair drier" },
                            { "id": "90", "name": "toothbrush" }
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
    it('should handle get_metadata()', function (done) {
        var flow = [
            { id: 'n1', type: 'object-detector', name: 'object-detector',
                method: 'get_metadata',
                wires: [['n3']],
                service: 'n2' },
            { id: 'n2', type: 'object-detector-service', host: 'https://max-object-detector.codait-prod-41208c73af8fca213512856c7a09db52-0000.us-east.containers.appdomain.cloud' },
            { id: 'n3', type: 'helper' }
        ];
        helper.load(node, flow, function () {
            var n3 = helper.getNode('n3');
            var n1 = helper.getNode('n1');
            n3.on('input', function (msg) {
                try {
                    msg.payload.should.have.property('id', 'ssd_mobilenet_v1_coco_2017_11_17-tf-mobilenet');
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
            { id: 'n1', type: 'object-detector', name: 'object-detector',
                method: 'predict',
                predict_threshold: '0.7',
                wires: [['n3']],
                service: 'n2' },
            { id: 'n2', type: 'object-detector-service', host: 'https://max-object-detector.codait-prod-41208c73af8fca213512856c7a09db52-0000.us-east.containers.appdomain.cloud' },
            { id: 'n3', type: 'helper' }
        ];
        helper.load(node, flow, function () {
            var n3 = helper.getNode('n3');
            var n1 = helper.getNode('n1');
            n3.on('input', function (msg) {
                try {
                    msg.should.have.property('payload', 'person');
                    done();
                } catch (e) {
                    done(e);
                }
            });
            request('https://raw.githubusercontent.com/IBM/MAX-Object-Detector/master/assets/dog-human.jpg', { encoding: null }, function (error, response, body) {
                n1.receive({ payload: Buffer.from(body) });
            });
        });
    });
});
