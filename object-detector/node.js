'use strict';
var lib = require('./lib.js');

module.exports = function (RED) {
    function ModelAssetExchangeServerNode(config) {
        RED.nodes.createNode(this, config);
        this.service = RED.nodes.getNode(config.service);
        this.method = config.method;
        this.predict_body = config.predict_body;
        this.predict_bodyType = config.predict_bodyType || 'str';
        this.predict_threshold = config.predict_threshold;
        this.predict_thresholdType = config.predict_thresholdType || 'str';
        var node = this;

        node.on('input', function (msg) {
            var errorFlag = false;
            var client;
            if (this.service && this.service.host) {
                client = new lib.ModelAssetExchangeServer({ domain: this.service.host });
            } else {
                node.error('Host in configuration node is not specified.', msg);
                errorFlag = true;
            }
            if (!errorFlag) {
                client.body = msg.payload;
            }

            var result;
            if (!errorFlag && node.method === 'predict') {
                var predict_parameters = [];
                var predict_nodeParam;
                var predict_nodeParamType;

                if (typeof msg.payload === 'object') {
                    predict_parameters.body = msg.payload;
                } else {
                    node.error('Unsupported type: \'' + (typeof msg.payload) + '\', ' + 'msg.payload must be JSON object or buffer.', msg);
                    errorFlag = true;
                }
                
                predict_nodeParam = node.predict_threshold;
                predict_nodeParamType = node.predict_thresholdType;
                if (predict_nodeParamType === 'str') {
                    predict_parameters.threshold = predict_nodeParam || '';
                } else {
                    predict_parameters.threshold = RED.util.getMessageProperty(msg, predict_nodeParam);
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
                        if (data.body.predictions && data.body.predictions.length > 0) {
                            msg.payload = data.body.predictions[0].label;
                        } else {
                            msg.payload = null;
                        }
                        msg.details = data.body;
                    }
                }
                return msg;
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

    RED.nodes.registerType('object-detector', ModelAssetExchangeServerNode);
    function ModelAssetExchangeServerServiceNode(n) {
        RED.nodes.createNode(this, n);
        this.host = n.host;

    }

    RED.nodes.registerType('object-detector-service', ModelAssetExchangeServerServiceNode, {
        credentials: {
            temp: { type: 'text' }
        }
    });
};
