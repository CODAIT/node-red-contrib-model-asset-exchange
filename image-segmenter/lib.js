/*jshint -W069 */

const Jimp = require('jimp');
<<<<<<< HEAD
=======
const sizeOf = require('buffer-image-size');
const { rect, rectFill, getScaledFont, getPadSize } = require('../utils');
>>>>>>> ce6559f5e67265672bd6ea4e4e8158e1dd02699b

/**
 * An API for serving models
 * @class ModelAssetExchangeServer
 * @param {(string|object)} [domainOrOptions] - The project domain or options object. If object, see the object's optional properties.
 * @param {string} [domainOrOptions.domain] - The project domain
 * @param {object} [domainOrOptions.token] - auth token - object with value property and optional headerOrQueryName and isQuery properties
 */
var ModelAssetExchangeServer = (function(){
    'use strict';

    var request = require('request');
    var Q = require('q');

    function ModelAssetExchangeServer(options){
        var domain = (typeof options === 'object') ? options.domain : options;
        this.domain = domain ? domain : '';
        if(this.domain.length === 0) {
            throw new Error('Domain parameter must be specified as a string.');
        }
    }

    function mergeQueryParams(parameters, queryParameters) {
        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                  .forEach(function(parameterName) {
                      var parameter = parameters.$queryParameters[parameterName];
                      queryParameters[parameterName] = parameter;
            });
        }
        return queryParameters;
    }

    /**
     * HTTP Request
     * @method
     * @name ModelAssetExchangeServer#request
     * @param {string} method - http method
     * @param {string} url - url to do request
     * @param {object} parameters
     * @param {object} body - body parameters / object
     * @param {object} headers - header parameters
     * @param {object} queryParameters - querystring parameters
     * @param {object} form - form data object
     * @param {object} deferred - promise object
     */
    ModelAssetExchangeServer.prototype.request = async function(method, url, parameters, body, headers, queryParameters, form, deferred){
        var req = {
            method: method,
            uri: url,
            qs: queryParameters,
            headers: headers
        };
        if(Object.keys(form).length > 0) {
            req.formData = { 
                image: { 
                    value: form.image, 
                    options: { filename: 'image.png' }
                }
            };  
        }
        if(typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body){
            if(error) {
                deferred.reject(error);
            } else {
                if(/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch(e) {}
                }
                if(response.statusCode === 204) {
                    deferred.resolve({ response: response });
                } else if(response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({ response: response, body: body });
                } else {
                    deferred.reject({ response: response, body: body });
                }
            }
        });
    };


/**
 * Return the metadata associated with the model
 * @method
 * @name ModelAssetExchangeServer#get_metadata
 * @param {object} parameters - method options and parameters
 */
 ModelAssetExchangeServer.prototype.get_metadata = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/model/metadata';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Make a prediction given input data
 * @method
 * @name ModelAssetExchangeServer#predict
 * @param {object} parameters - method options and parameters
     * @param {file} parameters.image - An image file (encoded as PNG or JPG/JPEG)
 */
 ModelAssetExchangeServer.prototype.predict = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/model/predict';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['multipart/form-data'];

        
        
        

                if(parameters['image'] !== undefined){
                    form['image'] = parameters['image'];
                }

        if(parameters['image'] === undefined){
            deferred.reject(new Error('Missing required  parameter: image'));
            return deferred.promise;
        }
 
    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };

    return ModelAssetExchangeServer;
})();

exports.ModelAssetExchangeServer = ModelAssetExchangeServer;

exports.createAnnotatedInput = async (imageData, modelData) => {
    let canvas = await Jimp.read(imageData);
    canvas.scaleToFit(MAX_SIZE,MAX_SIZE-1);
    const flatSegMap = modelData.reduce((a, b) => a.concat(b), []);
    const data = canvas.bitmap.data;
    let objColor = [0, 0, 0];
    const bgVal = OBJ_LIST.indexOf('background');
    flatSegMap.forEach((s, i) => {
        if (s !== bgVal) {
            objColor = getColor(s);
            data[(i * 4)] = objColor[0]; // red channel
            data[(i * 4) + 1] = objColor[1]; // green channel
            data[(i * 4) + 2] = objColor[2]; // blue channel
            data[(i * 4) + 3] = 200; // alpha
        }
    })
    return canvas.getBufferAsync(Jimp.AUTO);
}

const MAX_SIZE = 513;

const COLOR_MAP = {
    green: [0, 128, 0],
    red: [255, 0, 0],
    gray: [192, 192, 192],
    purple: [160, 32, 240],
    pink: [255, 185, 80],
    teal: [30, 128, 128],
    yellow: [255, 255, 0],
    cyan: [0, 255, 255]
};
const COLOR_LIST = Object.values(COLOR_MAP);
const getColor = pixel => COLOR_LIST[pixel % COLOR_LIST.length];

const OBJ_LIST = ['background', 'airplane', 'bicycle', 'bird', 'boat', 
'bottle', 'bus', 'car', 'cat', 'chair', 'cow', 'dining table', 
'dog', 'horse', 'motorbike', 'person', 'potted plant', 'sheep', 
'sofa', 'train', 'tv'];

const flatten = function (a) {
    return Array.isArray(a) ? [].concat(...a.map(flatten)) : a;
}