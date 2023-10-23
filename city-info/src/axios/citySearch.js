import axios from 'axios';

const citySearchInstance = axios.create({
    //各接口：
    //  搜索城市：/city
    baseURL: "https://eolink.o.apispace.com/456456/function/v001",
    timeout: 5000
});

citySearchInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem("citySearchToken");

        if (token) {
            config.headers["X-APISpace-Token"] = token;
            config.headers["Authorization-Type"] = "apikey";
        }
        
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

citySearchInstance.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        return Promise.reject(error);
    }
);

export function getCitySearch(url, params) {
    return citySearchInstance.get(url, {
        params: params
    });
}