<!--
 * @Author: shen
 * @Date: 2025-05-27 16:33:00
 * @LastEditors: shen
 * @LastEditTime: 2025-10-20 16:31:14
 * @Description:
-->
<script setup lang="ts">
import {
  ProTable,
  ProPage,
  ProButton,
  type ProTableColumnsType,
  type ProTableRowSelection,
  type ProTableKey,
  type ProTableRequest,
  ProFieldType,
} from 'pro-design-vue'
import { sleep } from '@/shared/utils'
import { EllipsisOutlined } from '@ant-design/icons-vue'
import { computed, ref } from 'vue'

const params = ref({
  tab: 'tab1',
})
const columns: ProTableColumnsType = [
  {
    title: '你的标题太长了会被缩进',
    dataIndex: 'name',
    fixed: 'left',
    width: 200,
    rowDrag: ({ record }) => {
      return record.id !== 1
    },
    headerTooltip: '你的标题太长了会被缩进',
    key: 'name',
    initialValue: '11',
    resizable: true,
    filters: [
      {
        text: 'aa',
        value: '22',
      },
    ],
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    fixed: 'left',
    fieldType: ProFieldType.DIGIT,
    sorter: (a, b) => a.age - b.age,
    width: 100,
  },
  {
    title: 'Column 1',
    dataIndex: 'address',
    fieldType: ProFieldType.SELECT,
    options: [
      { value: '1', text: '男' },
      { value: '2', text: '女' },
    ],
  },
  {
    title: 'Column 2',
    dataIndex: 'address1',
  },
  // {
  //   title: 'Column 3',
  //   hideInSearch: true,
  //   dataIndex: 'address',
  // },
  // {
  //   title: 'Column 4',
  //   hideInSearch: true,
  //   dataIndex: 'address',
  // },
  // { title: 'Column 5', dataIndex: 'address', hideInSearch: true },
  {
    title: 'Action',
    key: 'operation',
    fixed: 'right',
    hideInSearch: true,
    width: 100,
  },
]
const data: any[] = []
for (let i = 0; i < 1000; i++) {
  data.push({
    id: i,
    name: `Edrward ${i}`,
    age: i + 1,
    address: `London Park no. ${i}`,
    children: [{ id: i + '123123123', name: `Edrward ${i} -1` }],
  })
}
const pagination = ref({
  pageSize: 20,
})
const rowSelection = computed<ProTableRowSelection>(() => {
  return {
    // type: 'radio',
    hideDefaultSelections: true,
    selections: [
      ProTable.SELECTION_ALL,
      ProTable.SELECTION_INVERT,
      ProTable.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys: ProTableKey[] = []
          newSelectedRowKeys = changableRowKeys.filter((_key, index) => {
            if (index % 2 !== 0) {
              return false
            }
            return true
          })
        },
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys: ProTableKey[] = []
          newSelectedRowKeys = changableRowKeys.filter((_key, index) => {
            if (index % 2 !== 0) {
              return true
            }
            return false
          })
        },
      },
    ],
    getCheckboxProps(record) {
      return {
        disabled: record.id === 1,
      }
    },
  }
})

const fetchData: ProTableRequest = async (params, sorters, filter) => {
  // console.log('🚀 ~ constfetchData:ProTableRequest= ~ sorters:', sorters)
  // console.log('🚀 ~ constfetchData:ProTableRequest= ~ filter:', filter)
  // console.log('🚀 ~ constfetchData:ProTableRequest= ~ params:', params)
  await sleep(1000)
  return {
    success: true,
    data: params.status === 'tab2' ? [] : data,
  }
}

const beforeSearchSubmit = (values) => {
  console.log('🚀 ~ values:', values)
  return {
    ...values,
    aaa: '12312312',
  }
}

const tabList = ref([
  {
    key: 'tab1',
    tab: '全部',
  },
  {
    key: 'tab2',
    tab: '未激活',
  },
])
</script>

<template>
  <ProPage
    :tabList
    v-model:activeKey="params.tab"
    title="我是页面标题"
    description="我也页面描述或副标题"
    :tabProps="{
      // centered: true,
    }"
  >
    <!-- <template #title> 自带路由示例页面 </template> -->
    <template #extra>
      <ProButton type="primary">新建{{ params.tab }}</ProButton>
    </template>
    <!-- <template #tab1>
      <Tab1 />
    </template>
    <template #tab2>
      <Tab2 />
    </template>
    <template #tabs="{ activeKey }">
      {{ activeKey }}
      <Tab1 v-show="activeKey === 'tab1'" />
      <Tab2 v-show="activeKey === 'tab2'" />
    </template> -->
    <template #default="{ activeKey, offset }">
      <ProTable
        v-model:pagination="pagination"
        :columns="columns"
        :params="params"
        :sticky="{
          offsetHeader: offset.top,
        }"
        :paginationSticky="{
          offsetBottom: offset.bottom,
        }"
        :polling="0"
        :request="fetchData"
        title="高级表格"
        sub-title="这里是子标题"
        tooltip="这是一个标题提示"
        column-drag
        :beforeSearchSubmit
        :options="{
          search: {
            value: '111',
          },
        }"
        :search="{
          cardProps: {
            activeTabKey: 'tab1',
            tabList: [
              {
                key: 'tab1',
                tab: '全部',
              },
              {
                key: 'tab2',
                tab: '未激活',
              },
            ],
          },
          tabName: 'status',
          resetOnSubmit: true,
          layout: 'horizontal',
        }"
        :scroll="{ x: 1500 }"
        :row-selection="rowSelection"
      >
        <template #alertActions>
          <a class="pro-link">批量删除</a>
          <a class="pro-link">导出数据</a>
        </template>
        <template #toolbarActions>
          <ProButton type="primary">创建应用{{ activeKey }}</ProButton>
          <ProButton>
            <template #icon>
              <EllipsisOutlined />
            </template>
          </ProButton>
        </template>
      </ProTable>
    </template>
    <!-- </Card> -->

    <!-- <Card title="固定列">
      <ProTable
        virtual
        :columns="columns"
        :data-source="dataSource"
        :scroll="{ y: 200, x: 2000 }"
        :pagination="false"
      >
        <template #bodyCell="{ column }">
          <template v-if="column.key === 'operation'">
            <a>Action</a>
          </template>
        </template>
      </ProTable>
    </Card> -->
  </ProPage>
</template>
