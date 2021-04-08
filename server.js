const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('./dist'));

/*app.get('/*', function (req, res) {
    res.sendFile('index.html', { root: 'dist/<name-on-package.json>/' }
    );
});*/

const forceSSL = function () {
    return function (req, res, next) {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(
                ['https://', req.get('Host'), req.url].join('')
            );
        }
        next();
    }
}
app.use(forceSSL());

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
  });

app.listen(process.env.PORT || 8080);
console.log('listening on port ',process.env.PORT);