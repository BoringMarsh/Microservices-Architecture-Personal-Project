import axios from 'axios';

const cityAirInstance = axios.create({
    //各接口：
    //  空气质量实况：/aqi
    //  空气质量实时排行：/kqph
    //  空气质量昨日排行：/airranking
    //  过去24小时空气质量：/pastaqi
    //  逐小时空气质量预报：/airhourly
    //  逐日空气质量预报：/airforecast
    baseURL: "https://eolink.o.apispace.com/34324/air/v001",
    timeout: 30000
});

cityAirInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem("cityAirToken");

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

cityAirInstance.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        return Promise.reject(error);
    }
);

export function getCityAir(url, params) {
    return cityAirInstance.get(url, {
        params: params
    });
}