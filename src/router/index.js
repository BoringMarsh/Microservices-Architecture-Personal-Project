import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: "",
        redirect: "/city-input"
    },
    {
        path: "/city-input",
        component: () => import("../views/cityInput.vue"),
        children: [
            {
                path: "city-search-result/:keyword",
                component: () => import("../views/citySearchResult.vue")
            },
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