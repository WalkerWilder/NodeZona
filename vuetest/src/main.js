import Vue from 'vue'
import App from './App.vue'
import VDragged from 'v-dragged'

Vue.config.productionTip = false
Vue.use(VDragged)

new Vue({
  render: h => h(App),
}).$mount('#app')