# 微前端使用文档

本文档说明 Pro Design Admin 作为**微前端主子应用通用项目**的运行原理、接入方式与性能相关配置。

## 1. 概述

- 微前端方案：`@micro-zoe/micro-app`，采用 **iframe 沙箱模式**、`native` 路由模式。
- 项目形态：**单包通用项目**，同一份代码既可作为主应用（基座）独立运行，也可被其它基座作为子应用加载。
- 子应用来源：由后端菜单下发 `microUrl`，指向独立部署的子应用地址；本仓库不内置子应用源码。
- 关键目录：

| 路径 | 职责 |
| --- | --- |
| `src/bootstrap.ts` | 主应用入口：初始化偏好、i18n、Pinia、路由，启动 `microApp` |
| `src/micro.ts` | 子应用入口：创建独立 Vue 实例，暴露 `mount` / `unmount` |
| `src/main.ts` | 双模式分发：根据 `window.__MICRO_APP_ENVIRONMENT__` 选择入口 |
| `src/config/index.ts` | 运行模式判定（`isMainApp` / `powerByMicro` / `baseRoute`） |
| `src/layouts/micro/micro-view.vue` | 微应用容器，渲染 `<micro-app>` 并下发数据 |
| `src/layouts/micro/micro-router-view.vue` | 多个微应用 tab 的渲染与保活 |
| `src/router/guard.ts` | 动态路由生成后触发微应用预加载 |
| `src/shared/utils/prefetch-micro.ts` | 微应用空闲预加载工具 |
| `src/hooks/useApplication` | 主子统一 activated/deactivated 生命周期 |
| `public/empty.html` | iframe 模式使用的空白占位页 |

## 2. 快速开始

```bash
npm install
npm run dev          # 开发
npm run build        # 构建（含 vue-tsc 类型检查）
npm run preview      # 预览构建产物
npm run build:analyze # 生成 dist/stats.html 体积分析
```

要求 Node.js `>= 22.18.0`。

## 3. 两种运行模式

`src/config/index.ts` 根据运行环境自动判定：

```ts
isMainApp: !window.__MICRO_APP_ENVIRONMENT__,
powerByMicro: window.__MICRO_APP_ENVIRONMENT__,
baseRoute: window.__MICRO_APP_BASE_ROUTE__ || VITE_PUBLIC_PATH,
```

- **独立访问**（`isMainApp === true`）：`main.ts` 动态加载 `bootstrap.ts`，执行 `microApp.start()`，渲染完整后台布局。
- **被作为子应用加载**（`powerByMicro === true`）：`main.ts` 向 `window` 挂载 `mount` / `unmount`，动态加载 `micro.ts`，只渲染内容区，并跳过主应用的权限守卫。

因此同一份代码既可独立部署为主应用，也可作为微应用接入其它基座。

## 4. 主应用接入微应用

### 4.1 菜单字段

在后端菜单数据中为微应用页面配置以下字段（见 `src/router/access.ts`、`src/typings/data/menu.ts`）：

| 字段 | 说明 |
| --- | --- |
| `microUrl` | 子应用入口地址，如 `http://localhost:8095/`。有该值即被识别为微应用路由 |
| `appName` | 应用标识，用于生成路由前缀 `/${appName}`、容器 `baseroute` 和 `name` |
| `keepAlive` | 是否保活。开启后该 tab 参与 LRU 保活（见 4.3），切换不丢状态；关闭后非激活即销毁 |
| `componentPath` | 可选。指定子应用内页面组件路径，子应用通过 `import.meta.glob` 查找 |
| `title` / `icon` | 菜单标题与图标 |

路由生成时会自动把微应用路径改写为 `/${appName}${path}`（`src/router/access.ts:110-112`）。

### 4.2 容器行为

`src/layouts/micro/micro-view.vue` 渲染：

```vue
<micro-app
  :url="tab.meta.microUrl"
  :baseroute="`/${tab.meta.appName}`"
  :name="`${tab.meta.appName}-${tab.name}`"
  iframe
  clear-data
  :data="microData"
  @mounted="loading = false"
  @error="handleError"
/>
```

- `iframe`：启用 iframe 沙箱，样式与 JS 隔离更强。
- `clear-data`：卸载时清空通信数据。
- `data`：主应用下发的运行时数据（见第 6 节）。
- `micro-router-view.vue` 用 `v-show` 保留已打开的微应用 tab，实现切换不重新加载；保活数量由 LRU 自动控制（见 4.4）。

### 4.3 LRU 自适应保活（替代固定数量限制）

微应用 tab 不再按固定数量硬限制，而是采用 **LRU（最近最少使用）** 策略，让实际访问行为自动决定哪些 tab 保活：

- `micro-router-view.vue` 用 `accessTimeMap` 记录每个微应用 tab 的最后激活时间，当前 tab 每次访问都会刷新时间戳；
- 按访问时间倒序保留最近的 N 个实例，超出上限的**最久未访问**实例会被销毁（移除 iframe），下次访问时重新加载（有 preFetch 缓存，速度较快）；
- 上限由偏好设置 `preferences.micro.maxKeepAliveTabs` 控制，**默认 10**，`0` 表示不限制；
- 优点：无需预知哪些 tab 是高频的，经常被访问的 tab 会自然保留，冷门的自动淘汰，内存占用可控。

可通过偏好设置面板或 `updatePreferences({ micro: { maxKeepAliveTabs: N } })` 调整上限。

### 4.4 预加载（已内置）

菜单生成完成后，`src/router/guard.ts` 调用 `prefetchMicroApps(originMenus)`：

- 仅主应用模式生效；
- 自动去重 `microUrl`，最多预加载前 **5** 个微应用；
- 使用 `microApp.preFetch()`，由 micro-app 在浏览器空闲时执行，不阻塞当前页面；
- 预加载参数带 `iframe: true`，与容器配置保持一致。

如需调整数量或关闭，修改 `src/shared/utils/prefetch-micro.ts` 中的 `MAX_PREFETCH_COUNT` 或移除守卫中的调用。

## 5. 子应用接入

### 5.1 以本项目作为子应用模板

子应用独立部署即可，无需额外包装 SDK：

1. 保证构建产物 `base` 与实际部署路径一致（`VITE_PUBLIC_PATH`）。
2. 被加载时 `main.ts` 自动注册 `window.mount` / `window.unmount`。
3. `bootstrap(props)` 中创建独立的 router、Pinia、i18n 实例并挂载到 `#app`。
4. `unmount()` 中销毁 app、history 并清除 data/globalData 监听。

### 5.2 路由与 API

- 子应用 history 使用 `window.__MICRO_APP_BASE_ROUTE__`（`src/micro.ts:31-35`）。
- 子应用内部路由变化会回写宿主路由：

```ts
props.router.push(`${props.baseroute}${to.path}`)
```

- 子应用 API 基址为 `microUrl + VITE_API_URL_PREFIX`（`src/api/request.ts:130-136`），无需经过宿主代理。

### 5.3 主题与激活状态

- 主应用通过 `microApp.setGlobalData({ theme })` 广播主题；同时每次 `:data` 下发也包含 `theme`。
- 子应用在 `handleDataListener` 中比对并更新偏好设置（`src/micro.ts:110-122`）。
- 子应用页面可使用 `useApplication()` 注册 `onActivated` / `onDeactivated`：在微前端模式下由 `preferences.micro.actived` 驱动，在普通页面由 Vue `KeepAlive` 驱动，行为一致。

## 6. 主子通信数据（microData）

`micro-view.vue` 下发的字段及用途：

| 字段 | 用途 |
| --- | --- |
| `appName` / `microName` / `tabName` | 应用与 tab 标识 |
| `path` | 子应用当前路径（已去掉 `/${appName}` 前缀） |
| `baseroute` | 子应用路由基础路径 |
| `url` | 子应用入口地址 |
| `preferences` | 偏好设置，子应用合并为本地配置 |
| `accessToken` / `userInfo` | 登录态，子应用注入 auth store |
| `locale` / `theme` | 语言与主题 |
| `contentOffsetTop` | 布局顶部偏移 |
| `actived` | 当前 tab 是否激活 |
| `route` | 精简后的路由信息：`{ name, path, meta }` |
| `router` | 精简后的路由代理：`{ push }`，仅用于回写宿主路由 |

> 优化说明：早期版本传递完整的 `RouteLocation` 与 Vue Router 实例；现已改为最小字段与 `push` 代理，避免 `matched` 树和 Router 实例跨 iframe 传递，功能保持不变。

## 7. 性能相关配置

| 配置 | 位置 | 说明 |
| --- | --- | --- |
| 微应用预加载 | `src/shared/utils/prefetch-micro.ts` | 菜单就绪后空闲预加载，缩短首次进入等待 |
| 默认分片 | `build/vite/index.ts` | 保留 Rolldown/Vite 默认分片，实测最大 chunk 约 665KB；强制 `manualChunks` 反而会产生 1.4MB+ 的 UI chunk |
| Chunk 警告阈值 | `build/vite/index.ts` `chunkSizeWarningLimit: 1000` | 超过 1MB 提示，便于发现过大 chunk |
| Hydration 提示关闭 | `build/vite/index.ts` `define` | 项目为纯 SPA，关闭无用的生产提示代码 |
| 移除 console | `.env.production` `VITE_DROP_CONSOLE = true` | 构建时用 `oxc.drop` 移除 `console` / `debugger` |
| gzip 压缩 | `.env.production` `VITE_BUILD_COMPRESS = 'gzip'` | 生成 `.gz` 文件；**需服务端开启 `Content-Encoding: gzip`** |
| 体积分析 | `.env.analyze` + `npm run build:analyze` | 生成 `dist/stats.html` |
| Mock | `.env.production` `VITE_REQUEST_MOCK = true` | 演示站依赖 Mock 提供登录/菜单数据；接入真实后端时改为 `false`，否则登录流程会失效 |

## 8. 常见问题

1. **切换微应用 tab 会不会重新加载？**
   默认 `keepAlive: true`，`micro-router-view.vue` 用 `v-show` 保活，不会重新加载；关闭 `keepAlive` 后非激活 tab 不再渲染。

2. **微应用 tab 开很多会不会占内存？**
   会。每个微应用 tab 是一个独立 iframe 运行时。建议控制 `keepAlive` tab 数量，只给高频页面开启保活。

3. **子应用样式会不会污染主应用？**
   `iframe` 模式天然隔离；主题通过 `theme` / `globalData` 同步。类名前缀可在 `vite.config.ts` 中通过 `prefixCls` / `ant-prefix` 调整。

4. **子应用接口为什么直接请求自己的地址？**
   宿主关闭了请求拦截（`disable-patch-request: true`），子应用 API 基址由 `microUrl + VITE_API_URL_PREFIX` 生成，需保证子应用服务 CORS 允许宿主域名。

5. **为什么生产环境还开着 Mock？**
   当前演示站的登录、用户信息、菜单均由 Mock 提供。接入真实后端时，请同时修改 `.env.production` 中的 `VITE_REQUEST_MOCK = false` 并保证对应接口可用。
