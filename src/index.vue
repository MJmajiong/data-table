<template>
  <div>
    <dataTable
      ref="dataTable"
      :filters="filters"
      :url="url"
      :columns="columns"
      :operations="operations"
    >
      <!-- <template v-slot:form-default>
            niha
        </template> -->
    </dataTable>
    <test></test>
  </div>
</template>

<script>
import dataTable from "./data-table.vue";
import test from "./test";
export default {
  components: {
    dataTable,
    test
  },
  data() {
    return {
      filters: [
        {
          key: "name",
          type: "input",
          label: "名字",
        },
        {
          key: "status",
          type: "select",
          label: "状态",
          options: [
            {
              label: "禁用",
              value: 0,
            },
            {
              label: "启用",
              value: 1,
            },
          ],
        },
        {
          key: "time",
          type: "datetimerange",
          label: "时间范围",
          // defaultValue:  [new ßDate(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)]
        },
      ],
      columns: [
        {
          key: "name",
          label: "姓名",
        //   aa: "33",
        formatter:() => {
            return '张三'
        }
        },
        {
          key: "status",
          label: "状态",
          render: function () {
            return (
                <div style="color:red">
                    nihao
                </div>
            )
          },
          //              formatter: row => (
          //     <a href={row.html_url} target="_blank">{row.html_url}</a>
          //   )
        },
        {
          key: "age",
          label: "年龄",
        },
      ],
      operations: [
        {
          text: "删除",
          onClick: (row) => {},
        },
        {
          text: "编辑",
          onClick: (row) => {
            this.$put(
              `/api/list/${row.id}`,
              Object.assign({}, row, { age: 33 })
            ).then((resp) => {
              this.$refs.dataTable.fetchData();
            });
          },
        },
      ],
      url: "/api/list?page=1&size=20",
    };
  },
};
</script>

<style lang="less">
</style>