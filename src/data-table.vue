<template>
  <div class="Tag">
    {{ msg }}
    <Tag type="success">标签二</Tag>
    <div>shezhi</div>
  </div>
</template>

<script>
import { Tag } from 'element-ui';

// Vue.component(Tag.name, Tag)
export default {
 name: 'data-table-for-element',
  data() {
    return {
        msg: "hello 马炯",
    }
  },
  created() {
  },
  components: {
    Tag
  },
  watch: {},  
  methods: {
  }
}
</script>
<style scoped>

</style>
