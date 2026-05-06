## 文档说明

- **目的**：沉淀当前项目的接口契约、页面调用链、重复逻辑与复用建议，降低联调和返工成本。
- **扫描范围**：`miniprogram/services`、`miniprogram/pages`、`miniprogram/utils`、`cloudfunctions/*/actions`。
- **更新时间**：2026-05-06（基于当前仓库代码扫描结果）。

---

## 统一调用规范（当前实现）

### 前端到云函数

- **统一入口**：`utils/cloud.js` 的 `callFunction(name, data, options)`。
- **调用方式**：`wx.cloud.callFunction({ name, data })`。
- **错误处理规则**：当返回体中 `result.code !== 0` 时抛错；页面层自行 `try/catch`。

### 返回结构（推荐统一）

- **成功**：`{ code: 0, data: any, message?: string }`
- **失败**：`{ code: -1, message: string }`

> 说明：当前大部分接口符合该结构，但部分 `data` 字段形态不一致（见“契约差异与返工风险”）。

---

## Service 层接口总览（前端可直接调用）

### `flowerService`（已存在）

- **`getList(params)`**：`callFunction('flower', { action: 'list', ...params })`
- **`getDetail(id)`**：`callFunction('flower', { action: 'detail', id })`
- **`search(keyword)`**：`callFunction('flower', { action: 'search', keyword })`
- **`getRecommend()`**：`callFunction('flower', { action: 'recommend' })`

### `plantService`（已存在）

- **`add(data)`**：新增植物
- **`getList()`**：获取我的植物
- **`update(id, data)`**：更新植物
- **`remove(id)`**：删除植物

### `diaryService`（已存在）

- **`add(data)`**：新增日记
- **`getList(plantId)`**：查询日记
- **`remove(id)`**：删除日记（云函数 action 为 `delete`）

### `reminderService`（已存在）

- **`getList()`**：查询提醒
- **`complete(id)`**：完成提醒

### `userService`（已存在）

- **`login(userInfo)`**：登录/注册
- **`updateInfo(data)`**：更新昵称头像
- **`toggleFavorite(flowerId)`**：切换收藏
- **`getFavorites()`**：获取收藏
- **`getStats()`**：获取统计

### `commonService`（当前缺失，B-4 必补）

建议新增 `services/common.js`：

- **`getHomeData()`**：`callFunction('common', { action: 'getHomeData' })`
- **`getDailyTip()`**：`callFunction('common', { action: 'getDailyTip' })`

---

## 云函数接口明细（按业务域）

## `common`

### `action: getHomeData`

- **入参**：无
- **当前返回**：
  - `data.dailyTip`：字符串（最新一条贴士 `content`）
  - `data.recommendList`：花卉数组（最多 6 条）

### `action: getDailyTip`

- **入参**：无
- **返回**：`data` 为贴士对象，兜底为 `{ content: '每天给花花一点爱 🌸' }`

## `flower`

### `action: list`

- **入参**：`page`、`pageSize`、`category`
- **返回**：`data` 为花卉数组（当前不是 `{ list, total }` 结构）

### `action: detail`

- **入参**：`id`（必填）
- **返回**：`data` 为花卉详情对象
- **错误**：缺失 `id` 返回 `code: -1`

### `action: search`

- **入参**：`keyword`
- **逻辑**：按 `name`、`alias` 正则搜索，最多 20 条
- **返回**：`data` 为数组

### `action: recommend`

- **入参**：无
- **当前实现**：固定取前 6 条（TODO：按偏好推荐）

## `plant`

### `action: add`

- **入参**：`flowerId`、`flowerName`、`nickname?`、`location?`、`imageUrl?`
- **返回**：`data._id`

### `action: list`

- **入参**：无
- **逻辑**：按当前用户 `_openid` 查询，按 `createdAt` 倒序

### `action: update`

- **入参**：`id`（必填） + 其他可更新字段
- **返回**：更新成功消息

### `action: remove`

- **入参**：`id`（必填）
- **返回**：删除成功消息

## `diary`

### `action: add`

- **入参**：`plantId`、`content`、`images[]`
- **返回**：`data._id`

### `action: list`

- **入参**：`plantId?`
- **逻辑**：默认按 `_openid` 查询，最多 50 条，按 `createdAt` 倒序

### `action: delete`

- **入参**：`id`（必填）
- **返回**：删除成功消息

## `reminder`

### `action: list`

- **入参**：无
- **逻辑**：查询当前用户 `status='pending'`，按 `remindAt` 升序

### `action: complete`

- **入参**：`id`（必填）
- **逻辑**：更新为 `completed`，写入 `completedAt`

### `action: push`

- **入参**：定时触发器
- **状态**：TODO（仅日志输出，尚未实际推送）

## `user`

### `action: login`

- **入参**：`userInfo`（可选）
- **逻辑**：有则更新登录时间，无则创建用户

### `action: updateInfo`

- **入参**：`nickName`、`avatarUrl`

### `action: toggleFavorite`

- **入参**：`flowerId`
- **返回**：`data.isFavorite`

### `action: getFavorites`

- **入参**：无
- **状态**：TODO（当前仅返回 `favorites` id 数组，未关联花卉详情）

### `action: getStats`

- **入参**：无
- **返回**：`plantCount`、`diaryCount`、`favoriteCount`

---

## 页面调用链与对接状态

| 页面 | 当前数据源 | 已接 Service | 对接状态 |
|---|---|---|---|
| `index/index` | Mock | 否 | **待做（B-5）** |
| `encyclopedia/index` | 云函数 | `flowerService.getList` | **已接** |
| `encyclopedia/detail` | 云函数 | `flowerService.getDetail` | **已接** |
| `garden/index` | Mock | 否 | 待做（B-7） |
| `garden/plant-detail` | Mock | 否 | 待做（B-7） |
| `garden/diary-edit` | 本地表单 | 否（TODO） | 待做（B-7） |
| `reminder/index` | Mock | 否 | 待做（B-8） |
| `profile/index` | Mock + `wx.getUserProfile` | 否 | 待做（B-9） |
| `guide/index` | Mock | 否 | 未规划 API |
| `guide/detail` | Mock | 否 | 未规划 API |

---

## 重复调用/重复逻辑清单（重点，便于复用）

## 1) 云函数入口重复模板（6 处）

每个 `cloudfunctions/*/index.js` 都重复以下逻辑：

- `cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })`
- `const actions = {...}` 路由分发
- 未知 action 统一报错
- `try/catch` 返回 `{ code: -1, message }`

**建议复用**：抽公共工厂，例如 `createActionHandler(actions, tag)`。

## 2) 页面层重复的加载流程（多处）

常见模式：

- `this.setData({ loading: true })`
- `try { await service... } catch { wx.showToast(...) } finally { loading: false }`

**建议复用**：抽页面 mixin/helper，如 `withLoading(asyncFn)`。

## 3) 下拉刷新重复流程（多处）

常见模式：

- 拉数据
- `wx.stopPullDownRefresh()`

**建议复用**：封装 `runPullDownRefresh(asyncTask)`。

## 4) ID 非空校验重复（多处 action）

`detail/remove/update/complete/delete` 都手工写了“缺少 ID”。

**建议复用**：抽 `assertRequired(event, ['id'])`。

## 5) OPENID 获取与按用户查询重复（多处 action）

- `const openid = cloud.getWXContext().OPENID`
- `where({ _openid: openid })`

**建议复用**：抽 `getOpenId(cloud)` 与 `byOpenId(db, collection, openid)`。

## 6) 图片选择/上传逻辑存在重复风险

- `utils/image.js` 已有 `chooseImages/uploadImages`
- `garden/diary-edit.js` 仍手写 `wx.chooseMedia` + TODO 上传

**建议复用**：`diary-edit` 直接改为调用 `image.js`，减少后续重复实现。

---

## 契约差异与返工风险（必须统一）

## 1) `common.getHomeData` 字段名与旧文档示例不一致

- **当前代码**：`data.dailyTip`（字符串） + `data.recommendList`（数组）
- **旧示例常见写法**：`todayRecommend`、`dailyTip`（对象）

**建议统一方案（二选一）**：

- **方案 A（改后端）**：返回 `todayRecommend`、`dailyTip` 对象等聚合结构。
- **方案 B（改前端）**：首页固定按当前返回解析，并更新文档全员同步。

## 2) `flower.list` 返回结构未带分页元信息

- 当前仅返回数组 `data`
- 若后续做 B-10 分页，建议改成 `data: { list, page, pageSize, total, hasMore }`

## 3) `user.getFavorites` 尚未返回花卉详情

- 当前仅返回收藏 ID 列表
- 收藏页若需要卡片展示，建议直接返回花卉对象列表

## 4) 鉴权边界未完全收口

部分 `update/remove/delete` action 未校验文档归属（仅按 doc id 操作）。

**建议**：更新/删除前补 `_openid` 归属校验，避免越权风险。

---

## B-4 / B-5 直接执行清单（按此做最省返工）

- **B-4**：创建 `services/common.js`，补 `getHomeData/getDailyTip`。
- **B-5**：`pages/index/index.js` 改为调用 `commonService.getHomeData()`，去掉首页 Mock。
- **联调验收**：
  - 首页能展示数据库真实推荐花卉
  - 下拉刷新后数据会更新
  - 接口失败有 `toast`，页面不白屏

---

## 推荐提交信息

- `feat(service): 新增 commonService 并补齐首页公共接口调用`
- `feat(page): 首页对接 common.getHomeData 真实数据`
- `docs(api): 新增接口与复用清单，沉淀调用链与返工风险`
