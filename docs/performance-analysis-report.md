# Pro Design Admin 项目性能分析报告

> 分析日期：2026-11-27  
> 分析对象：`pro-design-admin`（Vue 3 + Vite 8 + micro-app 主子应用通用项目）  
> 分析基线：已完成上一轮性能优化后的代码状态  
> 数据来源：本地 `npm run build` 实测产物 + 源码静态分析（非浏览器运行时埋点）

---

## 1. 执行摘要

| 维度 | 结论 | 状态 |
| --- | --- | --- |
| 构建产物 | 72 个 JS chunk + 12 个 CSS，原始合计约 3.55MB，gzip 合计约 1.12MB；最大 chunk 650KB | 可控 |
| 首屏加载 | `index.html` 仅引入 1 个入口脚本，其余由入口静态/动态依赖触发；关键 chunk 偏大 | 有优化空间 |
| 路由加载 | 34 处动态 `import()`，页面级懒加载已覆盖 | 良好 |
| 微前端框架 | `@micro-zoe/micro-app@1.0.0-rc.32`，iframe 沙箱 + native 路由 | 隔离强、开销高 |
| 微应用预加载 | 菜单就绪后空闲预加载，最多 5 个 | 已优化 |
| 主子通信 | 已去掉 Router 实例与完整 RouteLocation，改为最小字段 + `push` 代理 | 已优化 |
| 依赖共享 | 主子应用无运行时共享，每个子应用自带框架副本 | 未解决 |
| 生产 Mock | 仍开启，约 67KB 原始 / 24KB gzip 常驻生产包 | 需业务决策 |

**总体评价**：当前架构属于“功能完整、关键路径已做基础治理”的状态。构建产物体积处于中后台项目正常区间，gzip 压缩率约 32%；微前端侧已完成预加载和通信瘦身两个高收益改动。剩余主要矛盾集中在**首屏关键 chunk 偏大**和**iframe 多实例常驻内存**，两者都属于需要业务权衡的范畴。

---

## 2. 分析方法与环境

| 项目 | 值 |
| --- | --- |
| Node.js | v22.15.0 |
| npm | 10.9.2 |
| Vite | 8.4.0（Rolldown 构建） |
| 构建命令 | `npm run build`（`vue-tsc -b && vite build`） |
| 构建耗时 | 约 2.5s |
| 构建模式 | production |
| 产物目录 | `dist/`，同时生成 `dist.zip` 与 `.gz` 文件 |

说明：本报告中的体积均为构建产物实测值；微前端运行时的内存、首屏耗时等指标为**基于代码结构的定性分析**，未接入浏览器 Profiler 实测。

---

## 3. 构建产物分析

### 3.1 总体指标

| 指标 | 数值 |
| --- | --- |
| JS chunk 数量 | 72 |
| CSS 文件数量 | 12 |
| JS 原始体积 | 3,430.5 KB |
| CSS 原始体积 | 121.5 KB |
| JS gzip 体积 | 1,096.6 KB |
| CSS gzip 体积 | 20.8 KB |
| gzip 文件数量 | 62（JS 56 + CSS 6） |
| 平均 gzip 压缩率 | 约 32% |
| 最大 JS chunk | 649.9 KB（gzip 219.6 KB） |

> gzip 文件少于原始文件是因为构建配置 `threshold: 1024`，小于 1KB 的资源不生成 `.gz`。

### 3.2 最大的 12 个 JS chunk

| 文件 | 原始体积 | 说明 |
| --- | --- | --- |
| `common-*.js` | 649.9 KB | 多入口共享代码，首屏强依赖 |
| `form-*.js` | 449.6 KB | 表单页（动态加载） |
| `styles-*.js` | 434.8 KB | 样式/主题相关 JS，首屏强依赖 |
| `index-*.js` | 373.4 KB | 应用入口，首屏强依赖 |
| `table-*.js` | 227.2 KB | 表格页（动态加载） |
| `icons-*.js` | 156.8 KB | 图标集合 |
| `logo_small-*.js` | 126.7 KB | 内联图标资源 |
| `auth-*.js` | 115.9 KB | 登录鉴权页 |
| `modal-*.js` | 89.5 KB | 弹窗组件 |
| `input-*.js` | 77.8 KB | 输入组件 |
| `RightOutlined-*.js` | 70.9 KB | 单个图标 chunk |
| `basic-*.js` | 67.0 KB | 基础布局 |

**解读**：首屏关键路径主要由 `index`（373KB）+ `styles`（435KB）+ `common`（650KB）构成，gzip 合计约 592KB。表单、表格等大 chunk 由路由懒加载隔离，不会阻塞首屏，这是当前分包策略的合理之处。

### 3.3 首屏入口

`dist/index.html` 中只有：

- 1 个入口 `<script type="module" src="/assets/index-*.js">`
- 1 个 `modulepreload`：`rolldown-runtime`
- 1 段注入的加载动画脚本

没有 CDN 外链、没有多余的同步脚本。`index.html` 体积约 2.5KB（gzip 1.1KB），已足够精简。缺少 `preconnect` / `dns-prefetch` 是因为项目没有外部 CDN 依赖，属于合理省略。

---

## 4. 已实施优化及效果

| 优化项 | 实现位置 | 效果 |
| --- | --- | --- |
| 微应用空闲预加载 | `src/shared/utils/prefetch-micro.ts` + `src/router/guard.ts` | 菜单就绪后预取前 5 个微应用资源，缩短首次进入等待；不阻塞当前交互 |
| 通信数据瘦身 | `src/layouts/micro/micro-view.vue` | `route` 仅保留 `{name, path, meta}`，`router` 仅保留 `{push}`，去掉 `matched` 树与 Router 实例，降低跨 iframe 传输成本 |
| 关闭 hydration 提示 | `build/vite/index.ts` | 纯 SPA 无需 SSR 差异提示，减少无用生产代码 |
| 收紧 chunk 告警 | `build/vite/index.ts` | 阈值 2000KB → 1000KB，实测最大 chunk 650KB，无告警 |
| 保留默认分片 | `build/vite/index.ts` | 曾尝试 `manualChunks` 强制分组，反而产生 1.47MB 的 UI chunk，已回退；默认分片最大 650KB 更优 |
| 使用文档 | `docs/micro-frontend-guide.md` | 固化接入方式、通信协议与性能配置说明 |

---

## 5. 微前端运行时性能分析

### 5.1 架构模型

```
主应用（基座）
├─ 普通页面：Vue Router + KeepAlive 组件缓存
├─ iframe 页面：IFrameRouterView
└─ 微应用页面：MicroRouterView → MicroView → <micro-app iframe>
                                              ├─ 独立 JS 运行时（Vue + Pinia + i18n）
                                              ├─ data 通信（下行）
                                              └─ globalData 广播（主题）
```

关键配置：`bootstrap.ts` 中 `microApp.start({ 'disable-memory-router': true, 'disable-patch-request': true, 'router-mode': 'native', iframe })`。

### 5.2 优势

1. **双入口按需加载**：主应用模式加载 `bootstrap.ts`（8.9KB / gzip 3.7KB），子应用模式加载 `micro.ts`（5.1KB / gzip 2.0KB），模式之间不交叉加载。
2. **预加载已就位**：`preFetch` 在浏览器空闲时执行，最多 5 个，避免一次性拉起所有子应用。
3. **通信载荷已瘦身**：去掉了 Router 实例与完整路由对象，只传业务必需字段。
4. **生命周期对齐**：`useApplication` 让子应用同时支持主子两种 activated/deactivated 语义，便于业务暂停轮询和动画。

### 5.3 现存瓶颈

| 优先级 | 瓶颈 | 影响 | 是否功能权衡 |
| --- | --- | --- | --- |
| P0 | 多 iframe 常驻 | `v-show` 保活使每个微应用 tab 的 Vue 运行时、定时器、监听器持续存在；内存随 tab 数线性增长 | 是（销毁 = 丢状态） |
| P0 | 生产 Mock 常驻 | `mock-*.js` 67KB / gzip 24KB 进入生产包，且接口有 500ms 模拟延迟 | 是（依赖后端接口） |
| P1 | 无跨应用依赖共享 | 每个子应用重复打包 Vue / Router / Pinia / UI 库，iframe 隔离使运行时共享不可行 | 部分 |
| P1 | 首屏关键 chunk 偏大 | gzip 合计约 592KB，弱网下首屏解析成本明显 | 否 |
| P1 | 双向路由同步 | 子应用路由变化 → `props.router.push` → 宿主 data 重新下发 → 子应用响应，链路较长 | 否 |
| P2 | 主题全局广播 | `setGlobalData({theme})` 推送给所有子应用；每次 data 下发子应用都会做 `isEqual` 比对 | 否 |
| P2 | 存储加密 | `secure-ls` 同步加解密偏好与 token，`tabbar.persist` 开启时读写更频繁 | 否 |
| P2 | PWA 关闭 | 重复访问无 Service Worker 缓存收益 | 否 |

### 5.4 关于依赖共享的判断

项目未使用 Module Federation，也没有 `externals` / `shared` 配置。iframe 沙箱天然隔离 JS 作用域，因此**运行时共享 Vue 实例不可行**；可行的折中是通过 CDN 让多个子应用复用 HTTP 缓存，但这会引入外部依赖和版本一致性风险。考虑到当前 gzip 总量约 1.1MB、最大 chunk 650KB，该优化的收益不足以抵消复杂度，暂不建议实施。

---

## 6. 后续优化建议

### 6.1 低风险（可立即实施）

1. **按需抑制 Mock 延迟**：生产环境将 `src/mock/index.ts` 的 `delayResponse` 从 500ms 降为 0，或直接关闭 Mock（需后端接口就绪）。这是当前唯一能直接改善接口体感的改动。
2. **限制预加载数量**：`MAX_PREFETCH_COUNT` 当前为 5，如微应用较多可按用户角色或访问频率动态调整，避免无效预取。
3. **主题广播去重**：在 `bootstrap.ts` 的 `watch(() => preferences.theme, ...)` 中加入 `isEqual` 比对，避免重复下发。
4. **开启 PWA**：`vite-plugin-pwa` 已在依赖中，`.env.production` 中 `VITE_PWA = false`；对重复访问场景可显著改善资源加载，但需评估缓存更新策略。

### 6.2 中等风险（需观察）

1. **首屏关键 chunk 拆分**：`styles-*.js`（435KB）与 `common-*.js`（650KB）是首屏主要负担。可分析其依赖来源，把非首屏必需的组件下沉到动态 chunk。注意：此前强制 `manualChunks` 已证明会劣化，应基于模块依赖图做精细化拆分。
2. **图标按需化**：`icons-*.js`（157KB）与多个图标 chunk 说明图标存在重复打包，可用 `unplugin-icons` 或构建期收集实际使用的图标集合。

### 6.3 需业务权衡

1. **微应用 tab 数量上限**：对 `keepAlive` 的微应用 tab 设置上限（如 5 个），超出后销毁最久未激活的实例。收益是内存可控，代价是重新进入时需重新加载。
2. **iframe 模式替换**：对完全可信的内部子应用可改用 shadow DOM 模式，省掉整层 JS 运行时。代价是隔离性下降、样式冲突风险上升。
3. **依赖外链化**：通过 CDN 共享框架副本。代价是引入外部可用性依赖与版本一致性维护成本。

---

## 7. 结论

- 当前构建产物处于健康区间：**约 3.55MB 原始 / 1.12MB gzip**（其中 JS 压缩率约 32%），最大 chunk 650KB，无体积告警。
- 页面级懒加载、双入口按需加载、预加载、通信瘦身四项机制已到位，微前端关键路径的基础性能治理完成。
- 下一阶段收益最高的两项是**处理生产 Mock**与**控制 iframe 常驻数量**；前者需要后端接口就绪，后者需要产品侧接受状态丢失的权衡。
- 不建议为“共享依赖”引入 Module Federation 或强制 CDN：在 iframe 隔离模型和当前体积水平下，投入产出比偏低。

> 本报告基于静态产物与源码分析。若需进一步定位运行时瓶颈（如 TTI、长任务、内存曲线），建议在 Chrome DevTools Performance / Memory 面板中采集真实用户路径数据后再做定量结论。
