import axios from "axios";

const cityAirportInstance = axios.create({
    //各接口：
    //  查找机场：/airports（后面有/的为查找机场，无/的为列出所有机场）
    baseURL: "https://world-airports-directory.p.rapidapi.com/v1",
    timeout: 30000
});

cityAirportInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem("cityAirportToken");

        if (token) {
            config.headers["X-RapidAPI-Key"] = token;
            config.headers["X-RapidAPI-Host"] = "world-airports-directory.p.rapidapi.com";
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

cityAirportInstance.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        return Promise.reject(error);
    }
);

export function getCityAirport(url, params) {
    return cityAirportInstance.get(url, {
        params: params
    });
}