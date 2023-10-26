import axios from 'axios';

const cityWeatherInstance = axios.create({
    //各接口：
    //  天气实况：/now
    //  逐小时预报：/hour
    //  逐3小时预报：/3hours
    //  15天预报：/day
    baseURL: "https://eolink.o.apispace.com/456456/weather/v001",
    timeout: 30000
});

cityWeatherInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem("cityWeatherToken");

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

cityWeatherInstance.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        return Promise.reject(error);
    }
);

export function getCityWeather(url, params) {
    return cityWeatherInstance.get(url, {
        params: params
    });
}