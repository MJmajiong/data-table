import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css';
import CustomTag from "./data-table.vue"
import Index from './index.vue'
import { Tag, Form, FormItem, Button, Input, Select, Option, DatePicker} from "element-ui";
import less from 'less'

Vue.use(Form);
Vue.use(FormItem);
Vue.use(Button)
Vue.use(Tag)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
Vue.use(DatePicker)
Vue.use(less)
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
  
new Vue({
    el: "#app",
    render: h => h(Index)
})
export default CustomTag

