/*
 * @Author: 詹真琦(legendryztachi@gmail.com)
 * @Date: 2017-12-08 10:46:27 
 * @Description: 
 * @Last Modified by: 詹真琦(legendryztachi@gmail.com)
 * @Last Modified time: 2017-12-20 16:43:05
 */

const express = require('express'),
    app = express(),
    http = require('http'),
    path = require('path'),
    bodyParser = require('body-parser'),
    routers = require('./routers');
app.use(bodyParser.json());
const staticBasePath = path.join(__dirname, 'src');
app.use(express.static(path.join(staticBasePath, 'static')));
app.use('/common',express.static(path.join(staticBasePath, 'common')));
const server = http.createServer(app).listen(3000);
routers(app);