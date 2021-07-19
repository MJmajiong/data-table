import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css';
import CustomTag from "./data-table.vue"
import Index from './index.vue'
import { Tag, Form, FormItem, Button, Input, Select, Option, DatePicker, Table, TableColumn} from "element-ui";
import less from 'less'
// import axios from 'axios'
import axios, {get, post, put} from './axios'
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Button)
Vue.use(Tag)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
Vue.use(DatePicker)
Vue.use(Table)
Vue.use(TableColumn)

Vue.use(less)
Vue.prototype.$axios = axios
Vue.prototype.$get = get
Vue.prototype.$post = post
Vue.prototype.$put = put
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

