<template>
  <div id="cart">
    <div class="content">
      <div class="cart-left">
        <div class="shopcart">
          <div
            class="small"
            :class="{ smallActive: totalCount > 0 }"
            @click="toggleList"
          >
            <span
              :class="{ active: totalCount > 0 }"
              class="icon icon-shopping_cart"
            ></span>
          </div>
          <div class="count" v-if="totalCount">{{ totalCount }}</div>
        </div>

        <div class="price" :class="{ priceActive: totalPrice > 0 }">
          ￥{{ totalPrice }}
        </div>

        <div class="line"></div>
        <div class="deliveryPrice">另需配送费￥{{ deliveryPrice }}元</div>
      </div>
      <div class="cart-right" :class="{ cart_right_active: minPriceClass }">
        {{ minMoney }}
      </div>
    </div>

    <transition name="flod">
      <div class="cart-list" v-show="isShowList">
        <div class="title">
          <span class="cart-text">购物车</span>
          <button class="empty" @click="empty">清空</button>
        </div>

        <div ref="foodContent" class="food-content">
          <ul>
            <li
              class="food-list"
              v-for="(food, index) in selectFood"
              :key="index"
            >
              <span class="name">{{ food.name }}</span>
              <div class="btn">
                <span class="price">
                  <span>￥</span>
                  {{ food.price }}
                </span>
                <MyCircle :food="food"></MyCircle>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="mask" v-show="isShowList"></div>
    </transition>

    <div class="ball-wrap">
      <transition-group
        name="drop"
        v-on:before-enter="beforeEnter"
        v-on:enter="enter"
        v-on:after-enter="afterEnter"
      >
        <div
          class="ball"
          v-for="(ball, index) in balls"
          :key="index"
          v-show="ball.show"
        >
          <div class="inner"></div>
        </div>
      </transition-group>
    </div>
  </div>
</template>
<script>
import BScroll from "better-scroll";
import MyCircle from "../circle/circle";
import bus from "../../bus";

export default {
  props: ["deliveryPrice", "minPrice", "selectFood"],
  components: {
    MyCircle,
  },
  data() {
    return {
      flod: false,
      balls: [
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        },
      ],
      dropBalls: [],
    };
  },
  computed: {
    isShowList() {
      if (this.totalCount == 0) {
        this.flod = false;
        return false;
      }

      if (this.flod) {
        this.$nextTick(() => {
          if (!this.myScroll) {
            /* 如果this.myScroll对象不存在，就创建 */
            var foodContent = this.$refs.foodContent;
            this.myScroll = new BScroll(foodContent, { click: true });
          } else {
            /* 如果存在，刷新这个对象 */
            this.myScroll.refresh();
          }
        });
      }

      return this.flod;
    },
    totalCount() {
      var sum = 0;
      for (var i = 0; i < this.selectFood.length; i++) {
        sum += this.selectFood[i].count;
      }
      return sum;
    },
    totalPrice() {
      var total = 0;
      for (var i = 0; i < this.selectFood.length; i++) {
        total += this.selectFood[i].price * this.selectFood[i].count;
      }
      return total;
    },
    minMoney() {
      if (this.totalPrice == 0) {
        return "￥" + this.minPrice + "元起送";
      } else if (this.totalPrice < this.minPrice) {
        return "还差￥" + (this.minPrice - this.totalPrice) + "元起送";
      } else {
        return "去结算";
      }
    },
    minPriceClass() {
      if (this.totalPrice < this.minPrice) {
        return false;
      } else {
        return true;
      }
    },
  },
  mounted() {
    bus.$on("cart-add", (target) => {
      this.drop(target);
    });
  },
  methods: {
    drop(el) {
      for (var i = 0; i < this.balls.length; i++) {
        var ball = this.balls[i];
        if (!ball.show) {
          ball.show = true;
          ball.el = el;
          this.dropBalls.push(ball);
          // console.log(this.balls)
          return;
        }
      }
    },
    toggleList() {
      if (this.totalCount == 0) {
        return; /* return 后的代码不会再执行 */
      }
      this.flod = !this.flod;
    },
    empty() {
      this.selectFood.forEach((element) => {
        element.count = 0;
      });
    },
    /* transition 的方法 */
    beforeEnter(el) {
      /*el是小球  */
      // methods中不要使用箭头函数，不然找不到this
      var count = this.balls.length;
      while (count--) {
        var ball = this.balls[count];
        if (ball.show) {
          /* getBoundingClientRect() */
          var pos = ball.el.getBoundingClientRect();
          var x = pos.right - 60;
          var y = -(window.innerHeight - pos.top - 30);
          el.style.transform = `translate3d(0,${y}px,0)`;
          var inner = el.querySelector(".inner");
          inner.style.transform = `translate3d(${x}px,0,0)`;
          // return;
        }
      }
    },
    enter(el, done) {
      var rf = el.offsetWidth; // el.offsetWidth去刷新dom，不然过度效果不能实现
      this.$nextTick(() => {
        //更新dom前执行这里面的代码
        el.style.transform = `translate3d(0,0,0)`;
        var inner = el.querySelector(".inner");
        inner.style.transform = `translate3d(0,0,0)`;
      });
      setTimeout(function () {
        done();
      }, 700);
    },
    afterEnter(el) {
      var ball = this.dropBalls.shift(); /* shift() 删除数组中的第一个元素，并且返回删除的数据 */
      if (ball.show) {
        ball.show = false;
        el.style.display = "none";
      }
    },
  },
};
</script>

<style scoped>
#cart {
  position: fixed;
  bottom: 0px;
  width: 100%;
  height: 48px;
  background-color: #141d27;
  z-index: 999;
}
.content {
  display: flex;
  background-color: #141d27;
}
.cart-left {
  display: flex;
  flex: 1 1 auto; /* 1元素可以放大，占剩余空间的比例  1元素可以缩小 auto 自适应 */
}
.shopcart {
  position: relative;
  bottom: 10px;
  width: 56px;
  height: 56px;
  background-color: #141d27;
  border-radius: 50%;
  margin-left: 12px;
  margin-right: 12px;
}
.small {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #2b333b;
  margin: 6px;
  text-align: center; /* 文本对齐方式  水平居中 */
  line-height: 44px; /* 行高  实现的效果是文字垂直居中 */
}
.smallActive {
  background-color: rgb(0, 160, 220);
}
.count {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #f00;
  color: #fff;
  width: 24px;
  font-size: 12px;
  line-height: 16px;
  border-radius: 8px;
  text-align: center;
}

.price {
  font-size: 16px;
  font-weight: 700;
  line-height: 48px;
  color: rgba(255, 255, 255, 0.4);
}
.priceActive {
  color: #fff;
}
.line {
  width: 1px;
  background-color: rgba(255, 255, 255, 0.1);
  height: 24px;
  margin: 12px;
}

.icon-shopping_cart {
  display: inline-block;
  font-size: 24px;
  color: rgba(255, 255, 255, 0.4);
  line-height: 24px;
  vertical-align: middle;
}
.active {
  color: #fff;
}
.deliveryPrice {
  font-size: 12px;
  line-height: 48px;
  color: rgba(255, 255, 255, 0.4);
}

.cart-right {
  flex: 0 0 89px; /* 0 不能放大 0不能缩小 89px宽度 */
  padding: 0 8px;
  font-size: 12px;
  line-height: 48px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.4);
  background-color: #2b333b;
  text-align: center;
}
.cart_right_active {
  background-color: green;
  color: #fff;
}
/* 购物车列表 */
.cart-list {
  position: absolute;
  left: 0;
  bottom: 48px;
  width: 100%;
  max-height: 258px;
  background-color: #fff;
  z-index: -1;
}
.cart-list .title {
  height: 40px;
  line-height: 40px;
  padding: 0 18px;
  background-color: #d3d5d7;
  /* display: flex;
    justify-content: space-between; */
}
.cart-list .food-content {
  max-height: 218px;
  overflow: hidden;
}

.cart-text {
  color: rgb(7, 17, 27);
  font-weight: 200;
  font-size: 14px;
  float: left;
}
.empty {
  float: right;
  border: 0;
  background-color: transparent;
  color: rgb(0, 160, 220);
  font-size: 12px;
  line-height: 40px;
}

/* 购物车列表 */
.food-list {
  height: 48px;
  margin: 0 18px;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
  line-height: 48px;
}
.name {
  float: left;
  font-size: 14px;
  color: rgb(7, 17, 27);
  font-weight: 700;
}
.btn {
  float: right;
  display: flex;
}
.btn .price {
  font-size: 14px;
  color: rgb(240, 20, 20);
  font-weight: 700;
  margin-right: 12px;
}
.btn .price span {
  font-size: 12px;
  font-weight: normal;
}
/* 遮罩 蒙板*/
.mask {
  position: fixed;
  top: 0;
  bottom: 48px;
  left: 0;
  right: 0;
  background-color: rgba(7, 17, 27, 0.6);
  filter: blur(10px); /* 高斯模糊 */
  z-index: -2;
}

.flod-enter-active,
.flod-leave-active {
  bottom: 48px;
  transition: all 0.7s;
}
.flod-enter,
.flod-leave-to {
  bottom: -258px;
}
.fade-enter-active,
.fade-leave-active {
  opacity: 1;
  transition: all 0.7s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* 小球样式 */
.ball {
  position: fixed;
  left: 30px;
  bottom: 18px;
  width: 20px;
  height: 20px;
  /* background-color: rgba(0, 160, 220); */
  border-radius: 50%;
  z-index: 9999;
}
.drop-enter-active {
  transition: all 0.7s cubic-bezier(0.33, -0.28, 0.76, 1.14);
}
.inner {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: rgba(0, 160, 220);
  transition: all 0.7s;
}
</style>