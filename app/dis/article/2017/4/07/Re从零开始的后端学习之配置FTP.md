### FTP 配置
1. 查看端口是否开放，若关闭则需要开放
```
netstat -nat |grep 21
```
### 搭建FTP服务器 vsftpd server
- http://www.linuxidc.com/Linux/2015-01/111970.htm
- http://hujizhou.blog.51cto.com/514907/1290915

#### 主要目录以及配置文件
```
/etc/vsftpd.conf
/etc/vsftpd.chroot_list (后来建立的用户列表)
/etc/ftp_allowed_list（以下无效操作建立的用户表）

配置文件位置：/etc/vsftpd/
主配置文件(vsftpd.conf)
http://jingyan.baidu.com/article/67508eb4d6c4fd9ccb1ce470.html
```

#### 创建新用户
* sudo useradd -d /home/uftp -s /bin/bash uftp
* sudo passwd uftp
* 在vsftp.conf中chroot_list_file有作出了改动

> 无效的操作，以下操作似乎并没有执行，尝试操作后发现进程吾响应，应该为版本问题
userlist_deny=NO userlist_enable=YES
userlist_file=/etc/allowed_users"和"seccomp_sandbox=NO"
-->使文件中的"local_enable=YES"-->保存
"sudo gedit /etc/allowed_users"-->回车-->输入uftp-->保存， 文件创建成功。

#### 猜测由于这一步没有创建ftp用户管理导致以下错误
* Error：553 Could not create file
    - 导致不能上传
 
第一个5代表的本用户只有读和执行的权限，所以当前用户是没办法创建文件的。 解释：权限中 1表示读，2表示写，4表示执行，那么5就是 “读和执行”权限，所以没法创建的。

> 备注：第二个5是表示同组用户有读和执行，第三个3表示的是其余用户有读和写权限。

####暂时解决
> 在ftp目录中创建一个权限为777的目录
但有所局限：上传的文件需要用777解放权限 Edit By MaHua Edit By MaHua Edit By 