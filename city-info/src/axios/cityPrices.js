import axios from "axios";

const cityPricesInstance = axios.create({
    //各接口
    //  返回所有城市：/cities
    //  查询城市物价：/prices
    baseURL: "https://cost-of-living-and-prices.p.rapidapi.com",
    timeout: 5000
});

cityPricesInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem("cityPricesToken");

        if (token) {
            config.headers["X-RapidAPI-Key"] = token;
            config.headers["X-RapidAPI-Host"] = "cost-of-living-and-prices.p.rapidapi.com";
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

cityPricesInstance.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        return Promise.reject(error);
    }
);

export function getCityPrices(url, params) {
    return cityPricesInstance.get(url, {
        params: params
    });
}