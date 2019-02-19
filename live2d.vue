<template>
  <div id="app">
    <canvas
      id="glcanvas"
      :width="width"
      :height="height"
    ></canvas>
    <div
      id="myconsole"
      style="display:none;color:#BBB;"
    ></div>
  </div>
</template>

<script>
import "./lib/live2d.min.js";
import Live2DVue from "./src/live2d";
export default {
  name: "app",
  props: {
    width: {
      type: Number,
      default: 512
    },
    height: {
      type: Number,
      default: 512
    },
    modelPath: {
      type: Array,
      default: []
    },
    order: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      model: null
    };
  },
  mounted() {
    var canvas = document.getElementById("glcanvas");
    this.model = new Live2DVue(canvas, this.modelPath);

    this.model.initL2dCanvas();

    this.model.init();
  },
  watch: {
    order() {
      var index = this.order % this.modelPath.length;
      this.model.changeModel(index);
    }
  }
};
</script>

<style>
</style>
