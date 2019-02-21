<template>
  <div
    class="live2d-wrap"
    ref="live2d"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
  >
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
      default: function() {
        return [];
      }
    },
    order: {
      type: Number,
      default: 0
    },
    isScale: {
      type: Boolean,
      default: true
    },
    isMove: {
      type: Boolean,
      default: true
    },
    defaultWidth: {
      type: Number,
      default: 2
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
      model: null,
      downX: 0,
      downY: 0
    };
  },
  mounted() {
    var canvas = document.getElementById("glcanvas");
    this.model = new Live2DVue(canvas, this.modelPath);

    this.model.initL2dCanvas();

    this.model.init(this.isScale, this.maxScale, this.minScale);
  },
  methods: {
    handleMove(e) {
      let live2d = this.$refs.live2d;
      let { downX, downY } = this;
      setTimeout(function() {
        live2d.style.left = e.clientX - downX + "px";
        live2d.style.top = e.clientY - downY + "px";
      }, 30);
    },
    handleMouseDown(e) {
      if (this.isMove && e.button == 2) {
        this.downX = e.offsetX;
        this.downY = e.offsetY;
        document.addEventListener("mousemove", this.handleMove);
      }
    },
    handleMouseUp(e) {
      if (this.isMove && e.button == 2) {
        document.removeEventListener("mousemove", this.handleMove);
      }
    }
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
.live2d-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
}
</style>
