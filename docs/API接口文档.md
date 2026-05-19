# 养花呀 - API 接口文档

> **本文档由脚本自动生成，请勿手动修改**
>
> **生成时间**：2026/5/19 11:49:37
>
> **文档版本**：1.0.0
>
> **云环境 ID**：cloud1-d1gjubt747d28d4ac
>
> **说明**：本文档按 REST API 风格描述，实际调用方式为 `wx.cloud.callFunction`（无真实 HTTP 域名）

---

## 目录

- [文档说明](#文档说明)
- [请求头说明](#请求头说明)
- [接口安全说明](#接口安全说明)
- [接口版本管理](#接口版本管理)
- [变更记录](#变更记录)
- [commonService](#commonservice)
  - [getDailyTip](#getdailytip)
  - [getHomeData](#gethomedata)
- [diaryService](#diaryservice)
  - [add](#add)
  - [delete](#delete)
  - [detail](#detail)
  - [list](#list)
  - [update](#update)
- [flowerService](#flowerservice)
  - [detail](#detail)
  - [getCategories](#getcategories)
  - [list](#list)
  - [recommend](#recommend)
  - [search](#search)
- [plantService](#plantservice)
  - [add](#add)
  - [detail](#detail)
  - [list](#list)
  - [remove](#remove)
  - [update](#update)
- [reminderService](#reminderservice)
  - [add](#add)
  - [complete](#complete)
  - [delete](#delete)
  - [list](#list)
  - [push](#push)
  - [update](#update)
- [userService](#userservice)
  - [getFavorites](#getfavorites)
  - [getInfo](#getinfo)
  - [getStats](#getstats)
  - [login](#login)
  - [toggleFavorite](#togglefavorite)
  - [updateInfo](#updateinfo)
- [错误码总表](#错误码总表)

---

## 文档说明

本文档描述「养花呀」微信小程序的全部后端接口。

**实际调用方式**：所有接口均通过微信小程序云函数调用，格式为：

```javascript
wx.cloud.callFunction({
  name: '云函数名',
  data: { action: '操作名', ...params }
})
```

文档中接口地址以 REST 风格书写，便于前端理解接口语义。

---

## 请求头说明

> 云函数调用无真实 HTTP 请求头，以下为等效概念说明。

| 请求头 | 说明 | 示例值 |
|--------|------|--------|
| `Content-Type` | 请求体格式 | `application/json` |
| `Authorization` | 用户身份（由微信自动注入 `_openid`，无需前端传递） | `-` |
| `X-CloudBase-Env` | 云环境 ID | `cloud1-d1gjubt747d28d4ac` |
| `X-Requested-With` | 请求来源 | `miniprogram` |

---

## 接口安全说明

### 访问授权
- 所有云函数默认开启登录态校验，微信会自动在每个调用中注入用户的 `_openid`
- 服务端从 `context.OPENID` 获取用户身份，前端无法伪造
- 涉及用户数据的接口（植物、日记、收藏），服务端会校验数据归属

### 数据传输安全
- 小程序与云函数之间的通信使用微信私有协议加密传输
- 不支持明文 HTTP 调用

### 注入防护
- 使用微信云数据库 SDK（服务端）进行数据库操作，自动参数化，天然防止 NoSQL 注入
- 不使用字符串拼接构造查询条件

### 敏感数据
- 用户 `_openid` 由服务端自动注入，前端不可传递或修改
- 用户昵称、头像等个人信息仅用于展示，不涉及第三方共享
- 植物/日记数据按 `_openid` 隔离，用户只能访问自己的数据

---

## 接口版本管理

本文档采用语义化版本号：**1.0.0**（主版本.次版本.修订号）

- **主版本号**：不兼容的接口变更时递增
- **次版本号**：新增接口或字段（向后兼容）时递增
- **修订号**：接口文档修正或错误码补充（向后兼容）时递增

当前所有接口路径为 `/cloud/{function}/{action}`，版本号体现在文档版本中。
后续若发生不兼容变更，将在接口地址中加入版本号（如 `/cloud/v2/{function}/{action}`）。

---

## 变更记录

| 日期 | 变更描述 | 操作人 |
|------|----------|--------|
| 2026-05-14 | 创建接口文档 V2，支持完整 REST 风格文档 | AI Assistant |
| 2026-05-18 | 脚本改为扫描后端云函数，前端代码零改动 | AI Assistant |
| 2026-05-19 | 修复 reminder complete/list 字段名 bug；修正 plant/detail·diary/update·flower/recommend·user/getInfo·user/updateInfo JSDoc 与代码对齐 | AI Assistant |

---

## commonService

> 文件：`cloudfunctions/common/actions/*.js`

### getDailyTip

**功能**：获取每日养花小贴士

**接口地址**：`/cloud/common/getDailyTip`

**请求方法**：`GET`

> 实际调用：`wx.cloud.callFunction({ name: 'common', data: { action: 'getDailyTip' })`

**请求参数**：无

**响应说明**：

所有接口返回格式统一为：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code`：状态码，`0` 表示成功，非 `0` 表示失败（详见错误码总表）
- `message`：提示信息，成功时为 `"success"`，失败时为错误描述
- `data`：业务数据，成功时返回，失败时为 `null` 或不返回

**响应参数（`data` 结构）**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| content | 贴士内容 | String | 示例：每日养花技巧；绿萝喜欢湿润环境，夏季可每天浇水... | 是 |

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'common',
data: { action: 'getDailyTip' }
})
```

**接口测试**：

```javascript
// 在小程序页面 JS 中调用
wx.cloud.callFunction({
  name: 'common',
  data: {
    action: 'getDailyTip'
  }
}).then(res => {
  console.log('成功：', res.result)
}).catch(err => {
  console.error('失败：', err)
})
```

> **预期返回**：参考上方「正确返回示例」

---

### getHomeData

**功能**：获取首页聚合数据（每日贴士 + 推荐花草）

**接口地址**：`/cloud/common/getHomeData`

**请求方法**：`GET`

> 实际调用：`wx.cloud.callFunction({ name: 'common', data: { action: 'getHomeData' })`

**请求参数**：无

**响应说明**：

所有接口返回格式统一为：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code`：状态码，`0` 表示成功，非 `0` 表示失败（详见错误码总表）
- `message`：提示信息，成功时为 `"success"`，失败时为错误描述
- `data`：业务数据，成功时返回，失败时为 `null` 或不返回

**响应参数（`data` 结构）**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| dailyTip | 每日贴士内容 | String | 示例：今日养花小贴士；绿萝喜欢湿润环境... | 是 |
| recommendList | 推荐花卉数组 | Array<Object> | [{"_id":"flower_001","name":"绿萝",...}] | 是 |

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'common',
data: { action: 'getHomeData' }
})
```

**接口测试**：

```javascript
// 在小程序页面 JS 中调用
wx.cloud.callFunction({
  name: 'common',
  data: {
    action: 'getHomeData'
  }
}).then(res => {
  console.log('成功：', res.result)
}).catch(err => {
  console.error('失败：', err)
})
```

> **预期返回**：参考上方「正确返回示例」

---

## diaryService

> 文件：`cloudfunctions/diary/actions/*.js`

### add

**功能**：添加植物生长日记

**接口地址**：`/cloud/diary/add`

**请求方法**：`POST`

> 实际调用：`wx.cloud.callFunction({ name: 'diary', data: { action: 'add', ...params })`

**请求参数**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| plantId | 植物ID | String | 格式：String；示例：plant-abc123；必填 | 是 |
| content | 日记内容 | String | 格式：String；示例：今天给绿萝浇了水；必填 | 是 |
| images | 图片列表 | Array | 格式：Array<String>；示例：[]；可选，默认[] | 否 |

**响应说明**：

所有接口返回格式统一为：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code`：状态码，`0` 表示成功，非 `0` 表示失败（详见错误码总表）
- `message`：提示信息，成功时为 `"success"`，失败时为错误描述
- `data`：业务数据，成功时返回，失败时为 `null` 或不返回

**响应参数（`data` 结构）**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| _id | 新日记ID | String | diary-abc123 | 是 |

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 |
|--------|----------|
| 1002 | 缺少必填参数 |

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'diary',
data: { action: 'add', plantId: 'plant-abc123', content: '今天给绿萝浇了水', images: [] }
})
```

**接口测试**：

```javascript
// 在小程序页面 JS 中调用
wx.cloud.callFunction({
  name: 'diary',
  data: {
    action: 'add',
    plantId: 'plant-abc123',
    content: '今天给绿萝浇了水',
    images: '[]'
  }
}).then(res => {
  console.log('成功：', res.result)
}).catch(err => {
  console.error('失败：', err)
})
```

> **预期返回**：参考上方「正确返回示例」

---

### delete

**功能**：删除日记

**接口地址**：`/cloud/diary/delete`

**请求方法**：`DELETE`

> 实际调用：`wx.cloud.callFunction({ name: 'diary', data: { action: 'delete', ...params })`

**请求参数**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| id | 日记ID | String | 格式：String；示例：diary-abc123；必填 | 是 |

**响应说明**：

所有接口返回格式统一为：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code`：状态码，`0` 表示成功，非 `0` 表示失败（详见错误码总表）
- `message`：提示信息，成功时为 `"success"`，失败时为错误描述
- `data`：业务数据，成功时返回，失败时为 `null` 或不返回

**响应参数（`data` 结构）**：

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 |
|--------|----------|
| 1002 | 缺少必填参数 |

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'diary',
data: { action: 'delete', id: 'diary-abc123' }
})
```

**接口测试**：

```javascript
// 在小程序页面 JS 中调用
wx.cloud.callFunction({
  name: 'diary',
  data: {
    action: 'delete',
    id: 'diary-abc123'
  }
}).then(res => {
  console.log('成功：', res.result)
}).catch(err => {
  console.error('失败：', err)
})
```

> **预期返回**：参考上方「正确返回示例」

---

### detail

**功能**：获取单条日记详情

**接口地址**：`/cloud/diary/detail`

**请求方法**：`GET`

> 实际调用：`wx.cloud.callFunction({ name: 'diary', data: { action: 'detail', ...params })`

**请求参数**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| id | 日记ID | String | 格式：String；示例：diary-abc123；必填 | 是 |

**响应说明**：

所有接口返回格式统一为：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code`：状态码，`0` 表示成功，非 `0` 表示失败（详见错误码总表）
- `message`：提示信息，成功时为 `"success"`，失败时为错误描述
- `data`：业务数据，成功时返回，失败时为 `null` 或不返回

**响应参数（`data` 结构）**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| _id | 日记ID | String | diary-abc123 | 是 |
| plantId | 植物ID | String | plant-abc123 | 是 |
| content | 日记内容 | String | 今天给绿萝浇了水 | 是 |
| images | 图片列表 | Array<String> | - | 是 |
| createdAt | 创建时间 | Object | 服务端时间对象 | 是 |
| updatedAt | 更新时间（编辑后才有） | Object | 服务端时间对象 | 是 |

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 |
|--------|----------|
| 1002 | 缺少必填参数 |
| 3001 | 数据不存在 |

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'diary',
data: { action: 'detail', id: 'diary-abc123' }
})
```

**接口测试**：

```javascript
// 在小程序页面 JS 中调用
wx.cloud.callFunction({
  name: 'diary',
  data: {
    action: 'detail',
    id: 'diary-abc123'
  }
}).then(res => {
  console.log('成功：', res.result)
}).catch(err => {
  console.error('失败：', err)
})
```

> **预期返回**：参考上方「正确返回示例」

---

### list

**功能**：获取日记列表（可按植物筛选）

**接口地址**：`/cloud/diary/list`

**请求方法**：`GET`

> 实际调用：`wx.cloud.callFunction({ name: 'diary', data: { action: 'list', ...params })`

**请求参数**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| plantId | 植物ID筛选 | String | 格式：String；示例：plant-abc123；可选，不传则返回全部 | 否 |

**响应说明**：

所有接口返回格式统一为：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code`：状态码，`0` 表示成功，非 `0` 表示失败（详见错误码总表）
- `message`：提示信息，成功时为 `"success"`，失败时为错误描述
- `data`：业务数据，成功时返回，失败时为 `null` 或不返回

**响应参数（`data` 结构）**：

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'diary',
data: { action: 'list', plantId: 'plant-abc123' }
})
```

**接口测试**：

```javascript
// 在小程序页面 JS 中调用
wx.cloud.callFunction({
  name: 'diary',
  data: {
    action: 'list',
    plantId: 'plant-abc123'
  }
}).then(res => {
  console.log('成功：', res.result)
}).catch(err => {
  console.error('失败：', err)
})
```

> **预期返回**：参考上方「正确返回示例」

---

### update

**功能**：编辑日记

**接口地址**：`/cloud/diary/update`

**请求方法**：`PUT`

> 实际调用：`wx.cloud.callFunction({ name: 'diary', data: { action: 'update', ...params })`

**请求参数**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| id | 日记ID | String | 格式：String；示例：diary-abc123；必填 | 是 |
| content | 日记内容 | String | 格式：String；示例：今天给绿萝浇了水；可选 | 否 |
| images | 图片列表 | Array | 格式：Array<String>；示例：[]；可选 | 否 |

**响应说明**：

所有接口返回格式统一为：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code`：状态码，`0` 表示成功，非 `0` 表示失败（详见错误码总表）
- `message`：提示信息，成功时为 `"success"`，失败时为错误描述
- `data`：业务数据，成功时返回，失败时为 `null` 或不返回

**响应参数（`data` 结构）**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| _id | 日记ID | String | diary-abc123 | 是 |
| plantId | 植物ID | String | plant-abc123 | 是 |
| content | 日记内容 | String | 今天给绿萝浇了水 | 是 |
| images | 图片列表 | Array<String> | - | 是 |
| createdAt | 创建时间 | Object | 服务端时间对象 | 是 |
| updatedAt | 更新时间 | Object | 服务端时间对象 | 是 |

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 |
|--------|----------|
| 1002 | 缺少必填参数 |
| 3001 | 数据不存在 |

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'diary',
data: { action: 'update', id: 'diary-abc123', content: '更新后的内容' }
})
```

**接口测试**：

```javascript
// 在小程序页面 JS 中调用
wx.cloud.callFunction({
  name: 'diary',
  data: {
    action: 'update',
    id: 'diary-abc123',
    content: '今天给绿萝浇了水',
    images: '[]'
  }
}).then(res => {
  console.log('成功：', res.result)
}).catch(err => {
  console.error('失败：', err)
})
```

> **预期返回**：参考上方「正确返回示例」

---

## flowerService

> 文件：`cloudfunctions/flower/actions/*.js`

### detail

**功能**：获取花卉详情

**接口地址**：`/cloud/flower/detail`

**请求方法**：`GET`

> 实际调用：`wx.cloud.callFunction({ name: 'flower', data: { action: 'detail', ...params })`

**请求参数**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| id | 花卉ID | String | 格式：String；示例：flower_001；必填 | 是 |

**响应说明**：

所有接口返回格式统一为：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code`：状态码，`0` 表示成功，非 `0` 表示失败（详见错误码总表）
- `message`：提示信息，成功时为 `"success"`，失败时为错误描述
- `data`：业务数据，成功时返回，失败时为 `null` 或不返回

**响应参数（`data` 结构）**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| _id | 花卉ID | String | flower_001 | 是 |
| name | 花卉名称 | String | 绿萝 | 是 |
| scientificName | 学名 | String | Epipremnum aureum | 是 |
| alias | 别名列表 | Array<String> | ["魔鬼藤","黄金葛"] | 是 |
| family | 科属 | String | 天南星科 | 是 |
| coverImage | 封面图 | String | cloud://... | 是 |
| category | 分类 | Number | 1=观叶,2=观花,3=多肉,4=果蔬 | 是 |
| plantType | 植物类型 | String | 藤本 | 是 |
| difficulty | 养护难度 | Number | 1~5 | 是 |
| light | 光照需求 | String | 耐阴，散射光 | 是 |
| temperature | 适宜温度 | String | 15-30°C | 是 |
| waterDays | 浇水间隔天数 | Number | 5 | 是 |
| fertilizeDays | 施肥间隔天数 | Number | 20 | 是 |
| season | 适宜季节 | Array<String> | ["春","夏","秋"] | 是 |
| isIndoor | 是否室内 | Boolean | true | 是 |
| description | 描述 | String | 绿萝属于麒麟叶属植物... | 是 |
| flowerLanguage | 花语 | String | 守望幸福 | 是 |
| tags | 标签 | Array<String> | ["室内","耐阴","净化空气"] | 是 |
| isPublished | 是否发布 | Boolean | true | 是 |
| sortOrder | 排序权重 | Number | 1 | 是 |

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 |
|--------|----------|
| 1002 | 缺少必填参数 |

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'flower',
data: { action: 'detail', id: 'flower_001' }
})
```

**接口测试**：

```javascript
// 在小程序页面 JS 中调用
wx.cloud.callFunction({
  name: 'flower',
  data: {
    action: 'detail',
    id: 'flower_001'
  }
}).then(res => {
  console.log('成功：', res.result)
}).catch(err => {
  console.error('失败：', err)
})
```

> **预期返回**：参考上方「正确返回示例」

---

### getCategories

**功能**：获取花卉分类列表

**接口地址**：`/cloud/flower/getCategories`

**请求方法**：`GET`

> 实际调用：`wx.cloud.callFunction({ name: 'flower', data: { action: 'getCategories' })`

**请求参数**：无

**响应说明**：

所有接口返回格式统一为：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code`：状态码，`0` 表示成功，非 `0` 表示失败（详见错误码总表）
- `message`：提示信息，成功时为 `"success"`，失败时为错误描述
- `data`：业务数据，成功时返回，失败时为 `null` 或不返回

**响应参数（`data` 结构）**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| data.list | 数据列表 | Array | - | 是 |

**list 元素结构**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| id | 分类ID | Number | 示例：1；1=观叶,2=观花,3=多肉,4=果蔬 | 是 |
| name | 分类名称 | String | 示例：观叶植物；1=观叶植物,2=观花植物,3=多肉植物,4=果蔬 | 是 |

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'flower',
data: { action: 'getCategories' }
})
```

**接口测试**：

```javascript
// 在小程序页面 JS 中调用
wx.cloud.callFunction({
  name: 'flower',
  data: {
    action: 'getCategories'
  }
}).then(res => {
  console.log('成功：', res.result)
}).catch(err => {
  console.error('失败：', err)
})
```

> **预期返回**：参考上方「正确返回示例」

---

### list

**功能**：获取花卉列表（支持分页和分类筛选）

**接口地址**：`/cloud/flower/list`

**请求方法**：`GET`

> 实际调用：`wx.cloud.callFunction({ name: 'flower', data: { action: 'list', ...params })`

**请求参数**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| page | 页码 | Number | 取值范围：1~100；格式：整数；示例：1；默认第1页 | 是 |
| pageSize | 每页数量 | Number | 取值范围：1~100；格式：整数；示例：20；默认20条 | 是 |
| category | 分类ID | Number | 取值范围：1~4；格式：整数；示例：2；1=观叶植物,2=观花植物,3=多肉植物,4=果蔬；不传则返回全部分类 | 否 |

**响应说明**：

所有接口返回格式统一为：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code`：状态码，`0` 表示成功，非 `0` 表示失败（详见错误码总表）
- `message`：提示信息，成功时为 `"success"`，失败时为错误描述
- `data`：业务数据，成功时返回，失败时为 `null` 或不返回

**响应参数（`data` 结构）**：

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'flower',
data: { action: 'list', page: 1, pageSize: 20, category: 2 }
})
```

**接口测试**：

```javascript
// 在小程序页面 JS 中调用
wx.cloud.callFunction({
  name: 'flower',
  data: {
    action: 'list',
    page: 1,
    pageSize: 20,
    category: 2
  }
}).then(res => {
  console.log('成功：', res.result)
}).catch(err => {
  console.error('失败：', err)
})
```

> **预期返回**：参考上方「正确返回示例」

---

### recommend

**功能**：获取推荐花卉（返回前6条，按数据库自然顺序）

**接口地址**：`/cloud/flower/recommend`

**请求方法**：`GET`

> 实际调用：`wx.cloud.callFunction({ name: 'flower', data: { action: 'recommend' })`

**请求参数**：无

**响应说明**：

所有接口返回格式统一为：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code`：状态码，`0` 表示成功，非 `0` 表示失败（详见错误码总表）
- `message`：提示信息，成功时为 `"success"`，失败时为错误描述
- `data`：业务数据，成功时返回，失败时为 `null` 或不返回

**响应参数（`data` 结构）**：

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'flower',
data: { action: 'recommend' }
})
```

**接口测试**：

```javascript
// 在小程序页面 JS 中调用
wx.cloud.callFunction({
  name: 'flower',
  data: {
    action: 'recommend'
  }
}).then(res => {
  console.log('成功：', res.result)
}).catch(err => {
  console.error('失败：', err)
})
```

> **预期返回**：参考上方「正确返回示例」

---

### search

**功能**：搜索花卉（按名称或别名模糊匹配）

**接口地址**：`/cloud/flower/search`

**请求方法**：`GET`

> 实际调用：`wx.cloud.callFunction({ name: 'flower', data: { action: 'search', ...params })`

**请求参数**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| keyword | 搜索关键词 | String | 格式：String；示例：绿萝；可选，为空时返回空数组 | 否 |

**响应说明**：

所有接口返回格式统一为：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code`：状态码，`0` 表示成功，非 `0` 表示失败（详见错误码总表）
- `message`：提示信息，成功时为 `"success"`，失败时为错误描述
- `data`：业务数据，成功时返回，失败时为 `null` 或不返回

**响应参数（`data` 结构）**：

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'flower',
data: { action: 'search', keyword: '绿萝' }
})
```

**接口测试**：

```javascript
// 在小程序页面 JS 中调用
wx.cloud.callFunction({
  name: 'flower',
  data: {
    action: 'search',
    keyword: '绿萝'
  }
}).then(res => {
  console.log('成功：', res.result)
}).catch(err => {
  console.error('失败：', err)
})
```

> **预期返回**：参考上方「正确返回示例」

---

## plantService

> 文件：`cloudfunctions/plant/actions/*.js`

### add

**功能**：添加我的植物

**接口地址**：`/cloud/plant/add`

**请求方法**：`POST`

> 实际调用：`wx.cloud.callFunction({ name: 'plant', data: { action: 'add', ...params })`

**请求参数**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| flowerId | 花卉ID | String | 格式：String；示例：flower_001；必填 | 是 |
| flowerName | 花卉名称 | String | 格式：String；示例：绿萝；必填 | 是 |
| nickname | 昵称 | String | 格式：String；示例：小绿；可选，默认同 flowerName | 否 |
| location | 放置位置 | String | 格式：String；示例：客厅；可选 | 否 |
| imageUrl | 封面图 | String | 格式：URL；可选 | 否 |

**响应说明**：

所有接口返回格式统一为：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code`：状态码，`0` 表示成功，非 `0` 表示失败（详见错误码总表）
- `message`：提示信息，成功时为 `"success"`，失败时为错误描述
- `data`：业务数据，成功时返回，失败时为 `null` 或不返回

**响应参数（`data` 结构）**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| _id | 新植物ID | String | plant-abc123 | 是 |

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 |
|--------|----------|
| 1002 | 缺少必填参数 |

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'plant',
data: { action: 'add', flowerId: 'flower_001', flowerName: '绿萝', nickname: '小绿', location: '客厅' }
})
```

**接口测试**：

```javascript
// 在小程序页面 JS 中调用
wx.cloud.callFunction({
  name: 'plant',
  data: {
    action: 'add',
    flowerId: 'flower_001',
    flowerName: '绿萝',
    nickname: '小绿',
    location: '客厅',
    imageUrl: （填测试值）
  }
}).then(res => {
  console.log('成功：', res.result)
}).catch(err => {
  console.error('失败：', err)
})
```

> **预期返回**：参考上方「正确返回示例」

---

### detail

**功能**：获取我的单棵植物详情

**接口地址**：`/cloud/plant/detail`

**请求方法**：`GET`

> 实际调用：`wx.cloud.callFunction({ name: 'plant', data: { action: 'detail', ...params })`

**请求参数**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| id | 植物ID | String | 格式：String；示例：plant-abc123；必填 | 是 |

**响应说明**：

所有接口返回格式统一为：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code`：状态码，`0` 表示成功，非 `0` 表示失败（详见错误码总表）
- `message`：提示信息，成功时为 `"success"`，失败时为错误描述
- `data`：业务数据，成功时返回，失败时为 `null` 或不返回

**响应参数（`data` 结构）**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| _id | 植物ID | String | plant-abc123 | 是 |
| flowerId | 花卉ID | String | flower_001 | 是 |
| flowerName | 花卉名称 | String | 绿萝 | 是 |
| nickname | 昵称 | String | 小绿 | 是 |
| status | 状态 | String | healthy | 是 |
| location | 放置位置 | String | 客厅窗台 | 是 |
| imageUrl | 植物图片URL | String | cloud://xxx | 是 |
| createdAt | 创建时间 | Object | 服务端时间对象 | 是 |
| updatedAt | 更新时间 | Object | 服务端时间对象 | 是 |

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 |
|--------|----------|
| 1002 | 缺少必填参数 |
| 3001 | 数据不存在 |

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'plant',
data: { action: 'detail', id: 'plant-abc123' }
})
```

**接口测试**：

```javascript
// 在小程序页面 JS 中调用
wx.cloud.callFunction({
  name: 'plant',
  data: {
    action: 'detail',
    id: 'plant-abc123'
  }
}).then(res => {
  console.log('成功：', res.result)
}).catch(err => {
  console.error('失败：', err)
})
```

> **预期返回**：参考上方「正确返回示例」

---

### list

**功能**：获取我的植物列表

**接口地址**：`/cloud/plant/list`

**请求方法**：`GET`

> 实际调用：`wx.cloud.callFunction({ name: 'plant', data: { action: 'list' })`

**请求参数**：无

**响应说明**：

所有接口返回格式统一为：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code`：状态码，`0` 表示成功，非 `0` 表示失败（详见错误码总表）
- `message`：提示信息，成功时为 `"success"`，失败时为错误描述
- `data`：业务数据，成功时返回，失败时为 `null` 或不返回

**响应参数（`data` 结构）**：

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'plant',
data: { action: 'list' }
})
```

**接口测试**：

```javascript
// 在小程序页面 JS 中调用
wx.cloud.callFunction({
  name: 'plant',
  data: {
    action: 'list'
  }
}).then(res => {
  console.log('成功：', res.result)
}).catch(err => {
  console.error('失败：', err)
})
```

> **预期返回**：参考上方「正确返回示例」

---

### remove

**功能**：删除我的植物

**接口地址**：`/cloud/plant/remove`

**请求方法**：`DELETE`

> 实际调用：`wx.cloud.callFunction({ name: 'plant', data: { action: 'remove', ...params })`

**请求参数**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| id | 植物ID | String | 格式：String；示例：plant-abc123；必填 | 是 |

**响应说明**：

所有接口返回格式统一为：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code`：状态码，`0` 表示成功，非 `0` 表示失败（详见错误码总表）
- `message`：提示信息，成功时为 `"success"`，失败时为错误描述
- `data`：业务数据，成功时返回，失败时为 `null` 或不返回

**响应参数（`data` 结构）**：

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 |
|--------|----------|
| 1002 | 缺少必填参数 |

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'plant',
data: { action: 'remove', id: 'plant-abc123' }
})
```

**接口测试**：

```javascript
// 在小程序页面 JS 中调用
wx.cloud.callFunction({
  name: 'plant',
  data: {
    action: 'remove',
    id: 'plant-abc123'
  }
}).then(res => {
  console.log('成功：', res.result)
}).catch(err => {
  console.error('失败：', err)
})
```

> **预期返回**：参考上方「正确返回示例」

---

### update

**功能**：更新植物信息

**接口地址**：`/cloud/plant/update`

**请求方法**：`PUT`

> 实际调用：`wx.cloud.callFunction({ name: 'plant', data: { action: 'update', ...params })`

**请求参数**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| id | 植物ID | String | 格式：String；示例：plant-abc123；必填 | 是 |
| nickname | 昵称 | String | 格式：String；示例：小绿；可选 | 否 |
| location | 放置位置 | String | 格式：String；示例：客厅窗台；可选 | 否 |
| imageUrl | 植物图片URL | String | 格式：String；示例：cloud://xxx；可选 | 否 |
| status | 状态 | String | 格式：String；示例：healthy；可选 | 否 |

**响应说明**：

所有接口返回格式统一为：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code`：状态码，`0` 表示成功，非 `0` 表示失败（详见错误码总表）
- `message`：提示信息，成功时为 `"success"`，失败时为错误描述
- `data`：业务数据，成功时返回，失败时为 `null` 或不返回

**响应参数（`data` 结构）**：

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 |
|--------|----------|
| 1002 | 缺少必填参数 |

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'plant',
data: { action: 'update', id: 'plant-abc123', nickname: '新昵称' }
})
```

**接口测试**：

```javascript
// 在小程序页面 JS 中调用
wx.cloud.callFunction({
  name: 'plant',
  data: {
    action: 'update',
    id: 'plant-abc123',
    nickname: '小绿',
    location: '客厅窗台',
    imageUrl: 'cloud://xxx',
    status: 'healthy'
  }
}).then(res => {
  console.log('成功：', res.result)
}).catch(err => {
  console.error('失败：', err)
})
```

> **预期返回**：参考上方「正确返回示例」

---

## reminderService

> 文件：`cloudfunctions/reminder/actions/*.js`

### add

**功能**：添加提醒

**接口地址**：`/cloud/reminder/add`

**请求方法**：`POST`

> 实际调用：`wx.cloud.callFunction({ name: 'reminder', data: { action: 'add', ...params })`

**请求参数**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| plantId | 植物ID | String | 格式：String；示例：plant-abc123；必填 | 是 |
| type | 提醒类型 | String | 取值范围：water,fertilize；格式：String；示例：water；必填 | 是 |
| title | 提醒标题 | String | 格式：String；示例：给小绿浇水；必填 | 是 |
| intervalDays | 间隔天数 | Number | 取值范围：1~365；格式：Number；示例：5；必填 | 是 |
| remindAt | 提醒时间 | String | 格式：String；示例：2026-05-03T08:00:00.000Z；可选，不传则自动计算 | 否 |

**响应说明**：

所有接口返回格式统一为：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code`：状态码，`0` 表示成功，非 `0` 表示失败（详见错误码总表）
- `message`：提示信息，成功时为 `"success"`，失败时为错误描述
- `data`：业务数据，成功时返回，失败时为 `null` 或不返回

**响应参数（`data` 结构）**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| _id | 新提醒ID | String | reminder-abc123 | 是 |

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 |
|--------|----------|
| 1002 | 缺少必填参数 |

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'reminder',
data: { action: 'add', plantId: 'plant-abc123', type: 'water', title: '给小绿浇水', intervalDays: 5 }
})
```

**接口测试**：

```javascript
// 在小程序页面 JS 中调用
wx.cloud.callFunction({
  name: 'reminder',
  data: {
    action: 'add',
    plantId: 'plant-abc123',
    type: 'water',
    title: '给小绿浇水',
    intervalDays: 5,
    remindAt: '2026-05-03T08:00:00.000Z'
  }
}).then(res => {
  console.log('成功：', res.result)
}).catch(err => {
  console.error('失败：', err)
})
```

> **预期返回**：参考上方「正确返回示例」

---

### complete

**功能**：完成提醒（标记为已完成）

**接口地址**：`/cloud/reminder/complete`

**请求方法**：`POST`

> 实际调用：`wx.cloud.callFunction({ name: 'reminder', data: { action: 'complete', ...params })`

**请求参数**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| id | 提醒ID | String | 格式：String；示例：reminder-abc123；必填 | 是 |

**响应说明**：

所有接口返回格式统一为：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code`：状态码，`0` 表示成功，非 `0` 表示失败（详见错误码总表）
- `message`：提示信息，成功时为 `"success"`，失败时为错误描述
- `data`：业务数据，成功时返回，失败时为 `null` 或不返回

**响应参数（`data` 结构）**：

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 |
|--------|----------|
| 1002 | 缺少必填参数 |

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'reminder',
data: { action: 'complete', id: 'reminder-abc123' }
})
```

**接口测试**：

```javascript
// 在小程序页面 JS 中调用
wx.cloud.callFunction({
  name: 'reminder',
  data: {
    action: 'complete',
    id: 'reminder-abc123'
  }
}).then(res => {
  console.log('成功：', res.result)
}).catch(err => {
  console.error('失败：', err)
})
```

> **预期返回**：参考上方「正确返回示例」

---

### delete

**功能**：删除提醒

**接口地址**：`/cloud/reminder/delete`

**请求方法**：`DELETE`

> 实际调用：`wx.cloud.callFunction({ name: 'reminder', data: { action: 'delete', ...params })`

**请求参数**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| id | 提醒ID | String | 格式：String；示例：reminder-abc123；必填 | 是 |

**响应说明**：

所有接口返回格式统一为：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code`：状态码，`0` 表示成功，非 `0` 表示失败（详见错误码总表）
- `message`：提示信息，成功时为 `"success"`，失败时为错误描述
- `data`：业务数据，成功时返回，失败时为 `null` 或不返回

**响应参数（`data` 结构）**：

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 |
|--------|----------|
| 1002 | 缺少必填参数 |
| 3001 | 数据不存在 |

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'reminder',
data: { action: 'delete', id: 'reminder-abc123' }
})
```

**接口测试**：

```javascript
// 在小程序页面 JS 中调用
wx.cloud.callFunction({
  name: 'reminder',
  data: {
    action: 'delete',
    id: 'reminder-abc123'
  }
}).then(res => {
  console.log('成功：', res.result)
}).catch(err => {
  console.error('失败：', err)
})
```

> **预期返回**：参考上方「正确返回示例」

---

### list

**功能**：获取提醒列表（待处理的提醒）

**接口地址**：`/cloud/reminder/list`

**请求方法**：`GET`

> 实际调用：`wx.cloud.callFunction({ name: 'reminder', data: { action: 'list' })`

**请求参数**：无

**响应说明**：

所有接口返回格式统一为：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code`：状态码，`0` 表示成功，非 `0` 表示失败（详见错误码总表）
- `message`：提示信息，成功时为 `"success"`，失败时为错误描述
- `data`：业务数据，成功时返回，失败时为 `null` 或不返回

**响应参数（`data` 结构）**：

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'reminder',
data: { action: 'list' }
})
```

**接口测试**：

```javascript
// 在小程序页面 JS 中调用
wx.cloud.callFunction({
  name: 'reminder',
  data: {
    action: 'list'
  }
}).then(res => {
  console.log('成功：', res.result)
}).catch(err => {
  console.error('失败：', err)
})
```

> **预期返回**：参考上方「正确返回示例」

---

### push

**功能**：定时推送提醒（由定时触发器调用）

**接口地址**：`/cloud/reminder/push`

**请求方法**：`POST`

> 实际调用：`wx.cloud.callFunction({ name: 'reminder', data: { action: 'push' })`

**请求参数**：无

**响应说明**：

所有接口返回格式统一为：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code`：状态码，`0` 表示成功，非 `0` 表示失败（详见错误码总表）
- `message`：提示信息，成功时为 `"success"`，失败时为错误描述
- `data`：业务数据，成功时返回，失败时为 `null` 或不返回

**响应参数（`data` 结构）**：

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'reminder',
data: { action: 'push' }
})
```

**接口测试**：

```javascript
// 在小程序页面 JS 中调用
wx.cloud.callFunction({
  name: 'reminder',
  data: {
    action: 'push'
  }
}).then(res => {
  console.log('成功：', res.result)
}).catch(err => {
  console.error('失败：', err)
})
```

> **预期返回**：参考上方「正确返回示例」

---

### update

**功能**：修改提醒时间

**接口地址**：`/cloud/reminder/update`

**请求方法**：`PUT`

> 实际调用：`wx.cloud.callFunction({ name: 'reminder', data: { action: 'update', ...params })`

**请求参数**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| id | 提醒ID | String | 格式：String；示例：reminder-abc123；必填 | 是 |
| nextRemindAt | 新提醒时间 | String | 格式：String；示例：2026-05-03T08:00:00.000Z；必填 | 是 |

**响应说明**：

所有接口返回格式统一为：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code`：状态码，`0` 表示成功，非 `0` 表示失败（详见错误码总表）
- `message`：提示信息，成功时为 `"success"`，失败时为错误描述
- `data`：业务数据，成功时返回，失败时为 `null` 或不返回

**响应参数（`data` 结构）**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| nextRemindAt | 更新后的提醒时间 | String | 2026-05-03T08:00:00.000Z | 是 |

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 |
|--------|----------|
| 1002 | 缺少必填参数 |
| 3001 | 数据不存在 |

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'reminder',
data: { action: 'update', id: 'reminder-abc123', nextRemindAt: '2026-05-03T08:00:00.000Z' }
})
```

**接口测试**：

```javascript
// 在小程序页面 JS 中调用
wx.cloud.callFunction({
  name: 'reminder',
  data: {
    action: 'update',
    id: 'reminder-abc123',
    nextRemindAt: '2026-05-03T08:00:00.000Z'
  }
}).then(res => {
  console.log('成功：', res.result)
}).catch(err => {
  console.error('失败：', err)
})
```

> **预期返回**：参考上方「正确返回示例」

---

## userService

> 文件：`cloudfunctions/user/actions/*.js`

### getFavorites

**功能**：获取用户收藏列表

**接口地址**：`/cloud/user/getFavorites`

**请求方法**：`GET`

> 实际调用：`wx.cloud.callFunction({ name: 'user', data: { action: 'getFavorites' })`

**请求参数**：无

**响应说明**：

所有接口返回格式统一为：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code`：状态码，`0` 表示成功，非 `0` 表示失败（详见错误码总表）
- `message`：提示信息，成功时为 `"success"`，失败时为错误描述
- `data`：业务数据，成功时返回，失败时为 `null` 或不返回

**响应参数（`data` 结构）**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| data.list | 数据列表 | Array | - | 是 |

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'user',
data: { action: 'getFavorites' }
})
```

**接口测试**：

```javascript
// 在小程序页面 JS 中调用
wx.cloud.callFunction({
  name: 'user',
  data: {
    action: 'getFavorites'
  }
}).then(res => {
  console.log('成功：', res.result)
}).catch(err => {
  console.error('失败：', err)
})
```

> **预期返回**：参考上方「正确返回示例」

---

### getInfo

**功能**：获取当前用户信息

**接口地址**：`/cloud/user/getInfo`

**请求方法**：`GET`

> 实际调用：`wx.cloud.callFunction({ name: 'user', data: { action: 'getInfo' })`

**请求参数**：无

**响应说明**：

所有接口返回格式统一为：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code`：状态码，`0` 表示成功，非 `0` 表示失败（详见错误码总表）
- `message`：提示信息，成功时为 `"success"`，失败时为错误描述
- `data`：业务数据，成功时返回，失败时为 `null` 或不返回

**响应参数（`data` 结构）**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| favorites | 收藏花卉ID列表 | Array<String> | ["flower_001"] | 是 |
| nickName | 昵称 | String | 花卉达人 | 是 |
| avatarUrl | 头像URL | String | - | 是 |
| createdAt | 创建时间 | Object | 服务端时间 | 是 |
| lastLoginAt | 最后登录时间 | Object | 服务端时间 | 是 |

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 |
|--------|----------|
| 2001 | 用户不存在 |

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'user',
data: { action: 'getInfo' }
})
```

**接口测试**：

```javascript
// 在小程序页面 JS 中调用
wx.cloud.callFunction({
  name: 'user',
  data: {
    action: 'getInfo'
  }
}).then(res => {
  console.log('成功：', res.result)
}).catch(err => {
  console.error('失败：', err)
})
```

> **预期返回**：参考上方「正确返回示例」

---

### getStats

**功能**：获取用户统计数据（植物数、日记数、收藏数）

**接口地址**：`/cloud/user/getStats`

**请求方法**：`GET`

> 实际调用：`wx.cloud.callFunction({ name: 'user', data: { action: 'getStats' })`

**请求参数**：无

**响应说明**：

所有接口返回格式统一为：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code`：状态码，`0` 表示成功，非 `0` 表示失败（详见错误码总表）
- `message`：提示信息，成功时为 `"success"`，失败时为错误描述
- `data`：业务数据，成功时返回，失败时为 `null` 或不返回

**响应参数（`data` 结构）**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| plantCount | 植物数量 | ≥0 | 示例：整数；5 | 是 |
| diaryCount | 日记数量 | ≥0 | 示例：整数；12 | 是 |
| favoriteCount | 收藏数量 | ≥0 | 示例：整数；3 | 是 |

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'user',
data: { action: 'getStats' }
})
```

**接口测试**：

```javascript
// 在小程序页面 JS 中调用
wx.cloud.callFunction({
  name: 'user',
  data: {
    action: 'getStats'
  }
}).then(res => {
  console.log('成功：', res.result)
}).catch(err => {
  console.error('失败：', err)
})
```

> **预期返回**：参考上方「正确返回示例」

---

### login

**功能**：用户登录/注册（自动获取微信open_id）

**接口地址**：`/cloud/user/login`

**请求方法**：`POST`

> 实际调用：`wx.cloud.callFunction({ name: 'user', data: { action: 'login', ...params })`

**请求参数**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| userInfo | 用户信息 | Object | 格式：Object；示例：{nickName:'花友',avatarUrl:'...'}；可选 | 否 |
| userInfo.nickName | 昵称 | String | 格式：String；示例：花友；可选，默认'花友' | 否 |
| userInfo.avatarUrl | 头像URL | String | 格式：URL；可选 | 否 |

**响应说明**：

所有接口返回格式统一为：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code`：状态码，`0` 表示成功，非 `0` 表示失败（详见错误码总表）
- `message`：提示信息，成功时为 `"success"`，失败时为错误描述
- `data`：业务数据，成功时返回，失败时为 `null` 或不返回

**响应参数（`data` 结构）**：

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'user',
data: { action: 'login', userInfo: { nickName: '花友', avatarUrl: '' } }
})
```

**接口测试**：

```javascript
// 在小程序页面 JS 中调用
wx.cloud.callFunction({
  name: 'user',
  data: {
    action: 'login',
    userInfo: '{nickName:'花友',avatarUrl:'...'}',
    userInfo.nickName: '花友',
    userInfo.avatarUrl: （填测试值）
  }
}).then(res => {
  console.log('成功：', res.result)
}).catch(err => {
  console.error('失败：', err)
})
```

> **预期返回**：参考上方「正确返回示例」

---

### toggleFavorite

**功能**：切换花卉收藏状态（收藏/取消收藏）

**接口地址**：`/cloud/user/toggleFavorite`

**请求方法**：`POST`

> 实际调用：`wx.cloud.callFunction({ name: 'user', data: { action: 'toggleFavorite', ...params })`

**请求参数**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| flowerId | 花卉ID | String | 格式：String；示例：flower_001；必填 | 是 |

**响应说明**：

所有接口返回格式统一为：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code`：状态码，`0` 表示成功，非 `0` 表示失败（详见错误码总表）
- `message`：提示信息，成功时为 `"success"`，失败时为错误描述
- `data`：业务数据，成功时返回，失败时为 `null` 或不返回

**响应参数（`data` 结构）**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| isFavorite | 当前是否已收藏 | Boolean | 示例：true/false；是 | 是 |

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 |
|--------|----------|
| 2001 | 用户不存在 |

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'user',
data: { action: 'toggleFavorite', flowerId: 'flower_001' }
})
```

**接口测试**：

```javascript
// 在小程序页面 JS 中调用
wx.cloud.callFunction({
  name: 'user',
  data: {
    action: 'toggleFavorite',
    flowerId: 'flower_001'
  }
}).then(res => {
  console.log('成功：', res.result)
}).catch(err => {
  console.error('失败：', err)
})
```

> **预期返回**：参考上方「正确返回示例」

---

### updateInfo

**功能**：更新用户信息（昵称、头像）

**接口地址**：`/cloud/user/updateInfo`

**请求方法**：`PUT`

> 实际调用：`wx.cloud.callFunction({ name: 'user', data: { action: 'updateInfo', ...params })`

**请求参数**：

| 字段 | 说明 | 类型 | 备注 | 是否必填 |
|------|------|------|------|----------|
| nickName | 昵称 | String | 格式：String；示例：新昵称；可选 | 否 |
| avatarUrl | 头像URL | String | 格式：URL；可选 | 否 |

**响应说明**：

所有接口返回格式统一为：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code`：状态码，`0` 表示成功，非 `0` 表示失败（详见错误码总表）
- `message`：提示信息，成功时为 `"success"`，失败时为错误描述
- `data`：业务数据，成功时返回，失败时为 `null` 或不返回

**响应参数（`data` 结构）**：

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'user',
data: { action: 'updateInfo', nickName: '新昵称', avatarUrl: 'https://...' }
})
```

**接口测试**：

```javascript
// 在小程序页面 JS 中调用
wx.cloud.callFunction({
  name: 'user',
  data: {
    action: 'updateInfo',
    nickName: '新昵称',
    avatarUrl: （填测试值）
  }
}).then(res => {
  console.log('成功：', res.result)
}).catch(err => {
  console.error('失败：', err)
})
```

> **预期返回**：参考上方「正确返回示例」

---

## 错误码总表

| 错误码 | 错误信息 |
|--------|----------|
| 1001 | 参数错误 |
| 1002 | 缺少必填参数 |
| 1003 | 参数格式不正确 |
| 1004 | ID格式不正确 |
| 2001 | 用户不存在 |
| 2002 | 用户未登录 |
| 3001 | 数据不存在 |
| 3002 | 数据已存在 |
| 3003 | 未找到符合条件的数据 |
| 4001 | 数据库访问出错 |
| 4002 | 数据写入失败 |
| 5001 | 未知操作 |
| 5002 | 未知错误 |

