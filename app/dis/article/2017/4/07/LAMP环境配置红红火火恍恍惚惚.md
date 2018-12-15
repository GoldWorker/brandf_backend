##LAMP配置学习记录&ubuntu exp add
###相关命令解析
* sudo apt-get install sth
* 更新apt-get资源
    - sudo apt-get update
    - sudo apt-get dist-upgrade
* 寻找文件
    - grep -iR string path 匹配相关字符串
    - find
    - whereis fileName
    - whitch
* 文件操作相关
    - stat / ls -l 列出文件详情
    - cat -n 显示行数
    - cat -a 所有
    - tac 反序显示内容
    - chomd -R 777 path 赋予文件权限
* 常用服务操作
    - service apache2/vsftpd/mysql.. start/restart/stop
* linux中的链接类似window下的快捷方式，又分为软链接和硬链接

---
##Apache2 setting
* http://blog.csdn.net/veizz/article/details/7410784
###目录结构
* /etc/apache2 (main dir)
* main dir 下
* apache2.conf (ubuntu发行版的) 普通为 httpd.conf
* 包含动态模块的配置:
    - Include /etc/apache2/mods-enabled/*.load
    - Include /etc/apache2/mods-enabled/*.conf
* 配置文件
    - /etc/apache2/sites-enabled
* 包含用户自己的配置:
    - Include /etc/apache2/httpd.conf
* 包含端口监听的配置:
    - Include /etc/apache2/ports.conf
* 包含一般性的配置语句片断:
    - Include /etc/apache2/conf.d/
* 包含虚拟主机的配置指令:
    - Include /etc/apache2/sites-enabled/
* 许多用户自定义配置在/etc/apache2/sites-enabled/000-default中

> apache2内部文件机理小解
再看看/etc/apache2目录下的东西。刚才在apache2.conf里发现了sites-enabled目录，而在 /etc/apache2下还有一个sites-available目录，这里面是放什么的呢？其实，这里面才是真正的配置文件，而sites- enabled目录存放的只是一些指向这里的文件的符号链接
---
##Php5 conf
* http://www.2cto.com/os/201505/401588.html
* http://www.2cto.com/Article/201103/85458.html
###目录结构
* /etc/php5/apache2/php.ini
###process
* 让Apache支持php依赖包，安装命令：sudo apt-get install libapache2-mod-php5
* 安装php5-gd模块，安装命令：sudoapt-get install php5-gd
* 如果想支持Mysql就加php5-mysql
* 让PHP支持curl
* 如果没有安装，则：apt-get install php5-curl
* 在/etc/php5/apache2/php.ini配置php_error.log

---
##Mysql conf
* http://blog.knowsky.com/186050.htm</a></h2>
* 安装sudo apt-get install mysql-server / mysql-client
* 在安装过程中设置sql密码
* /etc/init.d/mysql start 在/etc/init.d中有各种启动项
* mysql -uroot -p (用root账户登录),然后输入密码

---
##Phpadmin conf
###目录结构
* /usr/share/phpmyadmin 尚未改动配置文件
###Process
* 安装之后，由于def dir 在/usr/share/phpmyadmin
* sudo ln-s /usr/share/phpmyadmin/ /var/www/pma 建立链接到documentRoot
* 需要php5-mcrypt组件
* 安装完mcrypt之后发现在/etc/php5/apache2/con.d中没有组件链接，真是喵了个咪
* 进入 /etc/php5/apache2
* 修改其下的php.ini(eg:sudo vim php.ini)，
* 找到如下字段并添加红色字串
    - Dynamic Extensions
    - If you wish to have an extension loaded automatically, use the following
    - 加入以下参数
    - extension=php_mcrypt.so
    - 进入/etc/php5/apache2/conf.d，
    - 建立链接
    - 执行sudo ln -s ../../mods-available/mcrypt.ini ./20-mcrypt.ini

---
##Ftp conf
查看端口
netstat -nat |grep 21
###vsftpd server
* http://www.linuxidc.com/Linux/2015-01/111970.htm
* http://hujizhou.blog.51cto.com/514907/1290915
####目录结构
* /etc/vsftpd.conf
* /etc/vsftpd.chroot_list (后来建立的用户列表)
* /etc/ftp_allowed_list（以下无效操作建立的用户表）
* .配置文件：位置：/etc/vsftpd/　vsftpd.conf: 主配置文件
* http://jingyan.baidu.com/article/67508eb4d6c4fd9ccb1ce470.html</a></h3>
#####创建新用户
* sudo useradd -d /home/uftp -s /bin/bash uftp
* sudo passwd uftp
* 在vsftp.conf中chroot_list_file有作出了改动

> 无效的操作，以下操作似乎并没有执行，尝试操作后发现进程吾响应，应该为版本问题
userlist_deny=NO userlist_enable=YES
userlist_file=/etc/allowed_users"和"seccomp_sandbox=NO"
-->使文件中的"local_enable=YES"-->保存
"sudo gedit /etc/allowed_users"-->回车-->输入uftp-->保存， 文件创建成功。

####猜测由于这一步没有创建ftp用户管理导致以下错误
* Error：553 Could not create file
    - 导致不能上传
 
第一个5代表的本用户只有读和执行的权限，所以当前用户是没办法创建文件的。 解释：权限中 1表示读，2表示写，4表示执行，那么5就是 “读和执行”权限，所以没法创建的。

> 备注：第二个5是表示同组用户有读和执行，第三个3表示的是其余用户有读和写权限。

####暂时解决
> 在ftp目录中创建一个权限为777的目录
但有所局限：上传的文件需要用777解放权限 Edit By MaHua Edit By MaHua Edit By 

##mdi+tab=>![Alt text](/path/to/img.jpg "Optional title")
##mdl+tab=>[](link)