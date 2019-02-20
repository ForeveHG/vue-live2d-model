<template>
  <div id="app">
    <button @click="handleChange">切换</button>
    <vue-live2d :modelPath="modelPath" :order="order"></vue-live2d>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      order: 0,
      modelPath: [
        {
          path: "live2d/tororo/tororo.model.json",
        },
        {
          path: "live2d/hijiki/hijiki.model.json",
        }
      ]
    }
  },
  methods: {
    handleChange() {
      this.order += 1
    }
  }
}
</script>

<style>

</style>
