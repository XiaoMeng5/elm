<template>
  <div v-show="isShowFood" id="food">
    <div class="food-content">
      <div class="food-header">
        <img :src="food.image" />
        <div class="back" @click="hide">
          <span class="icon-arrow_lift"></span>
        </div>
      </div>
      <div class="info">
        <h3 class="name">{{ food.name }}</h3>
        <div class="extra">
          <span class="sell-count">月售{{ food.sellCount }}份</span>
          <span class="rating">好评率{{ food.rating }}%</span>
        </div>
        <div class="price">
          <span class="new">
            ￥
            <span>{{ food.price }}</span>
          </span>
          <span class="old" v-if="food.oldPrice">￥{{ food.oldPrice }}</span>
        </div>
        <div class="btn-group">
          <div class="circle" v-show="food.count">
            <MyCircle :food="food"></MyCircle>
          </div>
          <div class="btn-add" v-show="!food.count">
            <button @click="showCircle">加入购物车</button>
          </div>
        </div>
      </div>
      <!-- 分割线 -->
      <div class="split"></div>
      <div class="food-info">
        <h3>商品介绍</h3>
        <p v-if="food.info">{{ food.info }}</p>
        <p v-else>暂无商品介绍，期待后续更新···</p>
      </div>
      <!-- 分割线 -->
      <div class="split"></div>
      <!-- 评论 -->
      <div class="ratings">
        <h3>商品评价</h3>
        <RatingSelect :desc="desc" :ratings="food.ratings"></RatingSelect>
        <ul class="ratings-list">
          <li
            v-for="(item, index) in food.ratings"
            :key="index"
            v-show="needShow(item.rateType, item.text)"
          >
            <div class="user">
              <span class="date">
                {{ item.rateTime | formatDate }}
              </span>
              <span class="user-info">
                <span class="username">{{ item.username }}</span>
                <img :src="item.avatar" class="avatar" />
              </span>
            </div>
            <div class="text">
              <span
                :class="{
                  'icon-thumb_down': item.rateType === 1,
                  'icon-thumb_up': item.rateType === 0,
                }"
              ></span>
              {{ item.text }}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import bus from "../../bus";
import MyCircle from "../circle/circle";
import RatingSelect from "../ratingselect/ratingselect";
export default {
  props: ["food"],
  components: { MyCircle, RatingSelect },
  data() {
    return {
      isShowFood: false,
      desc: {
        all: "全部",
        positive: "推荐",
        nagetive: "吐槽",
      },
      selectType: "all",
      isActive: true,
    };
  },
  mounted() {
    bus.$on("select-type-event", (type) => {
      this.selectType = type;
      // console.log(this.selectType);
    });
    bus.$on("toggle-text-event", (bool) => {
      this.isActive = bool;
    });
  },
  methods: {
    needShow(type, text) {
      // 0 - positive 好评// 1 - nagetive 差评
      if (type === 0) {
        type = "positive";
      } else if (type === 1) {
        type = "nagetive";
      }
      if (!text && this.isActive) {
        // 是否显示有文字的内容
        return false;
      }
      // this.selectType  all positive nagetive
      if (this.selectType === "all") {
        return true;
      } else {
        return this.selectType == type;
      }
    },
    show() {
      this.isShowFood = true;
    },
    hide() {
      this.isShowFood = false;
    },
    showCircle() {
      // this.food.count = 1;  实现不了
      // $set(obj, 属性，值)
      this.$set(this.food, "count", 1);
    },
  },
  // 过滤器 对数据进行加工
  filters: {
    formatDate(value) {
      // 将毫秒数转换成 2019-12-13 10:43
      var date = new Date(value);
      var year = date.getFullYear();
      var month = date.getMonth();
      var day = date.getDate();
      var hour = date.getHours();
      var minute = date.getMinutes();
      // 将毫秒数转换成 2019-12-13 10:43
      var str = year + "-" + month + "-" + day + " " + hour + ":" + minute;
      return str;
    },
  },
};
</script>

<style scoped>
#food {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  bottom: 48px;
  background-color: #fff;
  overflow: scroll;
}
.food-header {
  position: relative;
}
.food-header img {
  width: 100%;
}
.back {
  position: absolute;
  left: 10px;
  top: 10px;
  width: 40px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  color: #fff;
  line-height: 40px;
  text-align: center;
  font-size: 24px;
}
.info {
  padding: 18px;
  position: relative;
}
h3 {
  font-size: 14px;
  font-weight: 700;
  color: rgb(7, 17, 27);
  line-height: 14px;
}
.extra {
  font-size: 12px;
  line-height: 12px;
  color: rgb(147, 153, 159);
  margin-top: 8px;
}
.sell-count {
  margin-right: 6px;
}
.price {
  margin-top: 18px;
  font-size: 12px;
  color: rgb(147, 153, 159);
  font-weight: 700;
}
.price .new {
  color: rgb(220, 20, 20);
  margin-right: 6px;
}
.price .new span {
  font-size: 16px;
}
.old {
  text-decoration: line-through; /* 删除线 */
}
.btn-group {
  position: absolute;
  right: 18px;
  bottom: 18px;
}
button {
  border-radius: 12px;
  background-color: rgb(0, 160, 220);
  color: white;
  font-size: 10px;
  border: none;
  padding: 3px 12px;
}
.split {
  height: 16px;
  width: 100%;
  border-top: 1px solid rgba(7, 17, 27, 0.4);
  border-bottom: 1px solid rgba(7, 17, 27, 0.4);
  background-color: #e3e5e7;
}
.food-info {
  padding: 18px;
}
.food-info p {
  margin-top: 6px;
  margin-left: 8px;
  font-size: 12px;
  line-height: 24px;
  color: rgb(77, 85, 93);
  font-weight: 200;
}
.ratings {
  padding: 18px 0;
}
.ratings h3 {
  margin-left: 18px;
}

.ratings-list {
  padding: 0 18px;
}
.ratings-list li {
  padding: 16px 0;
  border-bottom: 1px solid rgba(7, 17, 27, 0.4);
  overflow: hidden;
}
.ratings-list .user {
  overflow: hidden;
}
.ratings-list .date {
  float: left;
  font-size: 10px;
  color: rgb(147, 153, 159);
  line-height: 12px;
}
.ratings-list .user-info {
  float: right;
  font-size: 10px;
  color: rgb(147, 153, 159);
  line-height: 12px;
}
.user-info img {
  width: 12px;
  height: 12px;
  margin-left: 6px;
}
.ratings-list .text {
  margin-top: 6px;
  font-size: 12px;
  line-height: 16px;
  color: rgb(7, 17, 27);
}
.icon-thumb_down {
  color: rgb(147, 153, 159);
  line-height: 24px;
  margin-right: 6px;
}
.icon-thumb_up {
  color: rgb(0, 160, 220);
  line-height: 24px;
  margin-right: 6px;
}
</style>