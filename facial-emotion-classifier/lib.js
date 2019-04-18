/*jshint -W069 */

const { createCanvas, Image } = require('canvas');

/**
 * Detect faces in an image and predict the emotional state of each person
 * @class MaxFacialEmotionClassifier
 * @param {(string|object)} [domainOrOptions] - The project domain or options object. If object, see the object's optional properties.
 * @param {string} [domainOrOptions.domain] - The project domain
 * @param {object} [domainOrOptions.token] - auth token - object with value property and optional headerOrQueryName and isQuery properties
 */
var MaxFacialEmotionClassifier = (function(){
    'use strict';

    var request = require('request');
    var Q = require('q');

    function MaxFacialEmotionClassifier(options){
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
     * @name MaxFacialEmotionClassifier#request
     * @param {string} method - http method
     * @param {string} url - url to do request
     * @param {object} parameters
     * @param {object} body - body parameters / object
     * @param {object} headers - header parameters
     * @param {object} queryParameters - querystring parameters
     * @param {object} form - form data object
     * @param {object} deferred - promise object
     */
    MaxFacialEmotionClassifier.prototype.request = function(method, url, parameters, body, headers, queryParameters, form, deferred){
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
 * Return the list of labels that can be predicted by the model
 * @method
 * @name MaxFacialEmotionClassifier#get_labels
 * @param {object} parameters - method options and parameters
 */
 MaxFacialEmotionClassifier.prototype.get_labels = function(parameters){
    if(parameters === undefined) {
        parameters = {};
    }
    var deferred = Q.defer();
    var domain = this.domain,  path = '/model/labels';
    var body = {}, queryParameters = {}, headers = {}, form = {};

        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

    queryParameters = mergeQueryParams(parameters, queryParameters);

    this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

    return deferred.promise;
 };
/**
 * Return the metadata associated with the model
 * @method
 * @name MaxFacialEmotionClassifier#get_model_metadata_api
 * @param {object} parameters - method options and parameters
 */
 MaxFacialEmotionClassifier.prototype.get_model_metadata_api = function(parameters){
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
 * @name MaxFacialEmotionClassifier#predict
 * @param {object} parameters - method options and parameters
     * @param {file} parameters.image - An image file (encoded as JPEG, PNG or TIFF)
 */
 MaxFacialEmotionClassifier.prototype.predict = function(parameters){
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

    return MaxFacialEmotionClassifier;
})();

exports.MaxFacialEmotionClassifier = MaxFacialEmotionClassifier;

exports.createAnnotatedInput = (imageData, modelData) => {
    try {
        let canvas;
        const img = new Image();
        img.onload = async () => {
            canvas = createCanvas(img.width, img.height);
            const ctx = canvas.getContext('2d');
            const solidColor = '#1bc6c0';
            const textColor = '#000';
            ctx.drawImage(img, 0, 0);
            const boxesArray = modelData.map((obj, i) => obj.detection_box);
            boxesArray.forEach((box, i) => {
                ctx.font = '36px sans-serif';
                ctx.textBaseline = 'top';
                ctx.fillStyle = solidColor;
                ctx.strokeStyle = solidColor;
                ctx.lineWidth = "3";
                // BOX GENERATION
                const yMin = box[0] * img.height;
                const xMin = box[1] * img.width;
                const boxHeight = (box[2] - box[0]) * img.height;
                const boxWidth = (box[3] - box[1]) * img.width;
                ctx.strokeRect(xMin, yMin, boxWidth, boxHeight);
                // LABEL GENERATION
                const confidence = (modelData[i].emotion_predictions[0].probability * 100).toFixed(1) + '%';
                const label = modelData[i].emotion_predictions[0].label;
                let text = label + ' : ' + confidence;
                let tagWidth = ctx.measureText(text).width;
                if (tagWidth > boxWidth) {
                    tagWidth = ctx.measureText(label).width;
                    text = label;
                }
                const tHeight = parseInt(ctx.font, 10) * 1.2;
                ctx.fillRect(xMin, yMin, tagWidth + 3, tHeight);
                ctx.fillStyle = textColor;
                ctx.fillText(text, xMin + 2, yMin + 4);
            })
        }
        img.onerror = err => { throw err }
        img.src = imageData;
        return canvas.toBuffer();
    } catch (e) {
        console.log(`error processing image - ${ e }`);
        return null;
    }
}
