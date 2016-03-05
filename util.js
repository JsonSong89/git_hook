#!/usr/bin/env node
'use strict';
/*global , require, process, module*/


function execCmd(cmdStr, cont) {
    return then(function (_cont) {
        cp.exec(cmdStr, cont || _cont);
    })
}

var log = console.log.bind(console);


module.exports = {execCmd,log};