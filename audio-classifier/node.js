"use strict";
var lib = require('./lib.js');

module.exports = function (RED) {
    function ModelAssetExchangeServerNode(config) {
        RED.nodes.createNode(this, config);
        this.service = RED.nodes.getNode(config.service);
        this.method = config.method;
        this.predict_audio = config.predict_audio;
        this.predict_audioType = config.predict_audioType || 'str';
        this.passthrough = config.passthrough || false;

        var node = this;

        node.on('input', function (msg) {
            var errorFlag = false;
            var client;
            if (this.service && this.service.host) {
                this.service.host = this.service.host.replace(/\/+$/, '');
                client = new lib.ModelAssetExchangeServer({ domain: this.service.host });
            } else {
                node.error('Host in configuration node is not specified.', msg);
                errorFlag = true;
            }
            if (!errorFlag) {
                client.body = msg.payload;
            }
            if (typeof msg.payload === 'object' && node.passthrough) {
                node.inputData = msg.payload;
            }

            var result;
            if (!errorFlag && node.method === 'get_metadata') {
                var get_metadata_parameters = [];
                var get_metadata_nodeParam;
                var get_metadata_nodeParamType;
                result = client.get_metadata(get_metadata_parameters);
            }
            if (!errorFlag && node.method === 'predict') {
                var parameters = [], nodeParam, nodeParamType;

                nodeParam = node.predict_audio;
                nodeParamType = node.predict_audioType;
                
                if (typeof msg.payload === 'object') {
                    parameters.audio = msg.payload;
                } else {
                    node.error('Unsupported type: \'' + (typeof msg.payload) + '\', ' + 'msg.payload must be JSON object or buffer.', msg);
                    errorFlag = true;
                }

                result = client.predict(parameters);
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
                        if (node.method === 'get_metadata') {
                            msg.payload = data.body;
                        }
                        if (node.method === 'predict') {
                            if (data.body !== null && data.body !== undefined) {
                                msg.payload = data.body.predictions[0].label || "Detection Error";
                            } else {
                                msg.payload = null;
                            }
                            msg.details = data.body;
                        }
                    }
                }
                let outputMsg = { ...msg, topic: "max-audio-classifier" };
                if (node.passthrough) {
                    outputMsg.inputData = node.inputData
                }
                return outputMsg;
            };



            if (!errorFlag) {
                node.status({ fill: "blue", shape: "dot", text: "ModelAssetExchangeServer.status.requesting" });
                result.then(function (data) {
                    node.send(setData(msg, data));
                    node.status({});
                }).catch(function (error) {
                    var message = null;
                    if (error && error.body) {
                        if (error.body.message) {
                            message = error.body.message;
                        } else {
                            message = error.body;
                        }
                    }
                    node.error(message, setData(msg, error));
                    node.status({ fill: 'red', shape: 'ring', text: 'node-red:common.status.error' });
                });
            }
        });
    }

    RED.nodes.registerType("audio-classifier", ModelAssetExchangeServerNode);

    function ModelAssetExchangeServerServiceNode(n) {
        RED.nodes.createNode(this, n);
        this.host = n.host;

    }

    RED.nodes.registerType("audio-classifier-service", ModelAssetExchangeServerServiceNode, {
        credentials: {
            temp: { type: "text" }
        }
    });
};
