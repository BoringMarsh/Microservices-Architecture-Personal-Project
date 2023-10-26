import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    //初始转到输入页面
    {
        path: "",
        redirect: "/city-input"
    },
    {
        path: "/",
        redirect: "/city-input"
    },
    //输入页面
    {
        path: "/city-input",
        component: () => import("../views/cityInput.vue"),
        children: [
            //搜索结果页面
            {
                path: "city-search-result/:keyword",
                component: () => import("../views/citySearchResult.vue")
            },
            //详细信息页面
            {
                path: "city-detail/:city",
                component: () => import("../views/cityDetail.vue")
            }
        ]
    }
]

const router = createRouter({ 
    routes,
    history: createWebHistory()
})

export default router