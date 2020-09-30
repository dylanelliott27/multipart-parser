# Multipart/form-data parser.
When a HTML form is sent with the enctype of "multipart/form-data", it is sent in a format where each element of the form (file, input, select) is divided into seperate blocks, each with a header for info about the element.

This library is designed to parse the raw buffer that is sent from the client, and is turned into a useful object with keys for each form element, and a useable buffer for the value of each form element.

Note: as of 2020/09/30, only has been tested with image files (png, jpg) & of course text. Is able to write images to disk with no corruption.

# HOW TO USE
```javascript
const MultipartParser = require('./src/MultipartParser');

const parser = new MultipartParser(multipartEncodedBuffer); // pass your buffer to the constructor

const parsedData = parser.parse(); // object containing form names & values in buffer format is returned to parsedData

```
