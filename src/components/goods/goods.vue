<template>
  <div id="goods">
    <div class="menu" ref="menuWrap">
      <ul>
        <li
          class="menu-item"
          v-for="(item, index) in goods"
          :key="index"
          :class="{ current: currentIndex === index }"
          @click="selectMenu(index)"
        >
          <span class="text">
            <span
              class="icon"
              v-if="item.type >= 0"
              :class="classArr[item.type]"
            ></span>
            {{ item.name }}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods" ref="foodsWrap">
      <ul>
        <!-- 遍历出商品分类 -->
        <li
          class="food-item food-item-hook"
          v-for="(item, index) in goods"
          :key="index"
        >
          <!-- 没类商品的名称 -->
          <h3 class="title">{{ item.name }}</h3>
          <ul>
            <!-- 遍历出每类商品中的所有商品  -->
            <li v-for="(food, i) in item.foods" :key="i">
              <!-- food代指每一道菜 -->
              <div class="icon" @click="showFoodDetaile(food)">
                <img :src="food.icon" width="57px" height="57px" />
              </div>
              <div class="content">
                <!-- 商品名称 -->
                <div class="name">{{ food.name }}</div>
                <!-- 商品介绍 -->
                <div class="desc">{{ food.description }}</div>
                <!-- 好评率及月销量 -->
                <div class="sell-rating">
                  <span class="sell-count">月售{{ food.sellCount }}份</span>
                  <span class="rating">好评率{{ food.rating }}%</span>
                </div>
                <!-- 价格 -->
                <div class="price">
                  <span class="now">
                    <span class="icon-price">￥</span>
                    <span class="text">{{ food.price }}</span>
                  </span>
                  <span class="old" v-if="food.oldPrice"
                    >￥{{ food.oldPrice }}</span
                  >
                </div>
              </div>
              <div class="circle">
                <MyCircle :food="food"></MyCircle>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <ShoppingCart
      :deliveryPrice="seller.deliveryPrice"
      :minPrice="seller.minPrice"
      :selectFood="selectFood"
      ref="shopCart"
    />

    <!-- 商品详情 -->
    <Food :food="foodDetaile" ref="foodDetaile"></Food>
  </div>
</template>
<script>
/* 引入 better-scroll 库 实现更加适用的滚动效果 */
import BetterScroll from "better-scroll";
import MyCircle from "../circle/circle";
import ShoppingCart from "../shoppingCart/shoppingCart";
import Food from "../food/food";
/* 通过vue获取dom 
	在标签中适用ref属性：  ref="name"
	在vue中通过  Vue.$refs.name 获取到对应的dom对象*/
export default {
  props: ["seller"],
  components: {
    MyCircle,
    ShoppingCart,
    Food,
  },
  data() {
    return {
      goods: [],
      classArr: ["decrease", "discount", "special", "invoice", "guarantee"],
      // 每个li标签距顶部的距离
      heightList: [],
      // 滚动高度
      scrollY: 0,
      foodDetaile: {} /* 某件商品的详细信息 */,
    };
  },
  /* 使用ajax获取数据 */
  created() {
    // 生命周期的第二个周期  创建完成 只针对数据
    this.$axios({
      method: "get" /* 通过get方式发送请求 */,
      url: "/api/goods",
    }).then((res) => {
      // console.log(res);
      this.goods = res.data.goods;
      /* 数据修改之后， 调用$nextTick方法，更新dom */
      this.$nextTick(() => {
        // 获取到dom对象
        var foodsWrap = this.$refs.foodsWrap;
        var menuWrap = this.$refs.menuWrap;

        // 实例化betterScroll对象，并传入对应的dom
        this.goodsScroll = new BetterScroll(foodsWrap, {
          // 没有 probeType 这个属性，不会派发滚动事件
          // probeType值为3的时候实时派发滚动事件
          probeType: 3,
          // 默认点击事件被禁止，设置click：true时，派发点击事件
          click: true,
        });
        this.menuScroll = new BetterScroll(menuWrap, {
          click: true,
        });

        // 函数调用
        this._calcHeight();

        // 滚动事件 scroll
        // bs.on("scroll",function(p){ p指代实时滚动的位置})
        this.goodsScroll.on("scroll", (pos) => {
          // console.log(pos.y)
          // 绝对值  Math.abs()
          // 四舍五入 Math.round()
          this.scrollY = Math.round(Math.abs(pos.y));
          // console.log(this.scrollY)
        });
      });
    });
  },
  // 计算属性 ： 对象
  computed: {
    // 属性： 函数（函数要有返回值）
    currentIndex() {
      // 获取到相邻的高度 去heightList数组中获取
      for (var i = 0; i < this.heightList.length; i++) {
        var h1 = this.heightList[i];
        var h2 = this.heightList[i + 1];

        if (this.scrollY >= h1 && this.scrollY < h2) {
          return i;
        }
      }
      return 0;
    },
    selectFood() {
      // arr代表选中的商品
      var arr = [];
      for (var i = 0; i < this.goods.length; i++) {
        for (var j = 0; j < this.goods[i].foods.length; j++) {
          // 判断商品数量是否大于0
          if (this.goods[i].foods[j].count > 0) {
            arr.push(this.goods[i].foods[j]);
          }
        }
      }
      return arr;
    },
  },
  methods: {
    showFoodDetaile(food) {
      this.foodDetaile = food;
      // 显示food组件
      this.$refs.foodDetaile.show();
    },
    /* 计算高度  calc计算器的前四个字母*/
    _calcHeight() {
      // 获取商品中所有的 li 标签
      var foodsList = this.$el.querySelectorAll(".food-item-hook");
      // 初始化累加的高度
      var height = 0;
      // 数组中第一个元素是0 ，直接加到数组中
      this.heightList.push(height);
      for (var i = 0; i < foodsList.length; i++) {
        // 获取每个元素的高度
        var h = foodsList[i].clientHeight;
        // 累加的结果就是 每个li标签距顶部的距离
        height += h;
        // 将累加的结果放入数组中，
        this.heightList.push(height);
      }
    },
    selectMenu(i) {
      var foodList = this.$el.querySelectorAll(".food-item-hook");
      this.goodsScroll.scrollToElement(foodList[i], 300);
    },
  },
};
</script>

<style scoped>
#goods {
  position: fixed;
  left: 0;
  right: 0;
  top: 175px;
  bottom: 48px;
  overflow: hidden;
  display: flex; /* 设为弹性盒子 */
}

/************  菜单栏的样式开始  **************/
.menu {
  flex: 0 0 80px; /* 不能放大0 不能缩小0 宽度为80px */
  /* width: 56px; */
  height: 100%;
  background-color: #e3e5e7;
  /* overflow: scroll; */
}
.menu-item {
  height: 54px;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
  line-height: 54px;
  font-size: 0;
  padding: 0 12px;
  /* display: table; */
}
/* current  当下的，现代的 */
/* active  活动的  激活的  */
.current {
  background-color: #fff;
}
.menu-item .icon {
  /* 因为span标签是行内元素，不能直接设置宽高，需要做元素转换，转换为行内块元素，之后可以设置宽高 */
  display: inline-block;
  width: 12px;
  height: 12px;
  /* background-color: #f00; */
  background-size: 12px 12px;
  background-repeat: no-repeat;
}
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
.menu-item .text {
  font-size: 12px;
  display: inline-block;
  /* display: table-cell; */
  line-height: 14px;
  vertical-align: middle;
}
/************  菜单栏的样式结束  **************/
.foods {
  flex-grow: 1;
  flex-shrink: 1;
  height: 100%;
  /* background-color: red; */
  /* overflow: scroll; */
}
.title {
  height: 26px;
  border-left: 2px solid #c9cdc1;
  padding-left: 12px;
  background-color: #e3e5e7;
  font-size: 12px;
  line-height: 26px;
  color: rgb(147, 153, 159);
}

.food-item li {
  position: relative;
  display: flex;
  margin: 0 18px;
  padding: 18px 0;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
}
.food-item li:last-child {
  border: 0;
}
.food-item .icon {
  margin-right: 12px;
}
.content .name {
  font-size: 14px;
  color: rgb(7, 17, 27);
  line-height: 14px;
  font-weight: normal;
}
.content .desc,
.content .sell-rating {
  font-size: 10px;
  color: rgb(147, 153, 159);
  line-height: 12px;
  margin: 8px 0;
}
.sell-count {
  margin-right: 12px;
}
.price {
  line-height: 24px;
}
.now {
  color: rgb(240, 20, 20);
  margin-right: 8px;
}
.icon-price {
  font-size: 10px;
  font-weight: 700;
}
.now .text {
  font-size: 14px;
}
.old {
  font-size: 10px;
  color: rgb(147, 153, 159);
  text-decoration: line-through; /* 删除线 */
  /* text-decoration: underline; */ /* 下划线 */
}

.circle {
  position: absolute;
  right: 0;
  bottom: 18px;
}
</style>