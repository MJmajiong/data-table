<template>
    <dataTable :filters="filters" :url="url" :columns="columns" :operations="operations">
        <!-- <template v-slot:form-default>
            niha
        </template> -->
    </dataTable>
</template>

<script>
import dataTable from './data-table.vue'
export default {
    components:{
        dataTable
    },
    data(){
        return {
            filters:[
                {
                    key: 'name',
                    type: 'input',
                    label: '名字'
                },
                {
                    key: 'status',
                    type: 'select',
                    label: '状态',
                    options: [
                        {
                            label:'禁用',
                            value:'stop'
                        },
                        {
                            label:'启用',
                            value:'start'
                        }
                    ]
                },
                {
                    key: 'time',
                    type: 'datetimerange',
                    label: '时间范围',
                    // defaultValue:  [new ßDate(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)]
                }
            ],
            columns:[
                {
                    key: 'name',
                    label: '姓名',             
                },
                {
                    key: 'status',
                    label: '状态'
                },
                {
                    key: 'age',
                    label: '年龄'
                }
            ],
            operations: [
                {
                    text: '删除',
                    onClick:(row) => {

                    }
                },
                {
                    text: '编辑',
                    onClick: (row) => {
                        this.$put(`/api/list/${id}`, Object.assign(row, {age:33}))
                    }
                }
            ],
            url:'/api/list'
        }
    },
}
</script>

<style lang="less">

</style>