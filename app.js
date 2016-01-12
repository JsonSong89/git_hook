/**
 * Created by json on 2015/10/10.
 */

'use strict';
/*global global, require, process, module, baejs*/
/*jslint node: true */

var express = require('express');
var bodyParser = require('body-parser');
var cmd = require('./cmdList');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var router = express.Router();
router.get('/', function (req, res, next) {
    console.log(req.params);
    res.send(req.params);
});
router.post('/hook', function (req, res, next) {
    console.log(req.body);
    try {
        var name = req.body.repository.name;
        if (name === "bae_node") {
            cmd.build_bae()
        }
        if (name === "git_hook") {
            cmd.build_git_hook()
        }
        if (name === "HelloScala") {
            var message = req.body.message;
            if (_.includes(message,"spider.publish")){
                cmd.build_spider()
            }else{
                console.log(new Date()+"little commit and no publish")
            }
        }
    }
    catch (ex) {
    }
    res.send(req.body);
});
app.use('/', router);

console.log("baehook is start at 4070");
app.listen('4070');

