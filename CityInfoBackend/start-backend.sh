#!/bin/bash

sudo service nginx restart
sudo killall -9 uwsgi
cd ~/桌面/CityInfoBackend
uwsgi uwsgi.ini
