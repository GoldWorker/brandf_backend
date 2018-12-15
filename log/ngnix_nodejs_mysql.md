### Ubuntu下部署环境
- 首先部署ngnix

### Ngnix
- sudo apt-get install nginx
- 配置ngnix -> sudo vim /etc/nginx/sites-available/default
- <http://www.tuicool.com/articles/MBfaeuB>
- 另外如果apache2在运行，ngnix是无法运行的

> 
> sudo service nginx start
> sudo service nginx status
> sudo service nginx status
> sudo service apache2 status
> sudo service apache2 stop
> sudo service apache2 status
> sudo service nginx start
> sudo service nginx status
- <http://blog.csdn.net/SakuraLLj/article/details/46368429>

###nodejs
- 吐槽一下apt-get，这里的资源不知是多少年前的了，安装的npm是1.1版本，nodejs是0.1版本，我天。而且所使用的命令是nodejs，不是node，我猜是版本太低的原因，nodejs后来的一次社区分裂可能是问题的原因
- <http://www.infoq.com/cn/articles/node-js-and-io-js/>
- nodejs版本太低导致npm无法安装包，就连`npm install -g npm`自身更新都无法进行，这就比较尴尬了。

#### resole
>
    # 从node官网下载已编译好了的node 
    wget https://nodejs.org/dist/v4.6.0/node-v4.6.0-linux-x64.tar.xz
    tar -xvf node-v4.6.0-linux-x64.tar.xz
    cd node-v4.6.0-linux-x64.tar.xz
    # 拷贝安装
    sudo cp -r bin include lib share /usr/local/
    # node 命令测试
    node -v
    # 更新npm
    npm install -g npm
    # 安装nodejs版本管理工具n
    npm install -g n
    # 更新nodejs到稳定版本
    n stable

>OK，一切都准备就绪

### Mysql
- 安装好mysql后，想用navicat进行远程连接，结果一言不合丢一堆错误给我
- 首先，不出意外，会碰到2003错误
- 不急，这很好解决，原因系mysql对地址进行了绑定
- 找到vim /etc/mysql/mysql.conf.d/mysqld.cnf类似这样的配置文件，版本吾同，位置吾同
- 加#号注释`bind-address            = 127.0.0.1` 
- 重启服务`/etc/init.d/sudo mysql restart`
- <http://www.cnblogs.com/patrickding/p/6435459.html>

- 好，之后你会碰到1045错误，不要问我为什么知道-.-
- 那是mysql没有分配给你权限
- 进入`/etc/init.d`
- 进入mysql `mysql -h localhost -u root -p`

>
    进入mysql表
    mysql>use mysql;
    查看权限表
    mysql>select host, user from user;
    赋予地址为192.168.1.*的主机*权限，可进入*数据库，账号myuser，密码mypassword
    mysql>GRANT ALL PRIVILEGES ON *.* TO 'myuser'@'192.168.1.*' IDENTIFIED BY 'mypassword' WITH GRANT OPTION;
    刷新一下，让配置生效
    mysql>FLUSH   PRIVILEGES;
    取消权限
    mysql>Delete from user where user = "user_name" and host = "host_name" ;
    mysql>FLUSH   PRIVILEGES;
- <http://blog.csdn.net/lhh1002/article/details/6131733>
- <http://www.cnblogs.com/guigujun/p/6265891.html>
