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
      default: 350
    },
    height: {
      type: Number,
      default: 500
    },
    modelPath: {
      type: Array,
      default: []
    },
    order: {
      type: Number,
      default: 0
    },
    isScale: {
      type: Boolean,
      default: true,
    },
    defaultWidth: {
      type: Number,
      default: 2,
    },
    maxScale: {
      type: Number,
      default: 2
    },
    minScale: {
      type: Number,
      default: 0.6
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

    this.model.init(this.isScale, this.maxScale, this.minScale);
  },
  watch: {
    order() {
      var index = this.order % this.modelPath.length;
      this.model.changeModel(index, this.defaultWidth);
    }
  }
};
</script>

<style>
</style>
