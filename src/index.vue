<template>
    <dataTable :filters="filters"></dataTable>
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
                    defaultValue:'start',
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
            ]
        }
    }
}
</script>

<style lang="less">


</style>