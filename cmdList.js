/**
 * Created by jsons on 2015/10/10.
 * all command  are here
 */
'use strict';
/*global global, require, process, module, baejs*/
/*jslint node: true */

var o = {};

o.ss_restart = function () {
    cp.exec('  /etc/init.d/shadowsocks restart    ',
        function (error, stdout, stderr) {
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
};

o.git_pull = function () {
    cp.exec(' cd /work/bae_node; git pull;npm update;   ',
        function (error, stdout, stderr) {
            if (error !== null) {
                console.log('exec error: ' + error);
                console.log('exec stderr: ' + stderr);
            } else {
                console.log('exec stdout: ' + stdout);
            }
        });
};
module.exports=o;
