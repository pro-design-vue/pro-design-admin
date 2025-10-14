<!--
 * @Author: shen
 * @Date: 2025-06-20 14:19:12
 * @LastEditors: shen
 * @LastEditTime: 2025-10-14 10:11:26
 * @Description:
-->
<script setup lang="ts">
import {
  ADMIN_GITHUB_URL,
  DOC_URL,
  ADMIN_PREVIEW_URL,
  COMPONENT_GITHUB_URL,
} from '@/shared/constants'
import { Card, CardGrid } from 'ant-design-vue'
import { ProPage } from 'pro-design-vue'

declare global {
  const __PRO_ADMIN_METADATA__: {
    authorEmail: string
    authorName: string
    authorUrl: string
    buildTime: string
    dependencies: Record<string, string>
    description: string
    devDependencies: Record<string, string>
    homepage: string
    license: string
    repositoryUrl: string
    version: string
  }
}

const {
  authorEmail,
  buildTime,
  license,
  version,
  // vite inject-metadata 插件注入的全局变量
} = __PRO_ADMIN_METADATA__ || {}

const descriptionItems = [
  {
    content: version,
    title: '版本号',
  },
  {
    content: license,
    title: '开源许可协议',
  },
  {
    content: buildTime,
    title: '最后构建时间',
  },
  {
    title: '作者',
    content: authorEmail,
  },
  {
    title: '文档地址',
    link: DOC_URL,
  },
  {
    title: '预览地址',
    link: ADMIN_PREVIEW_URL,
  },
  {
    title: '组件库 Github',
    link: COMPONENT_GITHUB_URL,
  },
  {
    title: '框架 Github',
    link: ADMIN_GITHUB_URL,
  },
]
</script>

<template>
  <ProPage title="关于 Pro Design">
    <template #description>
      <p style="margin-top: 10px">
        <a :href="DOC_URL" style="color: hsl(var(--pro-primary))" target="_blank"> Pro Design </a>
        是一个基于 Vue3.0、Vite、 TypeScript、Ant Design Vue、Micro App
        的企业级管理系统框架和组件库，目标是让中后台开发更简单。包括微前端、二次封装组件、utils、hooks、动态菜单、权限校验、多主题配置、按钮级别权限控制等功能。项目会使用前端较新的技术栈，可以作为项目的启动模板，以帮助你快速搭建企业级中后台产品原型。也可以作为一个示例，用于学习
        vue3、vite、ts 等主流技术。该项目会持续跟进最新技术，并将其应用在项目中。
      </p>
      <p style="margin-top: 10px">
        <a :href="COMPONENT_GITHUB_URL" style="color: hsl(var(--pro-primary))" target="_blank">
          Pro Design Vue
        </a>
        组件库已经发布到Npm，组件库可以无缝对接 Ant Design Vue 项目，但是强烈建议搭配 Pro Design
        Admin 使用，开箱即用，配置完善。
      </p>

      <p style="margin-top: 10px">
        <a :href="ADMIN_GITHUB_URL" style="color: hsl(var(--pro-primary))" target="_blank">
          Pro Design Admin
        </a>
        企业级管理系统框架，内置微前端支持，主子应用同构框架，可以独立发布使用，也可以作为子应用接入到其他应用。
      </p>
    </template>
    <Card title="">
      <template v-for="item in descriptionItems" :key="item.title">
        <CardGrid style="width: 25%; text-align: left" :hoverable="false">
          <div style="font-weight: 500; margin-bottom: 10px">{{ item.title }}</div>
          <div v-if="item.content">{{ item.content }}</div>
          <div v-if="item.link">
            <a
              style="color: hsl(var(--pro-primary))"
              :href="item.link"
              class="pro-link"
              target="_blank"
            >
              点击查看</a
            >
          </div>
        </CardGrid>
      </template>
    </Card>
  </ProPage>
</template>
