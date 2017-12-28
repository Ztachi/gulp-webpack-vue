const path = require('path'),
    paths = {
        view: path.resolve(__dirname, './src/static')
    }

function routers(app) {
    app.get('/', (req, res) => {
        res.sendFile(paths.view + '/index.html');
    });
}
module.exports = routers;