### Ubuntu下部署环境

### Nginx
1.安装Nginx
```
sudo apt-get install nginx
```
2.前往nginx的按照目录进行配置，不用版本的目录可能有所不同，大概找找，要在sites-available目录下的default进行配置，至于为什么要在sites-available目录下，那是因为还有一个available目录是连接目录，类似于window的快捷方式，那肯定是不去改快捷发送啦。
```
sudo vim /etc/nginx/sites-available/default
```
3.具体配置可参考 <http://www.tuicool.com/articles/MBfaeuB>
> Ps:另外如果apache2在运行，ngnix是无法运行的

4.然后可以按照命令检测一下Nginx是否启动正常
```
sudo service nginx start
sudo service nginx status
sudo service apache2 status
sudo service apache2 stop
sudo service apache2 status
sudo service nginx start
sudo service nginx status
```

- [遇到同样问题的一小伙子，发现半天都启动Nginx不成功的原因竟然是。。。](http://blog.csdn.net/SakuraLLj/article/details/46368429)

---

### Nodejs
0.安装NodeJs
  - 网上大多都是以apt-get这种方式去下载安装的
  - 吐槽一下apt-get，这里的资源不知是多少年前的了，安装的npm是1.1版本，nodejs是0.1版本，我天。而且所使用的命令是nodejs，不是node，我猜是版本太低的原因，nodejs后来的一次社区分裂可能是问题的原因
  - <http://www.infoq.com/cn/articles/node-js-and-io-js/>
  - nodejs版本太低导致npm无法安装包，就连`npm install -g npm`自身更新都无法进行，这就比较尴尬了。

1.从node官网下载已编译好了的node 
```
wget https://nodejs.org/dist/v4.6.0/node-v4.6.0-linux-x64.tar.xz
tar -xvf node-v4.6.0-linux-x64.tar.xz
cd node-v4.6.0-linux-x64.tar.xz
```
2.拷贝安装
```
sudo cp -r bin include lib share /usr/local/
```
3.node 命令测试
```
node -v
```
4.更新npm
```
npm install -g npm
```
5.安装nodejs版本管理工具n
```
npm install -g n
```
6.更新nodejs到稳定版本
```
n stable
```

>OK，一切都准备就绪，还差mysql

---
### Mysql
1.安装mysql
```
sudo apt-get install mysql-server mysql-client
```
2.检测是否安装成功
```
sudo netstat -tap | grep mysql
```
3.安装好mysql后，用navicat进行远程连接，不出意外，首先会碰到2003错误，这是因为mysql对地址进行了绑定，只允许本地操作，不急，这很好解决。
- 找到 `vim /etc/mysql/mysql.conf.d/mysqld.cnf` 类似这样的配置文件，不同版本位置会有小小不同
- 加#号注释 `bind-address = 127.0.0.1` 
- 重启服务 `/etc/init.d/sudo mysql restart`
- <http://www.cnblogs.com/patrickding/p/6435459.html>

4.在设置好之后就会碰到1045错误，不要问我为什么知道
- 那是mysql没有分配给你权限
- 进入`/etc/init.d`
- 进入mysql `mysql -h localhost -u root -p`
- 进入mysql表
```
mysql>use mysql;
```
- 查看权限表
```
mysql>select host, user from user;
```
- 赋予地址为192.168.1.*的主机*权限，可进入*数据库，账号myuser，密码mypassword
```
mysql>GRANT ALL PRIVILEGES ON *.* TO 'myuser'@'192.168.1.*' IDENTIFIED BY 'mypassword' WITH GRANT OPTION;
```
- 刷新一下，让配置生效
```
mysql>FLUSH   PRIVILEGES;
```
> 需要取消权限时
```
mysql>Delete from user where user = "user_name" and host = "host_name" ;
mysql>FLUSH   PRIVILEGES;
```
- <http://blog.csdn.net/lhh1002/article/details/6131733>
- <http://www.cnblogs.com/guigujun/p/6265891.html>

### All done,至此就可以开心的使用node开发了
