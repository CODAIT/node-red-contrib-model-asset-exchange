"use strict";
var lib = require('./lib.js');

module.exports = function (RED) {
    function MaxFacialEmotionClassifierNode(config) {
        RED.nodes.createNode(this, config);
        this.service = RED.nodes.getNode(config.service);
        this.method = config.method;

        this.predict_image = config.predict_image;
        this.predict_imageType = config.predict_imageType || 'str';

        var node = this;

        node.on('input', function (msg) {
            var errorFlag = false;
            var client;
            if (this.service && this.service.host) {
                this.service.host = this.service.host.replace(/\/+$/, '');
                client = new lib.MaxFacialEmotionClassifier({ domain: this.service.host });
            } else {
                node.error('Host in configuration node is not specified.', msg);
                errorFlag = true;
            }
            if (!errorFlag) {
                client.body = msg.payload;
            }

            var result;
            if (!errorFlag && node.method === 'get_labels') {
                var get_labels_parameters = [];

                result = client.get_labels(get_labels_parameters);
            }
            if (!errorFlag && node.method === 'get_model_metadata_api') {
                var get_metadata_parameters = [];

                result = client.get_model_metadata_api(get_metadata_parameters);
            }
            if (!errorFlag && node.method === 'predict') {
                var predict_parameters = [];

                if (typeof msg.payload === 'object') {
                    predict_parameters.image = msg.payload;
                } else {
                    node.error('Unsupported type: \'' + (typeof msg.payload) + '\', ' + 'msg.payload must be JSON object or buffer.', msg);
                    errorFlag = true;
                }
                
                result = client.predict(predict_parameters);
            }
            if (!errorFlag && result === undefined) {
                node.error('Method is not specified.', msg);
                errorFlag = true;
            }
            var setData = function (msg, data) {
                if (data) {
                    if (data.response) {
                        if (data.response.statusCode) {
                            msg.statusCode = data.response.statusCode;
                        }
                        if (data.response.headers) {
                            msg.headers = data.response.headers;
                        }
                        if (data.response.request && data.response.request.uri && data.response.request.uri.href) {
                            msg.responseUrl = data.response.request.uri.href;
                        }
                    }
                    if (data.body) {
                        if (node.method === 'get_model_metadata_api') {
                            msg.payload = data.body;
                        }
                        if (node.method === 'get_labels') {
                            msg.payload = data.body;
                        }
                        if (node.method === 'predict') {
                            if (data.body.predictions && data.body.predictions.length > 0) {
                                const predictions = data.body.predictions.map(person => person.emotion_predictions[0].label);
                                msg.payload = predictions[0]
                            } else {
                                msg.payload = null;
                            }
                        }
                        msg.details = data.body;
                    }
                }
                return { ...msg, topic: "max-facial-emotion-classifier" };
            };
            if (!errorFlag) {
                node.status({ fill: 'blue', shape: 'dot', text: 'ModelAssetExchangeServer.status.requesting' });
                result.then(function (data) {
                    node.send(setData(msg, data));
                    node.status({});
                }).catch(function (error) {
                    var message = null;
                    if (error && error.body && error.body.message) {
                        message = error.body.message;
                    }
                    node.error(message, setData(msg, error));
                    node.status({ fill: 'red', shape: 'ring', text: 'node-red:common.status.error' });
                });
            }
        });
    }

    RED.nodes.registerType("facial-emotion-classifier", MaxFacialEmotionClassifierNode);

    function MaxFacialEmotionClassifierServiceNode(n) {
        RED.nodes.createNode(this, n);
        this.host = n.host;

    }

    RED.nodes.registerType("facial-emotion-classifier-service", MaxFacialEmotionClassifierServiceNode, {
        credentials: {
            temp: { type: "text" }
        }
    });
};
