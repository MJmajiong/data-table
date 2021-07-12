<template>
  <div class="data-table">
    <div class="form-wrapepr">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item v-for="item in filters" :key="item.key" :label="item.label">
        <el-input
          v-if="item.type === 'input'"
          v-model="formInline[item.key]"
          :placeholder="item.placeholder"
        ></el-input>
        <el-select
          v-if="item.type === 'select'"
          v-model="formInline[item.key]"
          :placeholder="item.placeholder"
        >
          <el-option
            v-for="it in item.options"
            :key="it.value"
            :label="it.label"
            :value="it.value"
          ></el-option>
        </el-select>
        <el-date-picker
          v-if="item.type === 'datetimerange'"
          v-model="formInline[item.key]"
          type="datetimerange"
          :range-separator="item.middleWord || '至'"
          :start-placeholder="item.startText || '开始日期'"
          :end-placeholder="item.endText || '结束日期'"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="primary" @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    </div>
    
  </div>
</template>

<script>
export default {
  name: "data-table-for-element",
  props: {
    filters: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      msg: "hello 马炯",
      formInline: {},
    };
  },
  created() {
    this.filters.forEach(item => {
      if(item.defaultValue){
        this.formInline[item.key] = item.defaultValue
      }
    })
  },
  components: {},
  watch: {},
  methods: {
    onSubmit() {
      console.log(this.formInline);
    },
    onReset() {},
  },
};
</script>
<style lang="less">
.form-wrapepr{
  padding: 16px 16px 0;
  border: 1px solid #452;
}
</style>
