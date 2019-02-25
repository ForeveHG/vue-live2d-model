import LAppLive2DManager from './LAppLive2DManager'
import LAppDefine from './LAppDefine'
import Framework from '../lib/Live2DFramework.js'
import MatrixStack from './utils/MatrixStack.js'
const {
    L2DMatrix44,
    L2DTargetPoint,
    L2DViewMatrix,
} = Framework
class Live2DVue {
    constructor(canvas, liveModel) {
        this.canvas = canvas;
        // this.changeBtn = changeBtn;
        this.liveModel = liveModel;
        this.platform = window.navigator.platform.toLowerCase();
        this.live2DMgr = new LAppLive2DManager(this);

        this.isDrawStart = false;

        this.gl = null;

        this.dragMgr = null; /*new L2DTargetPoint();*/
        this.viewMatrix = null; /*new L2DViewMatrix();*/
        this.projMatrix = null; /*new L2DMatrix44()*/
        this.deviceToScreen = null; /*new L2DMatrix44();*/

        this.drag = false;
        this.oldLen = 0;

        this.lastMouseX = 0;
        this.lastMouseY = 0;

        this.isModelShown = false;

        this.getWebGLContext = function () {
            var NAMES = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];

            for (var i = 0; i < NAMES.length; i++) {
                try {
                    var ctx = this.canvas.getContext(NAMES[i], {
                        premultipliedAlpha: true
                    });
                    if (ctx) return ctx;
                } catch (e) {}
            }
            return null;
        };
    }

    initL2dCanvas() {
        var that = this;
        var canvas = this.canvas
        if (canvas.addEventListener) {
            canvas.addEventListener("mousewheel", this.mouseEvent.bind(this), false);
            canvas.addEventListener("click", this.mouseEvent.bind(this), false);
            canvas.addEventListener("mousedown", this.mouseEvent.bind(this), false);
            canvas.addEventListener("mousemove", this.mouseEvent.bind(this), false);
            canvas.addEventListener("mouseup", this.mouseEvent.bind(this), false);
            canvas.addEventListener("mouseout", this.mouseEvent.bind(this), false);
            canvas.addEventListener("contextmenu", this.mouseEvent.bind(this), false);
            canvas.addEventListener("touchstart", this.touchEvent.bind(this), false);
            canvas.addEventListener("touchend", this.touchEvent.bind(this), false);
            canvas.addEventListener("touchmove", this.touchEvent.bind(this), false);
        }
    }

    init(isScale, VIEW_MAX_SCALE, VIEW_MIN_SCALE, index) {
        var width = this.canvas.width;
        var height = this.canvas.height;

        this.isScale = isScale;

        this.dragMgr = new L2DTargetPoint();

        var ratio = height / width;
        var left = LAppDefine.VIEW_LOGICAL_LEFT;
        var right = LAppDefine.VIEW_LOGICAL_RIGHT;
        var bottom = -ratio;
        var top = ratio;

        this.viewMatrix = new L2DViewMatrix();

        this.viewMatrix.setScreenRect(left, right, bottom, top);

        this.viewMatrix.setMaxScreenRect(LAppDefine.VIEW_LOGICAL_MAX_LEFT,
            LAppDefine.VIEW_LOGICAL_MAX_RIGHT,
            LAppDefine.VIEW_LOGICAL_MAX_BOTTOM,
            LAppDefine.VIEW_LOGICAL_MAX_TOP);

        this.viewMatrix.setMaxScale(VIEW_MAX_SCALE);
        this.viewMatrix.setMinScale(VIEW_MIN_SCALE);

        this.projMatrix = new L2DMatrix44();
        this.projMatrix.multScale(1, (width / height));


        this.deviceToScreen = new L2DMatrix44();
        this.deviceToScreen.multTranslate(-width / 2.0, -height / 2.0);
        this.deviceToScreen.multScale(2 / width, -2 / width);

        this.gl = this.getWebGLContext();
        if (!this.gl) {
            this.l2dError("Failed to create WebGL context.");
            return;
        }

        Live2D.setGL(this.gl);

        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);

        this.changeModel(index);

        this.startDraw();
    }

    startDraw() {
        var that = this;
        if (!this.isDrawStart) {
            this.isDrawStart = true;
            (function tick() {
                that.draw();
                var requestAnimationFrame =
                    window.requestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.msRequestAnimationFrame;
                requestAnimationFrame(tick, that.canvas);
            })();
        }
    }

    draw() {
        // l2dLog("--> draw()");

        MatrixStack.reset();
        MatrixStack.loadIdentity();

        this.dragMgr.update();
        this.live2DMgr.setDrag(this.dragMgr.getX(), this.dragMgr.getY());


        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        MatrixStack.multMatrix(this.projMatrix.getArray());
        MatrixStack.multMatrix(this.viewMatrix.getArray());
        MatrixStack.push();

        for (var i = 0; i < this.live2DMgr.numModels(); i++) {
            var model = this.live2DMgr.getModel(i);

            if (model == null) return;

            if (model.initialized && !model.updating) {
                model.update();
                model.draw(this.gl);

                if (!this.isModelShown && i == this.live2DMgr.numModels() - 1) {
                    this.isModelShown = !this.isModelShown;
                }
            }
        }

        MatrixStack.pop();
    }

    changeModel(order, defaultScale) {
        if (typeof order === 'number' && order > -1) {
            var index = order || 0
            this.isModelShown = false;
            this.live2DMgr.reloadFlg = true;
            this.live2DMgr.count++;
            this.live2DMgr.changeModel(this.gl, index, defaultScale);
        }
    }

    modelScaling(scale) {
        var isMaxScale = this.viewMatrix.isMaxScale();
        var isMinScale = this.viewMatrix.isMinScale();

        this.viewMatrix.adjustScale(0, 0, scale);


        if (!isMaxScale) {
            if (this.viewMatrix.isMaxScale()) {
                this.live2DMgr.maxScaleEvent();
            }
        }

        if (!isMinScale) {
            if (this.viewMatrix.isMinScale()) {
                this.live2DMgr.minScaleEvent();
            }
        }
    }

    modelTurnHead(event) {
        this.drag = true;

        var rect = event.target.getBoundingClientRect();

        var sx = this.transformScreenX(event.clientX - rect.left);
        var sy = this.transformScreenY(event.clientY - rect.top);
        var vx = this.transformViewX(event.clientX - rect.left);
        var vy = this.transformViewY(event.clientY - rect.top);

        if (LAppDefine.DEBUG_MOUSE_LOG)
            this.l2dLog("onMouseDown device( x:" + event.clientX + " y:" + event.clientY + " ) view( x:" + vx + " y:" + vy + ")");

        this.lastMouseX = sx;
        this.lastMouseY = sy;

        this.dragMgr.setPoint(vx, vy);


        this.live2DMgr.tapEvent(vx, vy);
    }

    followPointer(event) {
        var rect = event.target.getBoundingClientRect();

        var sx = this.transformScreenX(event.clientX - rect.left);
        var sy = this.transformScreenY(event.clientY - rect.top);
        var vx = this.transformViewX(event.clientX - rect.left);
        var vy = this.transformViewY(event.clientY - rect.top);

        if (LAppDefine.DEBUG_MOUSE_LOG)
            this.l2dLog("onMouseMove device( x:" + event.clientX + " y:" + event.clientY + " ) view( x:" + vx + " y:" + vy + ")");

        if (this.drag) {
            this.lastMouseX = sx;
            this.lastMouseY = sy;

            this.dragMgr.setPoint(vx, vy);
        }
    }

    lookFront() {
        if (this.drag) {
            this.drag = false;
        }

        this.dragMgr.setPoint(0, 0);
    }

    mouseEvent(e) {
        e.preventDefault();

        if (e.type == "mousewheel") {
            // if (e.clientX < 0 || this.canvas.clientWidth < e.clientX ||
            //     e.clientY < 0 || this.canvas.clientHeight < e.clientY) {
            //     return;
            // }

            if (e.wheelDelta > 0) this.modelScaling(1.1);
            else this.modelScaling(0.9);


        } else if (e.type == "mousedown") {


            if ("button" in e && e.button != 0) return;

            this.modelTurnHead(e);

        } else if (e.type == "mousemove") {
            this.followPointer(e);

        } else if (e.type == "mouseup") {


            if ("button" in e && e.button != 0) return;

            this.lookFront();

        } else if (e.type == "mouseout") {

            this.lookFront();

        } else if (e.type == "contextmenu") {

            // this.changeModel();
        }
    }

    touchEvent(e) {
        e.preventDefault();

        var touch = e.touches[0];

        if (e.type == "touchstart") {
            if (e.touches.length == 1) this.modelTurnHead(touch);
            // onClick(touch);

        } else if (e.type == "touchmove") {
            this.followPointer(touch);

            if (e.touches.length == 2) {
                var touch1 = e.touches[0];
                var touch2 = e.touches[1];

                var len = Math.pow(touch1.pageX - touch2.pageX, 2) + Math.pow(touch1.pageY - touch2.pageY, 2);
                if (this.oldLen - len < 0) this.modelScaling(1.025);
                else this.modelScaling(0.975);

                this.oldLen = len;
            }

        } else if (e.type == "touchend") {
            this.lookFront();
        }
    }

    transformViewX(deviceX) {
        var screenX = this.deviceToScreen.transformX(deviceX);
        return this.viewMatrix.invertTransformX(screenX);
    }


    transformViewY(deviceY) {
        var screenY = this.deviceToScreen.transformY(deviceY);
        return this.viewMatrix.invertTransformY(screenY);
    }


    transformScreenX(deviceX) {
        return this.deviceToScreen.transformX(deviceX);
    }


    transformScreenY(deviceY) {
        return this.deviceToScreen.transformY(deviceY);
    }

    l2dLog(msg) {
        if (!LAppDefine.DEBUG_LOG) return;

        var myconsole = document.getElementById("myconsole");
        myconsole.innerHTML = myconsole.innerHTML + "<br>" + msg;

        console.log(msg);
    }



    l2dError(msg) {
        if (!LAppDefine.DEBUG_LOG) return;

        this.l2dLog("<span style='color:red'>" + msg + "</span>");

        console.error(msg);
    };
}

export default Live2DVue;