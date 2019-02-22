"use strict";
var lib = require('./lib.js');

module.exports = function (RED) {
    function ModelAssetExchangeServerNode(config) {
        RED.nodes.createNode(this, config);
        this.service = RED.nodes.getNode(config.service);
        this.method = config.method;

        this.predict_audio = config.predict_audio;
        this.predict_audioType = config.predict_audioType || 'str';

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
            if (!errorFlag) {
                node.status({ fill: "blue", shape: "dot", text: "ModelAssetExchangeServer.status.requesting" });
                result.then(function (response) {
                    if (node.method === 'get_metadata') {
                        msg.payload = response.body;
                    }
                    if (node.method === 'predict') {
                        if (response.body !== null && response.body !== undefined) {
                            msg.payload = response.body.predictions[0].label || "Detection Error";
                        } else {
                            msg.payload = null;
                        }
                        msg.details = response.body;
                    }
                    
                    node.send(msg);
                    node.status({});
                }).catch(function (error) {
                    node.error(error, msg);
                    node.status({ fill: "red", shape: "ring", text: "node-red:common.status.error" });
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
