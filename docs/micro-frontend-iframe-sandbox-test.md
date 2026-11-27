# iframe 沙箱模式替代方案测试报告

> 测试日期：2026-11-27
> 问题：每个微应用 tab 都有独立 iframe + Vue 运行时，能否去掉 iframe 以降低内存？
> 测试方式：真实浏览器（Playwright）+ 生产构建产物（vite preview），1 主应用 + 3 子应用实例

## 1. 结论

**在当前项目架构下，不能简单去掉 iframe。** 三种替代方案均失败或带来更严重问题：

| 方案                           | 结果                  | JS 堆内存                     | 原因                                                                        |
| ------------------------------ | --------------------- | ----------------------------- | --------------------------------------------------------------------------- |
| **iframe 模式（当前）**        | ✅ 3 个子应用正常加载 | **68.1 MB**                   | 基准                                                                        |
| shadow DOM（默认沙箱）         | ❌ 加载失败           | 24.6 MB（假象，子应用未加载） | ESM 脚本被 Function 执行，报 `Cannot use import statement outside a module` |
| shadow DOM + `disable-sandbox` | ❌ 主应用崩溃         | —                             | 无沙箱隔离后子应用污染全局，主应用 DOM 空白                                 |
| shadow DOM + `inline`          | ❌ 加载失败           | 23.6 MB（假象）               | 同样 ESM 报错，且出现 `element micro-app is already defined`                |

**内存从 68MB 降到 24MB 是假象**——子应用根本没渲染出来。

## 2. 失败根因分析

### 2.1 ESM 脚本不兼容（致命）

项目用 Vite 8 构建，产物入口是 `<script type="module">`。micro-app 源码中（`lib/index.esm.js:1765`）：

```js
function isTypeModule(app, scriptInfo) {
  return scriptInfo.appSpace[app.name].module && (!app.useSandbox || app.iframe)
}
```

只有满足 `!useSandbox || iframe` 时，ESM 脚本才会被当作 `type=module` 原生执行。shadow DOM 模式默认启用沙箱（`useSandbox=true`），micro-app 会用 `new Function()` 执行脚本，遇到 `import` 语句直接报错：

```
SyntaxError: Cannot use import statement outside a module
```

这是**框架机制层面的限制**，不是配置能绕过的（除非禁用沙箱，但见下一条）。

### 2.2 通用项目架构冲突（致命）

本项目是**主子应用同构**的——子应用自身也打包了 `@micro-zoe/micro-app`。在 shadow DOM 模式下，子应用与主应用共享同一个 `window`：

- 子应用加载时再次执行 `customElements.define('micro-app', ...)`，报错 `element micro-app is already defined`
- 子应用的 `microApp.start()` 会覆盖主应用的全局配置
- 子应用的 Vue 3、Pinia 等全局状态可能污染主应用

`disable-sandbox` 测试直接验证了这一点：主应用 DOM 完全空白，应用崩溃。iframe 模式通过独立 window 天然避免了这些冲突——**这正是当前架构选择 iframe 的根本原因**。

## 3. iframe 模式的价值（重新评估）

之前报告把 iframe 单纯视为"内存开销"，这次测试说明它同时提供了三项不可替代的能力：

1. **JS 隔离**：让同构子应用的 `micro-app` 定义、Vue 运行时、全局状态不污染主应用。
2. **ESM 原生执行**：`isTypeModule` 条件中 `app.iframe` 为真，module 脚本由浏览器原生加载，无需 Function 转换。
3. **样式隔离**：iframe 自带完整文档，无需依赖 shadow DOM 的样式穿透处理。

内存开销（68MB / 3 子应用）是这些能力的代价，而非设计缺陷。

## 4. 可行的优化方向（不去掉 iframe）

既然 iframe 不能去掉，降低内存的可行方案：

### 4.1 限制保活 tab 数量（推荐）

`micro-router-view.vue` 用 `v-show` 保活所有打开过的微应用 tab。建议设置上限（如 5 个），超出后销毁最久未激活的实例。代价：重新进入时需重新加载（但 preFetch 已缓存资源，本地约 240ms，慢网依赖缓存）。

### 4.2 关闭非高频 tab 的 keepAlive

菜单中 `keepAlive: false` 的微应用，在 `canRender()` 中非激活时不渲染（已实现）。引导业务方只对高频 tab 开启 `keepAlive`。

### 4.3 子应用瘦身（间接收益）

每个 iframe 加载的是完整子应用（含 Vue、UI 库等）。由于子应用是同构项目，可参考上一轮"子应用入口体积优化"的成果（入口 373KB → 264KB），降低每个 iframe 的解析与内存成本。

## 5. 测试后状态

所有临时修改已恢复：

- `micro-view.vue`：`iframe` 属性保留
- `prefetch-micro.ts`：`iframe: true` 保留
- `menu.ts`：恢复原配置（微应用注释状态）
- 验证：`npm run build` 通过

测试报告文档保留在 `docs/` 下供参考。
