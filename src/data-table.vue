


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
      <el-table :data="tableData" v-if="columns.length" style="width: 100%">
        <el-table-column
          v-for="item in columns"
          :key="item.key"
          :prop="item.key"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        >
        <!-- 这里要注意，如果想要自定义的jsx，而不是简单的formatter替换文字 -->
        <!-- vNode这个函数式组件，需要在new Vue之前全局注册，如果只是简单的在当前页面注册式无法生效的 -->
          <template  v-slot="{ row, column, $index }">
            <div  v-if="item.render">
              <vNode :vnode="item.render({ row, column, $index })"></vNode>
            </div>
            <div v-else>
              {{item.formatter ? item.formatter(row) : row[column.property]}}
            </div>
          </template>
        </el-table-column>
        <slot name="options">
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                v-for="item in operations"
                :key="item.text"
                @click="item.onClick(scope.row)"
                :type="'text' || item.type"
              >
                {{ item.text }}
              </el-button>
            </template>
          </el-table-column>
        </slot>
      </el-table>
      <div class="paginaton-wrapper" v-if="hasPagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import qs from "qs";
import { cloneDeep } from "lodash";
const DEFAULT_SIZE = 10;
const DEFAULT_PAGE = 1;
export default {
  name: "data-table-for-element",
  props: {
    //搜索栏中的选项
    filters: {
      type: Array,
      default: () => [],
    },
    //
    columns: {
      type: Array,
      default: () => [],
    },
    // 获取列表的地址
    url: {
      type: String,
      default: "",
    },
    //
    operations: {
      type: Array,
      default: () => [],
    },
    hasPagination: {
      type: Boolean,
      default: true,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 50, 100],
    },
  },
  data() {
    return {
      msg: "hello 马炯",
      formValue: {},
      initForm: {},
      tableData: [],
      currentPage: 1,
      total: 0,
      defaultFirstPage: 1,
      page: DEFAULT_PAGE,
      size: DEFAULT_SIZE,
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
    url: {
      handler(val) {
        if (!val) return;
        this.page = this.defaultFirstPage;
        this.$nextTick(this.fetchData);
      },
      immediate: true,
    },
  },
  methods: {
    onSubmit() {
      // console.log(this.formValue);
      this.fetchData();
    },
    onReset() {
      this.formValue = cloneDeep(this.initForm);
    },
    fetchData() {
      const hasParams = this.url.includes("?");
      const urlStr =
        this.url && (hasParams ? this.url.split("?")[0] : this.url);
      const paramsStr = this.url && hasParams && this.url.split("?")[1];
      if (!this.url) {
        console.warn("DataTable: url 为空, 不发送请求");
        return;
      }
      const queryForm = this.formValue || {};
      const params = Object.assign(
        {},
        { page: this.page, size: this.size },
        qs.parse(this.paramsStr),
        queryForm
      );
      this.$get(urlStr, params)
        .then((resp) => {
          this.tableData = resp.payload;
          this.total = resp.total;
        })
        .catch((e) => {
          console.error(e);
        });
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.size = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = val;
      this.fetchData();
    },
  },
};
</script>
<style lang="less">
.form-wrapepr {
  padding: 16px 16px 10px;
}
.form-default {
  border: 1px solid #e8e8e8;
}
.paginaton-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
