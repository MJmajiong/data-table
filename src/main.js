// import Vue from 'vue'
// import App from './App.vue'

// new Vue({
//   el: '#app',
//   render: h => h(App)
// })
import Vue from 'vue'
import 'element-ui/lib/theme-chalk/tag.css';
import CustomTag from "./data-table.vue"
CustomTag.install = Vue => {
    Vue.CustomTag(CustomTag.name, CustomTag)
  }
  
  // To auto-install when vue is found
  let GlobalVue = null
  if (typeof window !== 'undefined') {
    GlobalVue = window.Vue
  } else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue
  }
  if (GlobalVue) {
    GlobalVue.use(CustomTag)
  }
  
// new Vue({
//     el: "#app",
//     render: h => h(CustomTag)
// })
export default CustomTag

