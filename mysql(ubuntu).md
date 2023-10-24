##安装必要的包
```sh
sudo apt-get install mysql-client
sudo apt-get install mysql-server
```

##运行mysql初始化安全脚本
```sh
sudo mysql_secure_installation
```
问答式配置。除了密码强度需要设置，其余y就行

##测试mysql运行状态
```sh
systemctl status mysql.service
```

##启动mysql服务
```sh
sudo service mysql restart
```

##设置MySQL服务开机自启动
```sh
sudo systemctl disable mysql.service
```

##配置mysql远程登录
打开配置文件
```sh
sudo vim /etc/mysql/mysql.conf.d/mysqld.cnf
```
有时候，为了开发方便，我们需要使用本地电脑远程访问和管理MySQL数据库。默认情况下，为了安全MySQL只允许本地登录，如果要开启远程连接，则需要修改/etc/mysql/mysql.conf.d/mysqld.cnf配置文件。

打开配置文件，找到bind-address = 127.0.0.1这一行
改为bind-address = 0.0.0.0即可或简单一点注释掉也行

##给root更换密码
打开以下文件：
```sh
sudo cat /etc/mysql/debian.cnf
```
用debian-sys-maint用户先登录
```sh
mysql -u debian-sys-maint -p
# 输入文件中显示的密码，进入mysql命令行
```
用sql语句修改密码，然后退出
```sql
# 没有with子句，命令行要sudo，workbench也连不上
alter user 'root'@'localhost' identified with mysql_native_password by '这里填你要的密码';
quit;
```

##登录mysql
```sh
mysql -u root -p
# 可以-p后直接接密码，也可以这样执行后再输密码
```

##安装mysql workbench
去官网下载ubuntu版本，并放到桌面
```sh
# 可能的依赖项
sudo apt install libmysqlclient21, libpcrecpp0v5, libproj22, libzip4

# 解压安装包
sudo dpkg -i ~/桌面/安装包名
```
安装完成