#!/bin/bash

sudo service nginx stop
echo 'nginx已停止运行'
sudo killall -9 uwsgi
echo 'uwsgi已停止运行'
