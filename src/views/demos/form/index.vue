<!--
 * @Author: shen
 * @Date: 2025-05-27 16:33:00
 * @LastEditors: shen
 * @LastEditTime: 2026-01-05 09:10:39
 * @Description:
-->
<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import {
  ProFieldType,
  ProForm,
  ProPage,
  ProQueryFilter,
  ProModalForm,
  ProButton,
  type ProFormItemType,
  type ProQueryFilterInstance,
} from 'pro-design-vue'
import { sleep } from '@/shared/utils'
import { Card, Image } from 'ant-design-vue'
import { useApplication } from '@/hooks'
import { useRouter } from 'vue-router'

const mounted = false

const router = useRouter()

const { onActivated, onDeactivated } = useApplication()

onActivated(() => {
  console.log('main onActivated')
})

onDeactivated(() => {
  console.log('main onDeactivated')
})

const Filter = ProForm.Filter
const filterRef = useTemplateRef<ProQueryFilterInstance>('filterRef')
const filterItems: ProFormItemType[] = [
  {
    name: 'INPUT',
    title: '文本',
    initialValue: '1111',
    allowClear: true,
    rules: [{ required: true, message: '请输入文本', trigger: 'change' }],
  },
  {
    name: 'DIGIT',
    title: '数字',
    fieldType: ProFieldType.DIGIT,
  },
  {
    name: 'DIGIT_RANGE',
    title: '数字区间',
    fieldType: ProFieldType.DIGIT_RANGE,
  },
  {
    name: 'SELECT',
    title: '选择器',
    fieldType: ProFieldType.SELECT,
    options: [
      { value: '1', label: '男' },
      { value: '2', label: '女' },
    ],
  },

  // {
  //   name: 'TREE_SELECT',
  //   title: '树形选择器',
  //   fieldType: ProFieldType.TREE_SELECT,
  //   options: [
  //     {
  //       value: '1',
  //       label: '吉林省',
  //       children: [
  //         { value: '1-1', label: '长春市' },
  //         { value: '1-2', label: '吉林市' },
  //         { value: '1-3', label: '四平市' },
  //       ],
  //     },
  //     {
  //       value: '2',
  //       label: '黑龙江省',
  //       children: [
  //         { value: '2-1', label: '哈尔滨市' },
  //         { value: '2-2', label: '齐齐哈尔市' },
  //         { value: '2-3', label: '牡丹江市' },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   name: 'CASCADER',
  //   title: '级联选择器',
  //   fieldType: ProFieldType.CASCADER,
  //   options: [
  //     {
  //       value: '1',
  //       label: '吉林省',
  //       children: [
  //         { value: '1-1', label: '长春市' },
  //         { value: '1-2', label: '吉林市' },
  //         { value: '1-3', label: '四平市' },
  //       ],
  //     },
  //     {
  //       value: '2',
  //       label: '黑龙江省',
  //       children: [
  //         { value: '2-1', label: '哈尔滨市' },
  //         { value: '2-2', label: '齐齐哈尔市' },
  //         { value: '2-3', label: '牡丹江市' },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   name: 'SELECT',
  //   title: '选择器（远程-所有options都支持）',
  //   fieldType: ProFieldType.SELECT,
  //   request: () =>
  //     new Promise((resolve) => {
  //       setTimeout(() => {
  //         resolve([
  //           { value: '1', label: '男' },
  //           { value: '2', label: '女' },
  //         ])
  //       }, 3000)
  //     }),
  // },
  {
    name: 'date',
    title: '日期',
    fieldType: ProFieldType.DATE,
  },
  {
    name: 'dateRange',
    title: '日期区间',
    fieldType: ProFieldType.DATE_RANGE,
  },
  {
    name: 'time',
    title: '时间',
    fieldType: ProFieldType.TIME,
  },
  {
    name: 'timeRange',
    title: '时间区间',
    fieldType: ProFieldType.TIME_RANGE,
  },
]

const formItems: ProFormItemType[] = [
  {
    name: 'INPUT',
    title: '文本',
    initialValue: '22222',
    readonly: true,
    readonlyProps: {
      copy: true,
    },
    // width: 'md',
  },
  {
    name: 'DIGIT',
    title: '数字',
    fieldType: ProFieldType.DIGIT,
    rules: [{ required: true, message: '请输入文本', trigger: 'change' }],
  },
  {
    name: 'DIGIT_RANGE',
    title: '数字区间',
    fieldType: ProFieldType.DIGIT_RANGE,
  },
  {
    name: 'SELECT',
    title: '选择器',
    fieldType: ProFieldType.SELECT,
    options: [
      { value: '1', label: '男' },
      { value: '2', label: '女' },
    ],
  },

  {
    name: 'TREE_SELECT',
    title: '树形选择器',
    fieldType: ProFieldType.TREE_SELECT,
    options: [
      {
        value: '1',
        label: '吉林省',
        children: [
          { value: '1-1', label: '长春市' },
          { value: '1-2', label: '吉林市' },
          { value: '1-3', label: '四平市' },
        ],
      },
      {
        value: '2',
        label: '黑龙江省',
        children: [
          { value: '2-1', label: '哈尔滨市' },
          { value: '2-2', label: '齐齐哈尔市' },
          { value: '2-3', label: '牡丹江市' },
        ],
      },
    ],
  },
  {
    name: 'CASCADER',
    title: '级联选择器',
    fieldType: ProFieldType.CASCADER,
    options: [
      {
        value: '1',
        label: '吉林省',
        children: [
          { value: '1-1', label: '长春市' },
          { value: '1-2', label: '吉林市' },
          { value: '1-3', label: '四平市' },
        ],
      },
      {
        value: '2',
        label: '黑龙江省',
        children: [
          { value: '2-1', label: '哈尔滨市' },
          { value: '2-2', label: '齐齐哈尔市' },
          { value: '2-3', label: '牡丹江市' },
        ],
      },
    ],
  },
  {
    name: 'SELECT',
    title: '选择器（远程-所有options都支持）',
    initialValue: '1',
    fieldType: ProFieldType.SELECT,
    request: () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            { value: '1', label: '男' },
            { value: '2', label: '女' },
          ])
        }, 3000)
      }),
  },
  {
    name: 'date',
    title: '日期',
    fieldType: ProFieldType.DATE,
  },
  {
    name: 'dateRange',
    title: '日期区间',
    fieldType: ProFieldType.DATE_RANGE,
  },
  {
    fieldType: ProFieldType.GROUP,
    title: '123123',
    colProps: {
      span: 16,
    },
    children: [
      {
        name: 'time',
        title: '时间',
        formItemProps: {},
        fieldProps: {},
        colProps: {
          span: 4,
        },
        fieldType: ProFieldType.TIME,
      },
      {
        name: 'timeRange',
        title: '时间区间',
        fieldType: ProFieldType.TIME_RANGE,
      },
      // {
      //   name: 'UPLOAD_BUTTON',
      //   title: '点击上传',
      //   fieldType: ProFieldType.UPLOAD_BUTTON,
      // },
      {
        name: 'UPLOAD_PICTURE',
        title: '上传图片',
        allowClear: true,
        fieldType: ProFieldType.UPLOAD_PICTURE,
        rules: [{ required: true, message: '请选择图片', trigger: 'change' }],
        fieldProps: {
          width: 118,
          height: 118,
          // isCropper: false,
          showTitle: true,
          // customRequest: async (params) => {
          //   try {
          //     const { data, code } = await uploadImageFile(params, { folder: 'tenants' })
          //     if (code === 200) {
          //       return data
          //     }
          //     return null
          //   } catch (error) {
          //     return null
          //   }
          // },
        },
      },
    ],
  },

  {
    name: 'UPLOAD_DRAGGER',
    title: '拖拽上传',
    fieldType: ProFieldType.UPLOAD_DRAGGER,
    // colProps: {
    //   span: 24,
    // },
  },
  {
    title: '文本域',
    name: 'textarea',
    fieldType: ProFieldType.TEXTAREA,
    colProps: {
      span: 24,
    },
  },
]

const formItems2: ProFormItemType[][] = [
  [
    {
      name: 'INPUT',
      title: '文本',
      initialValue: '1111',
      allowClear: true,
      rules: [{ required: true, message: '请输入文本', trigger: 'change' }],
    },
    {
      name: 'DIGIT',
      title: '数字',
      fieldType: ProFieldType.DIGIT,
      rules: [{ required: true, message: '请输入文本', trigger: 'change' }],
    },
    {
      name: 'DIGIT_RANGE',
      title: '数字区间',
      fieldType: ProFieldType.DIGIT_RANGE,
    },
  ],
  [
    {
      name: 'date',
      title: '日期',
      fieldType: ProFieldType.DATE,
    },
    {
      name: 'dateRange',
      title: '日期区间',
      fieldType: ProFieldType.DATE_RANGE,
    },
    {
      name: 'time',
      title: '时间',
      fieldType: ProFieldType.TIME,
    },
  ],
  [
    {
      name: 'date',
      title: '日期',
      fieldType: ProFieldType.DATE,
    },
    {
      name: 'dateRange',
      title: '日期区间',
      fieldType: ProFieldType.DATE_RANGE,
    },
    {
      name: 'time',
      title: '时间',
      fieldType: ProFieldType.TIME,
    },
  ],
]

const handleReset = (val) => {
  console.log('🚀 ~ handleReset ~ val:', val)
}

const handleFinish = async (val) => {
  await sleep(3000)
  console.log('🚀 ~ handleReset ~ val:', val)
  return true
}
</script>

<template>
  <ProPage>
    <Card style="margin-bottom: 10px">
      <Filter ref="filterRef" :items="filterItems" @reset="handleReset" @finish="handleFinish" />
    </Card>
    <Card>
      <ProForm grid :col-props="{ span: 8 }" :items="formItems" @finish="handleFinish">
        <template #submitter="{ defaultDoms }">
          <component :is="defaultDoms" />
          <ProForm.Drawer title="抽屉表单" :items="formItems" @finish="handleFinish">
            <template #trigger>
              <ProButton>打开抽屉表单</ProButton>
            </template>
          </ProForm.Drawer>
        </template>
      </ProForm>
    </Card>
  </ProPage>
</template>
