##2016.6.1真是喵了个咪
>好不容易调好了全局变量，居然发现session缓存无法生成

##参考
* http://blog.fity.cn/post/191/
* http://blog.csdn.net/shaobingj126/article/details/7243398

##解决方案：
###调整/etc/php5/apache2/php.ini配置
>与几个变量有关
session.cookie_path = // 定义允许使用session的区域，系表示session生效的网站域，与文件权限无关session.save_path = // 设置session临时文件储存的位置，好，重点来了，此处要求文件必须拥有读写权限

* 重点
    - 保存session缓存的文件目录，服务器必须拥有对距地读写权限

##分析
* 因为读写权限的问题，导致服务器无法创建缓存
* 之前葛文件权限为 drwx rwx r-x
* 最后一项系其他用户权限 （可读 不可写 可执行）
* sudo chmod 777 dir_path 提升文件权限
* drwx rwx rwx
* 搞掂睡觉

##note
* sudo chmod 600 ××× （只有所有者有读和写的权限）  
* sudo chmod 644 ××× （所有者有读和写的权限，组用户只有读的权限）  
* sudo chmod 700 ××× （只有所有者有读和写以及执行的权限）  
* sudo chmod 666 ××× （每个人都有读和写的权限）  
* sudo chmod 777 ××× （每个人都有读和写以及执行的权限）
* linux p59

##详解
* 权限777表示成二进制即111 111 111 对应 rwx rwx rwx
* 666 => 110 110 110 => rw- rw- rw-
