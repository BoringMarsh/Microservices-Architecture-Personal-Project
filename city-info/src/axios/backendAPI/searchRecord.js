import axios from 'axios';

const searchRecordInstance = axios.create({
    //各接口
    //  传回所有记录：/record
    //  根据id传回一条记录：/record/<int:pk>
    //  添加record：/record/add
    //  根据id删一条记录：/record/delete/<int:pk>
    baseURL: "http://100.80.100.58:80/api",
    timeout: 30000
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