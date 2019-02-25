<!-- 顺序切换 -->
<template>
  <div>
    <button @click="handleChange">顺序切换</button>
    <vue-live2d
      :modelPath="modelPath"
      :order="order"
      :scale="true"
      :maxScale="2"
      :minScale="0.5"
      :defaultScale="1.5"
    ></vue-live2d>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      order: 0,
      modelPath: [
        {
          path: "/live2d/tororo/tororo.model.json"
        },
        {
          path: "/live2d/hijiki/hijiki.model.json"
        }
      ]
    };
  },
  methods: {
    handleChange() {
      this.order += 1;
    },
  }
};
</script>

<style>
</style>
