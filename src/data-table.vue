<template>
  <div class="data-table">
    <div class="form-wrapepr">
      <slot name="form-default">
        <el-form
          ref="filterForm"
          :inline="true"
          :model="formValue"
          class="demo-form-inline"
        >
          <el-form-item
            v-for="item in filters"
            :key="item.key"
            :label="item.label"
          >
            <el-input
              v-if="item.type === 'input'"
              v-model="formValue[item.key]"
              :placeholder="item.placeholder"
            ></el-input>
            <el-select
              v-if="item.type === 'select'"
              v-model="formValue[item.key]"
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
              v-model="formValue[item.key]"
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
      </slot>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column
          v-for="item in columns"
          :key="item.key"
          :prop="item.key"
          :label="item.label"
          :width="item.width"
        >
        </el-table-column>
        <slot name="optio÷ns">
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <!-- <el-button
                v-for="item in operations"
                :key="item.text"
                @click="item.onClick(scope.row)"
                :type="'text' || item.type"
              >
              </el-button> -->
            </template>
          </el-table-column>
        </slot>
      </el-table>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from "lodash";
export default {
  name: "data-table-for-element",
  props: {
    filters: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    url: {
      type: String,
      default: "",
    },
    operations: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      msg: "hello 马炯",
      formValue: {},
      initForm: {},
      tableData: [],
    };
  },
  created() {
    this.filters.forEach((item) => {
      if (item.defaultValue) {
        this.formValue[item.key] = item.defaultValue;
      }
    });
  },
  mounted() {
    this.initForm = cloneDeep(this.formValue);
    this.fetchData();
  },
  components: {},
  watch: {
    url: (newVal, oldVal) => {
      this.fetchData();
    },
  },
  methods: {
    onSubmit() {
      console.log(this.formValue);
    },
    onReset() {
      this.formValue = cloneDeep(this.initForm);
    },
    fetchData() {
      console.log(this.url, "url");
      this.$get(this.url)
        .then((resp) => {
          this.tableData = resp;
        })
        .catch((e) => {
          console.error(e);
        });
    },
  },
};
</script>
<style lang="less">
.form-wrapepr {
  padding: 16px 16px 10px;
  border: 1px solid #e8e8e8;
}
</style>
