<template>
  <div>
    <!-- 父组件给子组件传值，给子组件绑定一个属性，在子组件中通过props去接收 -->
    <myHeader :seller="seller"></myHeader>
    <div class="tabs">
      <ul>
        <li><router-link :to="{ name: 'goods' }">商品</router-link></li>
        <li><router-link :to="{ name: 'ratings' }">评价</router-link></li>
        <li><router-link :to="{ name: 'seller' }">商家</router-link></li>
      </ul>
    </div>
    <!-- 留坑 显示路由对应的内容 -->

    <router-view :seller="seller"></router-view>
  </div>
</template>

<script>
// 引入header组件
import myHeader from "./components/header/header";
export default {
  components: {
    myHeader,
  },
  data() {
    return {
      seller: {},
    };
  },
  created() {
    // ajax获取数据  axios

    // var self = this;
    this.$axios({
      method: "get" /* 请求方式是get */,
      url: "/api/seller" /* 请求数据对应的路由 */,
    })
      .then((res) => {
        // console.log(this) 注意this指向问题
        // 请求成功执行的代码
        this.seller = res.data.seller;
      })
      .catch((err) => {
        // 请求失败执行的代码
        console.log(err);
      });
  },
};
</script>

<style>
@import "./common/css/style.css";
* {
  margin: 0;
  padding: 0;
}
ul {
  list-style: none;
}
.tabs {
  height: 40px;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
}
.tabs li {
  display: inline-block;
  width: 33.3333333%;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
a {
  color: rgb(77, 88, 93);
  text-decoration: none; /* 去掉下划线 */
}
.router-link-active {
  color: rgb(240, 20, 20);
}
</style>