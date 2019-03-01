<template>
  <div
    class="live2d-wrap"
    ref="live2d"
    @mousedown="handleMouseDown"
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
      default: -1
    },
    isScale: {
      type: Boolean,
      default: true
    },
    isMove: {
      type: Boolean,
      default: true
    },
    defaultScale: {
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
    var self = this;
    this.model = new Live2DVue(canvas, this.modelPath);

    this.model.initL2dCanvas();
    this.model.init(this.isScale, this.maxScale, this.minScale);
    this.handleChangeModel(this.order)
    document.addEventListener("mouseup", function(e) {
      self.handleOut(e);
    })
  },
  methods: {
    getIndex(order) {
      if (this.modelPath[0].order) {
        var index = 0;
        this.modelPath.forEach((m, i) => {
          if (m.order == order) index = i;
        });
        return index;
      } else {
        return order % this.modelPath.length;
      }
    },
    handleMove(e) {
      let live2d = this.$refs.live2d;
      let { downX, downY } = this;
      setTimeout(function() {
        live2d.style.left = e.clientX - downX + "px";
        live2d.style.top = e.clientY - downY + "px";
      }, 30);
    },
    handleOut(e) {
      if (this.isMove && e.button == 2) {
        document.removeEventListener("mousemove", this.handleMove);
      }
    },
    handleMouseDown(e) {
      if (this.isMove && e.button == 2) {
        this.downX = e.offsetX;
        this.downY = e.offsetY;
        document.addEventListener("mousemove", this.handleMove);
      }
    },
    handleChangeModel(order) {
      this.model.changeModel(this.getIndex(order), this.defaultScale);
    }
  },
  watch: {
    order() {
       this.handleChangeModel(this.order)
    }
  }
};
</script>

<style>
.live2d-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 9999;
}
</style>
