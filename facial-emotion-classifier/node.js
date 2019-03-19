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
            var client = new lib.MaxFacialEmotionClassifier({ domain: this.service.host });


            client.body = msg.payload;

            var result;
            var errorFlag = false;
            if (node.method === 'get_labels') {
                var parameters = [], nodeParam, nodeParamType;

                result = client.get_labels(parameters);
            }

            if (node.method === 'get_model_metadata_api') {
                var parameters = [], nodeParam, nodeParamType;

                result = client.get_model_metadata_api(parameters);
            }

            if (node.method === 'predict') {
                var parameters = [], nodeParam, nodeParamType;

                nodeParam = node.predict_image;
                nodeParamType = node.predict_imageType;
                parameters.image = nodeParamType === 'str' ? nodeParam || '' : RED.util.getMessageProperty(msg, nodeParam);
                
                result = client.predict(parameters);
            }

            if (!errorFlag) {
                node.status({ fill: "blue", shape: "dot", text: "MaxFacialEmotionClassifier.status.requesting" });
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
