# city-info前端

## Project setup
```
npm install
```

## Compiles and hot-reloads for development
```
npm run serve
```

## Compiles and minifies for production
```
npm run build
```

## 前端部署
将dist文件夹复制到nginx目录中的html文件夹，设置nginx.conf中html.server.server_name为本机ipv4地址，location /改成：
```conf
location / {
    root   html/dist;
    index  index.html index.htm;
}
```
以及找到相应块并改成：
```conf
location = /50x.html {
    root   html/dist;
}
```
启动nginx
```sh
nginx
```
关闭nginx（两种均可）
```sh
nginx -s stop
nginx -s quit
```

### 消除浏览器控制台警告
组件已注册警告
```js
if (!app.component("name")) {
    app.component("name", NameComponent);
}  //先判断组件是否注册，避免重复注册
```
报'exmid'为null警告
```
浏览器安装了插件，禁用即可
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
