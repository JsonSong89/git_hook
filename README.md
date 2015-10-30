# git 自动发布系统

------
首先在接收方(以centos vps为例)部署本程序,建议全局安装并使用forever部署,这样就发布了一个可以监听http请求的服务.

在github定义好webhook,指向接收方提供的http监听地址,然后以任何形式更新代码,github会往定义的hook接收地址发送一个post请求,包含了该次commit修改了哪个仓库 ,哪些文件,几个update add等等非常详细的信息

接收方收到请求后,可以分析请求的信息来执行一系列定义好的指令
比如该项目是
> * 使用git命令拉取最新的代码
> * 执行npm install(update)
> * forever重启服务

这样就完成了代码的自动更新发布