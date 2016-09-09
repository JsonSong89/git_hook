'use strict';
/*global global, require, process, module, baejs*/
/*jslint node: true */
/**
 * Created by jsons on 2015/10/10.
 * all command  are here
 */

var cp = require('child_process');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var Thenjs = require('thenjs');
var o = {};

let execCmd = require('./util').execCmd
let log = require('./util').log
let root = require('./util').root

o.ss_restart = function () {
    cp.exec('  /etc/init.d/shadowsocks restart    ',
        function (error, stdout, stderr) {
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
};

let checkFun = function () {
    let checkThings = ["/work/jar/weixin.jar", "/work/jar/bms.jar",
        "/work/config/application.properties"];
    return Thenjs.each(checkThings, function (cont, checkPath) {
        fs.exists(checkPath, exists=> {
            exists || log(checkPath + " is not exist");
            cont(null, exists)
        })
        // 并行执行队列任务，把队列 list 中的每一个值输入到 task 中运行
    }).then(function (cont, result) {
        let flag = result.every(a=>a)
        cont(null, flag);
    })
}

o.check = function () {
    checkFun().then((cont, flag)=> {
        log(`check result  is ${flag}`)
    })
};
o.start_weixin = function () {
    checkFun().then((cont, flag)=> {
        if (flag) {
            cont(null)
        } else {
            cont(new Error("invalid config"))
        }
    }).then((cont)=> {
        let sh = path.join(root, "start_weixin.sh")
        execCmd(sh, cont)
    }).then((cont, stdout, stderr)=> {
        console.error(stdout);
    }).fail(function (cont, error) {
        console.error(error);
    });
};

o.build_git_hook = function () {
    execCmd(' cd /work/git_hook; git pull;npm update;npm install -g; pm2 restart app.js;')
        .then(function (cont, stdout) {
            console.log("build is over \n " + stdout);
        });
};
o.build_show = function () {
    var cmdStr = [" cd /work/spider/SpiderShow;",
        "git pull;npm install;",
        " npm run build;",
        "\\cp -f  -r   /work/spider/SpiderShow/dist  /work/bae_node/public/spider ; ",
        "\\cp -f /work/spider/SpiderShow/index.html  /work/bae_node/public/spider/index.html ; "
    ].join("\n");


    execCmd(cmdStr)
        .then(function (cont, stdout) {
            console.log("build is over \n " + stdout);
        });
};


o.publish_spider = function () {
    var creatJarCmd = ' cd /work/HelloKotlin ; git pull; cd /work/HelloKotlin/kotlin-spider; mvn package ;  ';
    '\\cp -f /work/HelloKotlin/kotlin-spider/target/kotlin.spider-*.jar  /work/spider/spider.jar ; ';

    var runStr = ' cd /work/spider ; ' +
        ' rm -rf /work/spider/spring.out   ; ' +
        ' nohup ./startSpider.sh & > /work/spider/spring.out &';
//java -jar spider.jar

    console.log("creatJarCmd is : " + creatJarCmd);
    execCmd(creatJarCmd).then(function (cont, stdout) {
        console.log("package is over \n " + stdout);
        return execCmd(runStr, cont)
    }).then(function (cont, stdout) {
        console.log("publish is over \n " + stdout);
    });
};

o.build_spider = function () {

    var getPid = "netstat -anp|grep 9001|awk '{printf $7}'|cut -d/ -f1  ";
    // var killOld = "netstat -anp|grep 9001|awk '{printf $7}'|cut -d/ -f1 | xargs kill -9 ";

    Thenjs(function (cont) {
        cp.exec(getPid,
            function (error, stdout, stderr) {
                var out = _.trim(stdout);
                if (!out || out == "\n") {
                    console.log('spider nohup task is not running ');
                    return cont()
                } else {
                    return execCmd("kill -9 " + out, cont)
                }
            });
    }).then(function (cont) {
        o.publish_spider()
    })
};


module.exports = o;
