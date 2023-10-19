import axios from "axios";

const cityGEOInstance = axios.create({
    //各接口：
    //  搜索城市：/geo/cities
    //  查国家货币：/locale/currencies
    baseURL: "https://wft-geo-db.p.rapidapi.com/v1",
    timeout: 5000
});

cityGEOInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem("cityGEOToken");

        if (token) {
            config.headers["X-RapidAPI-Key"] = token;
            config.headers["X-RapidAPI-Host"] = "wft-geo-db.p.rapidapi.com";
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

cityGEOInstance.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        return Promise.reject(error);
    }
);

export function getCityGEO(url, params) {
    return cityGEOInstance.get(url, {
        params: params
    });
}