import axios from "axios";

const cityWebsInstance = axios.create({
    //各接口：
    //  谷歌根据关键词搜索：/
    baseURL: "https://google-search74.p.rapidapi.com",
    timeout: 5000
});

cityWebsInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem("cityWebsToken");

        if (token) {
            config.headers["X-RapidAPI-Key"] = token;
            config.headers["X-RapidAPI-Host"] = "google-search74.p.rapidapi.com";
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

cityWebsInstance.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        return Promise.reject(error);
    }
);

export function getCityWebs(url, params) {
    return cityWebsInstance.get(url, {
        params: params
    });
}