<template>
  <div class="star" :class="starSize">
    <span
      class="item-star"
      v-for="(classStar, index) in classMap"
      :key="index"
      v-bind:class="classStar"
    ></span>
  </div>
</template>

<script>
// 定义常量， 常量不可更改
const Star_on = "on";
const Star_half = "half";
const Star_off = "off";
export default {
  props: ["score", "size"],
  /* 计算属性 */
  computed: {
    // 类名最终是 star_48  star_36 star_24
    starSize() {
      return "star_" + this.size;
    },
    // computed 里面的函数 必须要有返回值；
    classMap: function () {
      // 数组盛放星星的类名 一共放5个类名
      // 大于 .5 分显示半颗星 3.6分 3分整星 1个半星 1个灰星
      // 小于 .5 显示灰色星星 3.4分 3分整星 2个灰星
      var result = [];
      // 取到分数的整数部分；
      var starInt = parseInt(this.score); // 4
      // 取到分数的小数部分，做判断
      // 对分数乘以10再求余，余数和5比较
      var starHalf = (this.score * 10) % 10;
      // 添加完整的星星
      for (var i = 0; i < starInt; i++) {
        result.push(Star_on);
      }
      // 添加一半星星
      if (starHalf >= 5) {
        result.push(Star_half);
      }
      // 添加灰色星星
      for (var j = result.length; j < 5; j++) {
        result.push(Star_off);
      }
      return result;
    },
  },
};
</script>

<style scoped>
.star_48 .item-star {
  display: inline-block;
  width: 24px;
  height: 24px;
  margin: 0 12px;
  background-size: 24px 24px;
  background-repeat: no-repeat; /* 设置背景是否平铺 */
}
.star_48 .on {
  background-image: url(images/star48_on@2x.png);
}
.star_48 .half {
  background-image: url(images/star48_half@2x.png);
}
.star_48 .off {
  background-image: url(images/star48_off@2x.png);
}

.star_36 .item-star {
  display: inline-block;
  width: 18px;
  height: 18px;
  margin: 0 6px;
  background-size: 18px 18px;
  background-repeat: no-repeat; /* 设置背景是否平铺 */
}
.star_36 .on {
  background-image: url(images/star36_on@2x.png);
}
.star_36 .half {
  background-image: url(images/star36_half@2x.png);
}
.star_36 .off {
  background-image: url(images/star36_off@2x.png);
}
.star_24 .item-star {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin: 0 3px;
  background-size: 12px 12px;
  background-repeat: no-repeat; /* 设置背景是否平铺 */
}
.star_24 .on {
  background-image: url(images/star24_on@2x.png);
}
.star_24 .half {
  background-image: url(images/star24_half@2x.png);
}
.star_24 .off {
  background-image: url(images/star24_off@2x.png);
}
</style>