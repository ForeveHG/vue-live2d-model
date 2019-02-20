import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import VueLive2d from '../index.js'
Vue.use(VueLive2d)

new Vue({
  render: h => h(App),
}).$mount('#app')
