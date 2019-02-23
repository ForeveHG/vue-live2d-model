<!-- 指定order切换 -->
<template>
  <div>
    <button @click="handleChange(1)">live1</button>
    <button @click="handleChange(2)">live2</button>
    <vue-live2d
      :modelPath="modelPath"
      :order="order"
      :scale="true"
      :maxScale="2"
      :minScale="0.5"
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
          order: 1,
          path: "/live2d/tororo/tororo.model.json"
        },
        {
          order: 2,
          path: "/live2d/hijiki/hijiki.model.json"
        }
      ]
    };
  },
  methods: {
    handleChange(order) {
      this.order = order;
    }
  }
};
</script>

<style>
</style>
