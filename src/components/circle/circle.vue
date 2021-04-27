<template>
  <div ref="circleWrapper">
    <transition name="gun">
      <span
        class="icon icon-remove_circle_outline"
        v-if="food.count"
        @click="removeFood"
      ></span>
    </transition>
    <transition name="fade">
      <span class="count" v-if="food.count">{{ food.count }}</span>
    </transition>
    <span class="icon icon-add_circle" @click="addFood"></span>
  </div>
</template>

<script>
import bus from "../../bus";
export default {
  props: ["food"],
  methods: {
    addFood() {
      // 如果是第一次点击 this.food.count数量是不存在的，我们将它的值设置为1
      if (this.food.count == undefined) {
        // 使用$set() 来实现给对象动态的添加属性
        this.$set(this.food, "count", 1);
        // this.food.count = 1;
      } else {
        this.food.count++;
      }
      bus.$emit("cart-add", this.$refs.circleWrapper);
    },
    removeFood(event) {
      this.food.count--;
    },
  },
};
</script>

<style scoped>
.gun-enter-active,
.gun-leave-active {
  transition: all 0.3s;
  transform: translateX(0px) rotate(720deg);
}
.gun-enter,
.gun-leave-to {
  transform: translateX(48px) rotate(360deg);
}
/* .gun-leave-to {
  transform: translateX(24px) rotate(360deg);
} */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
  opacity: 1; /* 透明度  0是全透明 1是不透明*/
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

span {
  display: inline-block;
  vertical-align: middle; /* 垂直居中对齐 */
}
.icon {
  color: rgb(0, 160, 220);
  font-size: 24px;
  line-height: 24px;
}
.count {
  width: 24px;
  color: rgb(147, 153, 159);
  font-size: 10px;
  line-height: 24px;
  text-align: center;
}
</style>
17748682398