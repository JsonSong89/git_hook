'use strict';
/*global global, require, process, module, baejs*/
/*jslint node: true */
/**
 * Created by jsons on 2015/10/10.
 * all command  are here
 */

let execCmd = require('./util').execCmd
let log = require('./util').log


function setOption(program) {
    program.option("-k,--kill <port>", "kill pid with the port", (port)=> {
        var getPid = `netstat -anp|grep ${port}|awk '{printf $7}'|cut -d/ -f1`;
        execCmd(getPid)
            .then((cont, stdout)=> log("build is over \n " + stdout))
            .then((cont, _port)=>execCmd("kill -9 " + _port, cont))
            .then((cont, out)=>log(out))
            .fail((cont, out)=>log(out))
    });

    return program
}


module.exports = {setOption};