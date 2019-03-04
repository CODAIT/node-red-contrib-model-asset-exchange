
[![Build Status](https://travis-ci.org/CODAIT/node-red-contrib-model-asset-exchange.svg?branch=master)](https://travis-ci.org/CODAIT/node-red-contrib-model-asset-exchange) [![npm version](https://badge.fury.io/js/node-red-contrib-model-asset-exchange.svg)](https://badge.fury.io/js/node-red-contrib-model-asset-exchange)

Node-RED nodes for deep learning microservices from the [Model Asset eXchange](https://developer.ibm.com/exchanges/models/), providing support for common audio, image, video, and text processing tasks.

![Node-RED canvas with MAX node](/docs/images/canvas.png)


## Getting started


### Setup

1. [Install Node-RED](https://nodered.org/docs/getting-started/installation).

2. Run the following command in your Node-RED user directory - typically `~/.node-red` to install the [node-red-contrib-model-asset-exchange](https://www.npmjs.com/package/node-red-contrib-model-asset-exchange) module:

        $ cd ~/.node-red
        $ npm install node-red-contrib-model-asset-exchange

  > You can also install the module in the Node-RED editor. Choose  **&#9776;** > **Manage palette** > **Install** and enter **model-asset** as the search term.

3. Launch Node-RED

        $ node-red
        
4. The nodes are displayed in the palette under the  _Model-Asset-eXchange_ category.    

### Explore the sample flows

The `node-red-contrib-model-asset-exchange` module includes a couple of example flows to get you started. To import the flows into the workspace:

1. In the Node-RED editor open **&#9776;** > **Import** > **Examples** > **model asset-exchange**.
2. Choose a flow.

   ![import sample flows](/docs/images/import_sample_flows.png) 

You can deploy and run these flows as is. The deep learning nodes in these flows have been pre-configured (service: _cloud_) to connect to hosted evaluation instances of the deep learning microservices. 

### Use the nodes in your own flows

Microservice evaluation instances are not suitable for production use. We recommend running microservice instance(s) on your local machine or in the cloud using IBM Cloud Kubernetes, Azure Kubernetes Service, or Google Kubernetes Engine:

1. Deploy the deep learning microservice in the desired environment.
2. Take not of its URL (e.g. `http://localhost:5000`)
3. Add the corresponding deep learning node to your canvas.
4. Open the node properties.
5. Add a service entry for the URL and assign it a unique name.

  ![configure microservice connectivity](/docs/images/configure_microservice_connectivity.png)

## Supported application domains

This Node-RED node module supports the following application domains:

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

- [Inception ResNet v2](https://developer.ibm.com/exchanges/models/all/max-inception-resnet-v2/)

    Identify objects in images using a third-generation deep residual network.   

Note: file inject node in [node-red-contrib-browser-utils](https://flows.nodered.org/node/node-red-contrib-browser-utils) is useful to test these nodes.

    
License
-------

[Apache-2.0](LICENSE)
