#!/bin/bash

sudo service nginx restart
echo 'nginx已启动'

sudo killall -9 uwsgi
cd ~/桌面/CityInfoBackend
echo '原有uwsgi已关闭'

uwsgi uwsgi.ini
echo 'uwsgi已启动'
