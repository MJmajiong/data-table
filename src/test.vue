<template>
  <div class="table-column-form">
    <el-form ref="form" :model="model" v-bind="formProps">
      <el-table :data="model.tableData" v-bind="tableProps">
        <el-table-column
          v-for="(column, index) of columns"
          :key="index"
          v-bind="column"
        >
          <template v-slot="{row, column: col, $index}">
            <el-form-item
              v-if="column.type === FORM_TYPE.custom"
              v-bind="parseFromItemProp(column, row)"
              :prop="col.property | parseFormItemPropName($index)"
              class="custom-form-wrap"
            >
              <vnode                                                                 
                :vnode="column.component({column, row, col, index: $index})"      //component自定义组件，从外层传进来，通过render的方式
              ></vnode>
            </el-form-item>
 

            <el-form-item
              v-if="column.type === FORM_TYPE.input"
              v-bind="parseFromItemProp(column, row)"
              :prop="col.property | parseFormItemPropName($index)"
            >
              <el-input
                v-model.trim="row[col.property]"
                v-bind="parseElProps(column, row, col)"
              >
                <template v-if="column.slots">
                  <slot
                    v-for="(fn, slotName) of column.slots"
                    :name="slotName"
                    :slot="slotName"
                  >
                    <vnode
                      :key="slotName"
                      :vnode="fn({column, row, col, index: $index})"
                    ></vnode>
                  </slot>
                </template>
              </el-input>
            </el-form-item>
 

            <el-form-item
              v-if="column.type === FORM_TYPE.select"
              v-bind="parseFromItemProp(column, row)"
              :prop="col.property | parseFormItemPropName($index)"
            >
              <el-select
                v-model.trim="row[col.property]"
                v-bind="parseElProps(column, row, col)"
              >
                <el-option
                  v-for="option of column.options"
                  :key="option.value"
                  :value="option.value"
                  :label="option.label"
                  :disabled="disabledDuplicateOption(column, col, option.value)"
                ></el-option>
 

                <template v-if="column.slots">
                  <slot
                    v-for="(value, slotName) of column.slots"
                    :name="slotName"
                    :slot="slotName"
                  >
                    <vnode
                      :key="slotName"
                      :vnode="value({column, row, col, index: $index})"
                    ></vnode>
                  </slot>
                </template>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
 

        <el-table-column v-bind="extraColumnProps">
          <template v-slot="{row, column: col, $index}">
            <div class="extra-button-wrap">
              <i
                v-if="showDeleteButton && $index < model.tableData.length - 1"
                class="el-icon-delete"
                @click.stop="deleteRow($index)"
              ></i>
 

              <i
                v-if="$index === model.tableData.length - 1"
                class="el-icon-s-open"
                @click.stop="clearRow($index)"
              ></i>
 

              <template v-for="(fn, index) of extraButtons">
                <vnode
                  :key="index"
                  :vnode="fn({row, col, index: $index})"
                ></vnode>
              </template>
            </div>
          </template>
        </el-table-column>
 

        <slot name="column"></slot>
      </el-table>
    </el-form>
  </div>
</template>
 

<script>
import cloneDeep from 'lodash/cloneDeep'
import flatten from 'lodash/flatten'
 

function isString(value) {
  return typeof value === 'string'
}
 

const FORM_TYPE = {
  input: 'input',
  select: 'select',
 

  custom: 'custom', // 自定义
}
 

const DEFAULT_NEW_ROW_VALUE = ''
 

export default {
  name: 'DynamicTableForm',
  components: {
    Vnode: {
      functional: true,
      render(h, ctx) {
        console.log(ctx, 'ctx')
        return ctx.props.vnode
      },
    },
  },
  filters: {
    parseFormItemPropName(property, index) {
      return `tableData.${index}.${property}`
    },
  },
  props: {
    appendFirstRow: {
      type: Boolean,
      default: true,
    },
    deleteConfirmProps: {
      type: Object,
      default() {
        return {
          message: '确认删除该行吗？',
          title: '提示',
          options: {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          },
        }
      },
    },
    tableProps: {
      type: Object,
      default: () => ({}),
    },
    formProps: {
      type: Object,
      default: () => ({}),
    },
    extraColumnProps: {
      type: Object,
      default: () => ({}),
    },
    columns: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
    extraButtons: {
      type: Array,
      default: () => [],
    },
    showDeleteButton: {
      type: Boolean,
      default: true,
    },
  },
 

  data() {
    return {
      FORM_TYPE,
      model: {
        tableData: [],
      },
    }
  },
  computed: {
    finalRow() {
      const length = this.model.tableData.length
      return this.model.tableData[length - 1] || {}
    },
    formData() {
      let formData = this.model.tableData.map(row => {
        return Object.keys(row).reduce((prev, key) => {
          // 过滤没有列的值
          if (this.currentColumns[key]) {
            prev[key] = row[key]
          }
          return prev
        }, {})
      })
 

      const length = formData.length
      let finalRow = formData[length - 1]
 

      finalRow = Object.keys(finalRow).reduce((prev, key) => {
        const value = finalRow[key]
        const defaultValue = this.currentColumns[key].defaultValue
        // !(自定义组件 && 自定义组件的值是 boolean && 自定义组件的值 === 传入的默认值)
        if (
          !(
            this.currentColumns[key].type === FORM_TYPE.custom &&
            typeof value === 'boolean' &&
            value === defaultValue
          )
        ) {
          prev[key] = value
        }
        return prev
      }, {})
 

      const shouldReturnFinalRow = Object.values(finalRow).some(value => {
        return value !== DEFAULT_NEW_ROW_VALUE
      })
 

      if (!shouldReturnFinalRow) {
        formData.pop()
      }
 

      return formData
    },
    currentColumns() {
      return this.columns.reduce((prev, column) => {
        prev[column.prop] = column
        return prev
      }, {})
    },
    pureRow() {
      const canUseDefaultValueType = [FORM_TYPE.custom]
      return this.columns.reduce((prev, current) => {
        prev[current.prop] =
          current.defaultValue !== undefined &&
          canUseDefaultValueType.includes(current.type)
            ? current.defaultValue
            : DEFAULT_NEW_ROW_VALUE
        return prev
      }, {})
    },
    shouldAppendRow() {
      // 仅获取 有列的行值
      // 比如有  列1 列2
      // 行数据： a1  a2  a3
      // 就只获取：a1，a2 ， 因为 a3 不存在列
      const shouldAppendRow = this.columns.every(column => {
        // 过滤 disabled 项，disabled 的那一项直接发返回 true
        const isDisabled = this.parseDisabled(column, this.finalRow)
        const value = this.finalRow[column.prop]
        return isDisabled || value !== DEFAULT_NEW_ROW_VALUE
      })
 

      return shouldAppendRow
    },
  },
  watch: {
    data: {
      // deep: true,
      immediate: true,
      handler(data) {
        this.$nextTick(() => {
          this.clearValidate()
        })
 

        const isIllegalData = !data || !Array.isArray(data)
 

        this.model.tableData = isIllegalData ? [] : data
      },
    },
    finalRow: {
      deep: true,
      immediate: true,
      handler(row) {
        this.handleWatchFinalRow(row)
      },
    },
    formProps: {
      immediate: true,
      deep: true,
      handler(formProps) {
        const {disabled} = formProps
        if (!disabled) {
          this.handleWatchFinalRow(this.finalRow)
        } else if (!this.shouldAppendRow) {
          this.deleteFinalRow()
        }
      },
    },
  },
  methods: {
    disabledDuplicateOption(column, col, currentValue) {
      const {disabledDuplicateOption} = column
 

      if (!disabledDuplicateOption) return false
 

      return this.model.tableData.some(row => {
        return row[col.property] === currentValue
      })
    },
    handleWatchFinalRow() {
      const {disabled} = this.formProps
 

      if (disabled) {
        return
      }
 

      const length = this.model.tableData.length
      if (!length && this.appendFirstRow) {
        // 没数据，并且 appendFirstRow 为 true，追加一行
        this.appendRow()
        return
      }
 

      if (length && this.shouldAppendRow) {
        // 有数据，并且最后一行符合要求，追加一行
        this.appendRow()
      }
    },
    parseFormItemPropName2(property, index) {
      return `tableData.${index}.${property}`
    },
    clearValidate(props = []) {
      this.$refs.form && this.$refs.form.clearValidate(props)
    },
    validate(callback) {
      this.clearValidate()
 

      let props = this.formData.map((row, index) => {
        // this.formData 已经做了最后一行 是否 返回的处理，这里不需要做了
 

        const rowValidPropName = Object.keys(row)
          .filter(prop => {
            const isDisabled = this.parseDisabled(
              this.currentColumns[prop],
              row,
            )
            return !isDisabled
          })
          .map(prop => {
            return `tableData.${index}.${prop}`
          })
 

        return rowValidPropName
      })
 

      props = flatten(props)
 

      let valid = true
 

      this.$refs.form.validateField(props, errorMessage => {
        errorMessage && (valid = false)
      })
 

      if (callback) {
        return callback(valid, this.formData)
      }
 

      return valid ? Promise.resolve(this.formData) : Promise.reject()
    },
    clearRow(index) {
      const row = this.model.tableData[index]
 

      const props = Object.keys(row).map(key => {
        row[key] = ''
        return `tableData.${index}.${key}`
      })
 

      this.$nextTick(() => {
        this.clearValidate(props)
      })
    },
    async deleteRow(index) {
      const data = this.model.tableData[index]
      this.model.tableData.splice(index, 1)
      this.$emit('successDeleteRow', data)
    },
    deleteFinalRow() {
      this.model.tableData.pop()
    },
    appendRow() {
      this.model.tableData.push(cloneDeep(this.pureRow))
      this.$emit('appendRow')
    },
    parseElProps(column, row, col) {
      const mergeProps = {
        ...(column.el || {}),
        disabled: this.parseDisabled(column, row, col),
      }
      return mergeProps
    },
    parseDisabled(column, row) {
      const props = column.el || {}
 

      const disabled = props.disabled
 

      if (!disabled) {
        return false
      }
 

      if (typeof disabled !== 'boolean' && typeof disabled !== 'function') {
        throw new TypeError(
          'disabled params must be a boolean or function type',
        )
      }
 

      if (typeof disabled === 'boolean') {
        return disabled
      }
 

      return disabled(row)
    },
    parseFromItemProp(column, row) {
      let formItemProps = column.formItemProps
      if (typeof formItemProps === 'function') {
        formItemProps = formItemProps(row)
      }
      return formItemProps || {}
    },
    getFormData() {
      return this.formData
    },
 

    setItemValue({row, col, value}) {
      this.model.tableData[row][col] = isString(value) ? value.trim() : value
    },
 

    getItemValue({row, col}) {
      return this.model.tableData[row][col]
    },
  },
}
</script>
 

<style lang="less">
.table-column-form {
  .el-form-item {
    margin-bottom: 18px;
  }
 

  .extra-button-wrap {
    padding-top: 6px;
 

    i {
      cursor: pointer;
    }
  }
 

  .el-table__row {
    td {
      padding: 18px 0 0;
      vertical-align: top;
 

      .cell {
        padding-left: 0;
        padding-right: 12px;
 

        .el-select {
          width: 100%;
        }
      }
    }
  }
}
</style>
 