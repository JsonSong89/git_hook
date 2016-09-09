
screen -S weixin -X  stuff $'\003'
screen -S weixin -X  stuff '\\r'
screen -S weixin -X  stuff 'java -jar /work/jar/weixin.jar --spring.config.location=/work/config/application.properties \\r'