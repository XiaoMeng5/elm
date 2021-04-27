<template>
  <div id="header">
    <!-- common  共同的  通用的 -->
    <div class="header-wrap">
      <!-- 头部的内容 -->
      <div class="header-content">
        <div class="avatar">
          <!-- 商家头像 -->
          <img :src="seller.avatar" />
        </div>
        <div class="brand">
          <div class="title">
            <span class="icon"></span>
            <span class="name">{{ seller.name }}</span>
          </div>
          <div class="description">
            {{ seller.description }}/{{ seller.deliveryTime }}分钟送达
          </div>
          <!-- 判断seller.supports数组是否存在，有值则执行下面代码 ， 为什么要判断，因为seller初始是一个空对象 -->
          <div class="support" v-if="seller.supports">
            <!-- 根据数据中不同的type值显示不同的背景图片 -->
            <span
              class="icon"
              :class="classArr[seller.supports[0].type]"
            ></span>
            <span class="text">{{ seller.supports[0].description }}</span>
          </div>
        </div>
        <!-- 点击显示商家详情 -->
        <div class="btn" v-if="seller.supports" @click="showDetail">
          {{ seller.supports.length }}个<span
            class="icon-keyboard_arrow_right"
          ></span>
        </div>
      </div>
      <!-- bulletin 公告 -->
      <!-- 点击显示商家详情 -->
      <div class="bulletin" @click="showDetail">
        <span class="bulletin-icon"></span>
        <span class="bulletin-text">
          {{ seller.bulletin }}
        </span>
        <span class="icon-keyboard_arrow_right"></span>
        <!-- 做图标  https://icomoon.io  可以将svg图片转换成字体-->
      </div>
      <div class="header-bg">
        <img :src="seller.avatar" />
      </div>
    </div>
    <!----------------------   商家详情信息   ------------------ -->
    <transition name="fade">
      <div class="header-detail" v-if="isShowDetail">
        <div class="detail-title">
          {{ seller.name }}
        </div>
        <div class="stars" style="text-align: center">
          <Star :score="seller.score" size="48"></Star>
        </div>
        <!-- infomation 信息单词的缩写 info -->
        <div class="info">
          <div class="info-title">
            <span class="line"></span>
            <span class="text">优惠信息</span>
            <span class="line"></span>
          </div>
          <ul class="info-list" v-if="seller.supports">
            <li v-for="(item, index) in seller.supports" :key="index">
              <span
                class="icon"
                :class="classArr[seller.supports[index].type]"
              ></span>
              <span class="info-text">
                {{ item.description }}
              </span>
            </li>
          </ul>
        </div>
        <!-- 商家公告 -->
        <div class="detail-bulletin">
          <div class="detail-bulletin-title">
            <span class="line"></span>
            <span class="text">商家公告</span>
            <span class="line"></span>
          </div>
          <p class="bulletin-content">
            {{ seller.bulletin }}
          </p>
        </div>
        <!-- 关闭按钮 -->
        <div class="close" @click="hideDetail">
          <span class="icon-close"></span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// 引入5星评价
import Star from "../star/star";
export default {
  props: ["seller"],
  // 注册组件
  components: {
    Star,
  },
  data() {
    return {
      /* 商家所支持的服务 */
      classArr: ["decrease", "discount", "special", "invoice", "guarantee"],
      isShowDetail: false,
    };
  },
  methods: {
    showDetail() {
      this.isShowDetail = true;
    },
    hideDetail() {
      this.isShowDetail = false;
    },
  },
};
</script>
<style scoped>
/* 过渡效果样式  渐入渐出*/
.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

#header {
  position: relative; /* 相对定位 不影响布局 */
  overflow: hidden; /* 超出部分隐藏 */
  background-color: rgba(7, 17, 27, 0.5);
}
/* 背景图片 */
.header-bg {
  position: absolute; /* 参照header */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -5;
  /* blur 高斯模糊值 */
  filter: blur(10px);
  /* grayscale 灰度 */
  /* filter: grayscale(0.5); */
}
.header-bg img {
  width: 100%;
}
.header-content {
  padding: 24px 12px 18px 24px;
  color: #fff;
  position: relative;
}
/* 商家头像样式 */
.avatar {
  display: inline-block;
  width: 64px;
  height: 64px;
  /* 行内块元素垂直方向的对其方式 top是顶部对其 */
  vertical-align: top;
}
.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 4px;
}
/* 品牌样式 */
.brand {
  display: inline-block;
  vertical-align: top;
  margin-top: 2px;
  margin-left: 16px;
}
.brand .title {
  margin-bottom: 8px;
  font-size: 0; /* 解决的是两个行内块元素之间的间隙问题 */
}
/* span是行内元素，不能设置宽度和高度 */
.title .icon {
  display: inline-block; /* 行内块元素 */
  width: 30px;
  height: 18px;
  background-image: url(images/brand@2x.png);
  background-size: 30px 18px; /* 背景图片大小设置与盒子一样大 */
  margin-right: 6px;
  vertical-align: top;
}
.brand .name {
  font-size: 16px;
  font-weight: bold;
  line-height: 18px;
}
.description {
  font-weight: 200;
  font-size: 12px;
  line-height: 12px;
  margin-bottom: 10px;
}
.support {
  font-size: 0;
}
.support .icon {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 4px;
  /* background-image: url(images/decrease_1@2x.png); */
  background-size: 12px 12px;
  vertical-align: top;
}
/* "decrease","discount","special","invoice","guarantee" */
.decrease {
  background-image: url(images/decrease_1@2x.png);
}
.discount {
  background-image: url(images/discount_1@2x.png);
}
.special {
  background-image: url(images/special_1@2x.png);
}
.invoice {
  background-image: url(images/invoice_1@2x.png);
}
.guarantee {
  background-image: url(images/guarantee_1@2x.png);
}
.support .text {
  font-size: 10px;
  font-weight: 200;
  line-height: 12px;
}
.btn {
  position: absolute;
  right: 12px;
  bottom: 18px;
  padding: 7px 8px;
  border-radius: 13px;
  background-color: rgba(0, 0, 0, 0.2);
  font-size: 10px;
  font-weight: 200;
  line-height: 12px;
  text-align: center;
}
/* bulletin 公告部分样式 */
.bulletin {
  position: relative;
  font-size: 10px;
  line-height: 28px;
  padding: 0 24px 0 12px;
  color: #fff;
  /* 超出部分如何显示 */
  overflow: hidden;
  /* 只能一行显示 nowrap不换行  wrap换行*/
  white-space: nowrap;
  /* 文字超出如何显示 ellipsis 超出部分变成三个点*/
  text-overflow: ellipsis;
  background-color: rgba(7, 17, 27, 0.2);
}
.bulletin-icon {
  /* 是一个span标签 不能设置宽高，不能独立成行*/
  display: inline-block;
  width: 22px;
  height: 12px;
  background-image: url(images/bulletin@2x.png);
  background-size: 22px 12px;
  vertical-align: middle;
  margin-right: 4px;
}
.bulletin .icon-keyboard_arrow_right {
  position: absolute;
  right: 12px;
  top: 4px;
  font-size: 20px;
}

/* ******************* 商家详情信息 *********************** */
/* .header-detail {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 64px 36px 32px;
	color: #fff;
	background-color: rgba(7,17,27,0.5);
} */
.header-detail {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 64px 36px 32px;
  box-sizing: border-box; /* width = border-width*2+padding-width*2+内容的大小 = 页面中显示的大小就是 设置的大小 */
  color: #fff;
  background-color: rgba(7, 17, 27, 0.8);
  z-index: 5;
}
.detail-title {
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  line-height: 16px;
}
.stars {
  margin-top: 16px;
  margin-bottom: 28px;
}
.info-title {
  font-size: 14px;
  font-weight: 700;
}
.line {
  width: 112px;
  display: inline-block;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  vertical-align: middle;
}
.header-detail .text {
  font-weight: 700;
  font-size: 14px;
  line-height: 14px;
  margin: 0 6px;
}
.info-list {
  margin-top: 24px;
}
.info-list li {
  margin-bottom: 12px;
  font-size: 12px;
  line-height: 16px;
}
.info-list .icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 6px;
  background-size: 16px 16px;
  background-repeat: no-repeat;
  vertical-align: bottom;
}
.bulletin-content {
  line-height: 24px;
  font-size: 12px;
  font-weight: 200;
  margin-top: 24px;
}
.close {
  position: absolute;
  bottom: 32px;
  font-size: 32px;
  left: 50%;
  margin-left: -16px;
}
</style>