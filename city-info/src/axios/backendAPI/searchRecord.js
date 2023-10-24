import axios from 'axios';

const searchRecordInstance = axios.create({
    //各接口
    //  传回所有record：/record
    //  添加record：/record/add
    baseURL: "http://100.80.100.58:80/api",
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

export function deleteSearchRecord(url, data) {
    return searchRecordInstance.delete(url, {
        data: data
    });
}