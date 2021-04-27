<template>
  <div id="ratings">
    <div class="ratings-btn">
      <span
        class="all"
        :class="{ active: selectType === 'all' }"
        @click="toggleSelectType('all')"
      >
        {{ desc.all }}{{ ratings.length }}
      </span>
      <span
        class="positive"
        :class="{ active: selectType === 'positive' }"
        @click="toggleSelectType('positive')"
      >
        {{ desc.positive }}{{ positive.length }}
      </span>
      <span
        class="nagetive"
        :class="{ active: selectType === 'nagetive' }"
        @click="toggleSelectType('nagetive')"
      >
        {{ desc.nagetive }}{{ nagetive.length }}
      </span>
    </div>
    <div class="switch">
      <span
        class="icon-check_circle"
        :class="{ on: isActive }"
        @click="toggleText"
      ></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
import bus from "../../bus";
export default {
  props: {
    desc: {
      type: Object /* 规定数据类型 */,
      default() {
        /* 数据默认值 */
        return {
          all: "全部",
          positive: "满意",
          nagetive: "不满意",
        };
      },
    },
    ratings: {
      /* 评论 */ type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      selectType: "all",
      isActive: true,
    };
  },
  computed: {
    positive() {
      /* 喜欢的用户评论 */
      var arr = [];
      this.ratings.forEach((value) => {
        if (value.rateType === 0) {
          arr.push(value);
        }
      });
      return arr;
    },
    nagetive() {
      /* 不喜欢的用户评论 */
      var arr = [];
      this.ratings.forEach((value) => {
        if (value.rateType === 1) {
          arr.push(value);
        }
      });
      return arr;
    },
  },
  methods: {
    toggleSelectType(type) {
      this.selectType = type;
      bus.$emit("select-type-event", type);
    },
    toggleText() {
      this.isActive = !this.isActive;
      bus.$emit("toggle-text-event", this.isActive);
    },
  },
};
</script>

<style scoped>
#ratings {
  padding: 18px 18px 12px;
  border-bottom: 1px solid rgba(7, 17, 27, 0.5);
}
.ratings-btn {
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(7, 17, 27, 0.5);
}
.ratings-btn span {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 2px;
  color: rgb(77, 85, 93);
  margin-right: 6px;
}
.ratings-btn .all {
  background-color: rgba(0, 160, 220, 0.2);
}
.ratings-btn .positive {
  background-color: rgba(0, 160, 220, 0.2);
}
.ratings-btn .nagetive {
  background-color: rgba(77, 85, 93, 0.2);
}
.ratings-btn .active {
  background-color: rgba(0, 160, 220, 1);
  color: #fff;
}
.ratings-btn .nagetive.active {
  background-color: rgba(77, 85, 93, 1);
}
.switch {
  font-size: 0;
  color: rgb(147, 153, 159);
  line-height: 24px;
  padding: 12px 0 0;
}
.icon-check_circle {
  font-size: 24px;
  vertical-align: middle;
  margin-right: 4px;
}
.on {
  color: rgba(0, 160, 220, 1);
}
.switch .text {
  font-size: 12px;
  vertical-align: middle;
}
</style>