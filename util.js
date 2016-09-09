#!/usr/bin/env node
'use strict';
/*global , require, process, module*/

var cp = require('child_process');
var Thenjs = require('thenjs');

function execCmd(cmdStr, cont) {
    return Thenjs(function (_cont) {
        cp.exec(cmdStr, cont || _cont);
    })
}

var log = console.log.bind(console);


module.exports = {
    execCmd,
    log,
    root:__dirname
};