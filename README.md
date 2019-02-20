
[![Build Status](https://travis-ci.org/CODAIT/node-red-contrib-model-asset-exchange.svg?branch=master)](https://travis-ci.org/CODAIT/node-red-contrib-model-asset-exchange) [![npm version](https://badge.fury.io/js/node-red-contrib-model-asset-exchange.svg)](https://badge.fury.io/js/node-red-contrib-model-asset-exchange)

Node-RED nodes for deep learning microservices from the [Model Asset eXchange](https://developer.ibm.com/exchanges/models/), providing support for common audio, image, video, and text processing tasks.


## Getting started


### Setup

1. [Install Node-RED](https://nodered.org/docs/getting-started/installation).

2. Run the following command in your Node-RED user directory - typically `~/.node-red` to install the [node-red-contrib-model-asset-exchange](https://www.npmjs.com/package/node-red-contrib-model-asset-exchange) package:

        $ npm install node-red-contrib-model-asset-exchange

### Use the node(s)

1. Launch Node-RED and create a new flow.

        $ node-red

2. From the _Model-Asset-eXchange_ category, drag the desired node onto the canvas.

3. [Optional] Customize the node configuration. By default Model-Asset-eXchange nodes utilize microservice instances that are hosted for evaluation purposes. 

   > These instances are not suitable for production use. We recommend running microservice instance(s) on your local machine or in the cloud (e.g. IBM Cloud Kubernetes, Azure Kubernetes Service, or Google Kubernetes Engine).
   
4. Connect the node as desired and run the flow. 

## Supported models

This Node-RED node modules supports the following models:

- [Image Caption Generator](https://developer.ibm.com/exchanges/models/all/max-image-caption-generator/)

    Generate captions that describe the contents of images.

- [Facial Age Estimator](https://developer.ibm.com/exchanges/models/all/max-facial-age-estimator/)

    Recognize faces in an image and estimate the age of each face.

- [Facial Recognizer](https://developer.ibm.com/exchanges/models/all/max-facial-recognizer/)

    Recognize faces in an image and extract embedding vectors for each face.

- [Object Detector](https://developer.ibm.com/exchanges/models/all/max-object-detector/)

    Localize and identify multiple objects in a single image.

- [Human Pose Estimator](https://developer.ibm.com/exchanges/models/all/max-human-pose-estimator/)

    Detect humans in an image and estimate the pose for each person.

- [Audio Classifier](https://developer.ibm.com/exchanges/models/all/max-audio-classifier/)

    Identify sounds in short audio clips.

Note: file inject node in [node-red-contrib-browser-utils](https://flows.nodered.org/node/node-red-contrib-browser-utils) is useful to test these nodes.

    
License
-------

[Apache-2.0](LICENSE)
