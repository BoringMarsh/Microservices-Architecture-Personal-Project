import axios from 'axios';

const searchRecordInstance = axios.create({
    //各接口
    //  传回所有record：/record
    //  添加record：/record/add
    baseURL: "http://127.0.0.1:8000/api",
    timeout: 5000
});

searchRecordInstance.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

searchRecordInstance.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        return Promise.reject(error);
    }
);

export function getSearchRecord(url, params) {
    return searchRecordInstance.get(url, {
        params: params
    });
}

export function addSearchRecord(url, data) {
    return searchRecordInstance.post(url, data);
}