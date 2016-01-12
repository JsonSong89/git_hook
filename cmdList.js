'use strict';
/*global global, require, process, module, baejs*/
/*jslint node: true */
/**
 * Created by jsons on 2015/10/10.
 * all command  are here
 */

var cp = require('child_process');
var _ = require('lodash');
var then = require('thenjs');
var o = {};

function execCmd(cmdStr) {
    return then(function (cont) {
        cp.exec(cmdStr, cont);
    })
}

o.ss_restart = function () {
    cp.exec('  /etc/init.d/shadowsocks restart    ',
        function (error, stdout, stderr) {
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
};

o.build_bae = function () {
    execCmd(' cd /work/bae_node; git pull;npm update; forever restart app.js;');
};
o.build_git_hook = function () {
    execCmd(' cd /work/git_hook; git pull;npm install -g; forever restart app.js;');
};

o.start_sd = function () {
    execCmd(' cd /work/scala/activator-dist-1.3.6; ./activator ui ; ');
};


o.publish_spider = function () {
    var creatJarCmd = ' cd /work/HelloScala/ScalaSpider ; git pull;  mvn package ;  ' +
        '\\cp -f /work/HelloScala/ScalaSpider/target/scala.spider-0.0.1.jar  /work/scala/spider/spider.jar ; ' +
        ' cd /work/scala/spider ; ' +
        ' rm -rf nohup.out    ; ' +
        ' nohup ./startSpider.sh &' +
        '';

    console.log("creatJarCmd is : "+creatJarCmd);
    execCmd(creatJarCmd).then(function(cont){
        console.log("publish is over ")
    });
};

o.build_spider = function () {

    var  getPid = "netstat -anp|grep 9001|awk '{printf $7}'|cut -d/ -f1  ";
   // var killOld = "netstat -anp|grep 9001|awk '{printf $7}'|cut -d/ -f1 | xargs kill -9 ";

    return then(function (cont) {
        cp.exec(getPid,
            function (error, stdout, stderr) {
                var out =  _.trim(stdout);
                if (!out || out=="\n" ) {
                    console.log('spider nohup task is not running ');
                    return cont()
                }else{
                    return  execCmd("kill -9 "+out).then(function(_cont){
                        return cont()
                    })
                }
            });
    }).then(function (cont) {
        o.publish_spider()
    })
};


module.exports = o;
