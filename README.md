# vue-live2d-model

## 使用
```
npm install vue-live2d-model
```

```javascript
import VueLive2d from 'vue-live2d-model' 
Vue.use(VueLive2d)
```

```html
<template>
    <vue-live2d :modelPath="modelPath"></vue-live2d>
</template>
<script>
export default {
  name: 'app',
  data() {
    return {
      modelPath: [
        {
          order: 1,
          path: "/live2d/tororo/tororo.model.json",
        }
      ]
    }
  }
}
</script>
```

注意：modelPath中的path值指的是live2d模型文件中的xxxx.mode.json，live2d模型文件如果放在放在服务器上，path值就是```http://域名/live2d/tororo/tororo.model.json```，vue-cli3.0构建的项目也可以放在public目录下，public目录下的文件打包时直接复制到根目录，不经过webpack，可以通过绝对路径引用，path的值就可以写
```/live2d/tororo/tororo.model.json```，记得加'/',可以参考example.

### 参数

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| :------: | :------: | :------: | :------: | :------: |
| width | 所占宽度 | Number | - | 350 |
| height | 所占高度 | Number | - | 500 |
| modelPath | 模型路径数组 | Array | - | [] |
| order | 当前显示模型的order,对应modelPath中某一项order值，如果order不存在，对应modelPath的下标值 | Number | - | 0 | 
| isScale | 是否可以用鼠标滚轮缩放 | Boolean | true/false | true | 
| isMove | 点击鼠标右键移动模型 | Boolean | true/false | true |
| maxScale | 最大缩放值 | Float | - | 2 |  
| minScale | 最小缩放值 | Float | - | 0.6 |
| defaultScale | 初始时的宽度比 | Float | - | 2 | 

### live2d模型
[这个库](https://github.com/xiazeyu/live2d-widget-models)里有一些可以用的模型