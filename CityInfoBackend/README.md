# city-info后端

- shell脚本是在调试过程中简化操作而创建
- nginx的.conf配置文件可以从这个目录复制到/etc/nginx/conf.d文件夹中，也可以按照配置方法文档：
  ```
  本GitHub项目/files/configuration&deployment/uwsgi+nginx(ubuntu).md
  ```
  里面说的步骤创建一个.conf文件

## 更改项目nginx配置文件
```sh
bash edit-nginx.sh
```

## 更新并试运行django项目
```sh
bash fresh.sh
```

## 后端部署启动
```sh
bash start.sh
```

## 后端部署停止
```sh
bash stop.sh
```

难绷，教学楼、宿舍、图书馆的TJ-WIFI还不一样，虚拟机IP全部都不同（教学楼的还不能直接用桥接网卡，要手动配置），后端部署IP老是要换，受不了一点