# city-info

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Backend Run
```
cd CityInfoBackend
python manage.py runserver
```

### 组件已注册警告
```js
if (!app.component("name")) {
    app.component("name", NameComponent);
}  //先判断组件是否注册，避免重复注册
```

### 报'exmid'为null警告
```
浏览器安装了插件，禁用即可
```


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
