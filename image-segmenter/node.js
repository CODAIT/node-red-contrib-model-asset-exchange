"use strict";
var lib = require('./lib.js');

module.exports = function (RED) {
    function ModelAssetExchangeServerNode(config) {
        RED.nodes.createNode(this, config);
        this.service = RED.nodes.getNode(config.service);
        this.method = config.method;

        this.predict_image = config.predict_image;
        this.predict_imageType = config.predict_imageType || 'str';

        var node = this;

        node.on('input', function (msg) {
            var client = new lib.ModelAssetExchangeServer({ domain: this.service.host });


            client.body = msg.payload;

            var result;
            var errorFlag = false;
            if (node.method === 'get_metadata') {
                var parameters = [], nodeParam, nodeParamType;

                result = client.get_metadata(parameters);
            }

            if (node.method === 'predict') {
                var parameters = [], nodeParam, nodeParamType;

                nodeParam = node.predict_image;
                nodeParamType = node.predict_imageType;
                
                if (typeof msg.payload === 'object') {
                    parameters.image = msg.payload;
                } else {
                    node.error('Unsupported type: \'' + (typeof msg.payload) + '\', ' + 'msg.payload must be JSON object or buffer.', msg);
                    errorFlag = true;
                }
                
                result = client.predict(parameters);
            }

            if (!errorFlag) {
                node.status({ fill: "blue", shape: "dot", text: "ModelAssetExchangeServer.status.requesting" });
                result.then(function (response) {
                    if (response.body !== null && response.body !== undefined) {
                        msg.payload = response.body;
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

    RED.nodes.registerType("image-segmenter", ModelAssetExchangeServerNode);

    function ModelAssetExchangeServerServiceNode(n) {
        RED.nodes.createNode(this, n);
        this.host = n.host;

    }

    RED.nodes.registerType("image-segmenter-service", ModelAssetExchangeServerServiceNode, {
        credentials: {
            temp: { type: "text" }
        }
    });
};
