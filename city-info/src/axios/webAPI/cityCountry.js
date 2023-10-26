import axios from "axios";

const cityCountryInstance = axios.create({
    //各接口：
    //  搜索国家：/country
    //  返回所有国家：/countries
    baseURL: "https://rest-countries10.p.rapidapi.com",
    timeout: 30000
});

cityCountryInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem("cityCountryToken");

        if (token) {
            config.headers["X-RapidAPI-Key"] = token;
            config.headers["X-RapidAPI-Host"] = "rest-countries10.p.rapidapi.com";
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

cityCountryInstance.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        return Promise.reject(error);
    }
);

export function getCityCountry(url, params) {
    return cityCountryInstance.get(url, {
        params: params
    });
}