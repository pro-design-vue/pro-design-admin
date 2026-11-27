/// <reference types="vite/client" />

// 让 IDE 的纯 TypeScript 语言服务也能解析 .vue 单文件组件；
// 运行时与 vue-tsc 仍由 Vite/Vue 插件处理实际 SFC 类型。
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}
