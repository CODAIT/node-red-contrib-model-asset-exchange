node-red-contrib-model-asset-exchange
=====================

Node-RED node for Model Asset eXchange

Install
-------

Run the following command in your Node-RED user directory - typically `~/.node-red`

        npm install node-red-contrib-model-asset-exchange

About Model Asset eXchange
-----
[Model Asset eXchange](https://developer.ibm.com/exchanges/models/) is a place for developers to find and use free and open source deep learning models.
This Node-RED node modules supports the following models.

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

Note: file inject node in [node-red-contrib-browser-utils](https://flows.nodered.org/node/node-red-contrib-browser-utils) is useful to test these nodes.

Video
-----

 - MAX Object Detector Web App Demo

    [![](https://img.youtube.com/vi/Hs6sVWmfVFw/0.jpg)](https://www.youtube.com/watch?v=Hs6sVWmfVFw)