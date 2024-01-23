const express = require('express');
const Unblocker = require('unblocker');
const Transform = require('stream').Transform;

const app = express();

function googleAnalyticsMiddleware(data) {
    if (data.contentType === 'text/html') {
        data.stream = data.stream.pipe(new Transform({
            decodeStrings: false,
            transform: function(chunk, encoding, next) {
                // Modify the HTML content if needed
                this.push(chunk);
                next();
            }
        }));
    }
}

const unblocker = new Unblocker({
    prefix: '/proxy/',
    responseMiddleware: [
        googleAnalyticsMiddleware
    ]
});

app.use(unblocker);

app.use('/', express.static(__dirname + '/public'));

const port = process.env.PORT || process.env.VCAP_APP_PORT || 8080;

app.listen(port, function() {
    console.log(`Node unblocker process listening at http://localhost:${port}/`);
}).on("upgrade", unblocker.onUpgrade);


