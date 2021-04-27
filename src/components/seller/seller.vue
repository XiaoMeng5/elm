<template>
  <div>我是seller页面</div>
</template>

<script>
export default {
  props: ["seller"],
  mounted() {
    console.log(this.seller);
  },
};
</script>