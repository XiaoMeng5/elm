/*1. 引入vue  vue-router */
import Vue from "vue";
import VueRouter from "vue-router";

/* 引入组件 */
import Goods from "./components/goods/goods";
import Ratings from "./components/ratings/ratings";
import Seller from "./components/seller/seller";

/* 2. 安装插件VueRouter */
Vue.use(VueRouter);

/* 3. 创建路由对象，并且配置路由规则 */
var router = new VueRouter({
  /* 固定的键 routes */
  routes: [
    /* 一条一条的路由规则 */
    {
      path: "/",
      /* 首页路由 */
      redirect: "/goods" /* 重定向 */
    },
    {
      path: "/goods",
      name: "goods",
      component: Goods
    },
    {
      path: "/ratings",
      name: "ratings",
      component: Ratings
    },
    {
      path: "/seller",
      name: "seller",
      component: Seller
    }
  ]
});

/* 4. 暴露接口 */
export default router;
