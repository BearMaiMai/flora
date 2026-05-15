# 养花呀 - API 接口文档

> **本文档由脚本自动生成，请勿手动修改**
>
> **生成时间**：2026/5/15 13:03:06
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
  - [getHomeData](#gethomedata)
  - [getDailyTip](#getdailytip)
- [diaryService](#diaryservice)
  - [add](#add)
  - [getList](#getlist)
  - [remove](#remove)
- [flowerService](#flowerservice)
  - [getList](#getlist)
  - [getDetail](#getdetail)
  - [search](#search)
  - [getRecommend](#getrecommend)
- [plantService](#plantservice)
  - [add](#add)
  - [getList](#getlist)
  - [update](#update)
  - [remove](#remove)
- [reminderService](#reminderservice)
  - [getList](#getlist)
  - [complete](#complete)
- [userService](#userservice)
  - [login](#login)
  - [updateInfo](#updateinfo)
  - [toggleFavorite](#togglefavorite)
  - [getFavorites](#getfavorites)
  - [getStats](#getstats)
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
| 2026-05-14 | 创建接口文档 V2，支持完整 REST 风格文档（请求/响应参数全字段、错误码、安全说明、版本管理、请求头） | AI Assistant |

---

## commonService

> 文件：`miniprogram/services/common.js`

### getHomeData

**功能**：获取首页聚合数据（每日贴士 + 推荐花卉）

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

| 参数名称 | 参数类型 | 参数格式 | 参数说明 | 取值范围 | 示例值 |
|----------|----------|----------|----------|----------|--------|
| code | Number | - | - 状态码（0=成功） | - | - |
| data | Object | - | - 首页数据 | - | - |
| data.dailyTip | String | - | - 每日养护贴士 | - | - |
| data.recommendList | Array | - | - 推荐花卉列表 | - | - |

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
const res = await commonService.getHomeData()
```

---

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

| 参数名称 | 参数类型 | 参数格式 | 参数说明 | 取值范围 | 示例值 |
|----------|----------|----------|----------|----------|--------|
| code | Number | - | - 状态码（0=成功） | - | - |
| data | Object | - | - 贴士数据 | - | - |
| data.content | String | - | - 贴士内容 | - | - |

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
const res = await commonService.getDailyTip()
```

---

## diaryService

> 文件：`miniprogram/services/diary.js`

### add

**功能**：添加植物生长日记

**接口地址**：`/cloud/diary/add`

**请求方法**：`POST`

> 实际调用：`wx.cloud.callFunction({ name: 'diary', data: { action: 'add', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| data.plantId | String | 是 | - | - | - | - | - |
| data.content | String | 是 | - | - | - | - | - |
| data.images | Array | 否 | [] | - | - | - | - |

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

| 参数名称 | 参数类型 | 参数格式 | 参数说明 | 取值范围 | 示例值 |
|----------|----------|----------|----------|----------|--------|
| code | Number | - | - 状态码（0=成功） | - | - |
| data | Object | - | - 创建结果 | - | - |
| data._id | String | - | - 新日记的 ID | - | - |

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 | 含义 |
|--------|----------|------|
| 1002 | 缺少必填参数 | |

**调用示例**：

```javascript
const res = await diaryService.add({
plantId: 'plant-id-123',
content: '今天给绿萝浇了水，叶子很绿',
images: ['cloud://xxx.jpg']
})
```

---

### getList

**功能**：获取日记列表

**接口地址**：`/cloud/diary/list`

**请求方法**：`GET`

> 实际调用：`wx.cloud.callFunction({ name: 'diary', data: { action: 'list', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| plantId | String | 否 | - | - | - | - | - |

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

| 参数名称 | 参数类型 | 参数格式 | 参数说明 | 取值范围 | 示例值 |
|----------|----------|----------|----------|----------|--------|
| code | Number | - | - 状态码（0=成功） | - | - |
| data | Array | - | - 日记列表 | - | - |
| data[]._id | String | - | - 日记 ID | - | - |
| data[].plantId | String | - | - 关联植物 ID | - | - |
| data[].content | String | - | - 日记内容 | - | - |
| data[].images | Array | - | - 图片 URL 数组 | - | - |
| data[].createdAt | Date | - | - 创建时间 | - | - |

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
const res = await diaryService.getList('plant-id-123')
const res = await diaryService.getList()
```

---

### remove

**功能**：删除日记

**接口地址**：`/cloud/diary/delete`

**请求方法**：`DELETE`

> 实际调用：`wx.cloud.callFunction({ name: 'diary', data: { action: 'delete', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| id | String | 是 | - | - | - | - | - |

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

| 参数名称 | 参数类型 | 参数格式 | 参数说明 | 取值范围 | 示例值 |
|----------|----------|----------|----------|----------|--------|
| code | Number | - | - 状态码（0=成功） | - | - |
| message | String | - | - 提示信息 | - | - |

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 | 含义 |
|--------|----------|------|
| 1002 | 缺少必填参数 | |

**调用示例**：

```javascript
const res = await diaryService.remove('diary-id-123')
```

---

## flowerService

> 文件：`miniprogram/services/flower.js`

### getList

**功能**：获取花卉列表（支持分页和分类筛选）

**接口地址**：`/cloud/flower/list`

**请求方法**：`GET`

> 实际调用：`wx.cloud.callFunction({ name: 'flower', data: { action: 'list', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| params.page | Number | 否 | 1 | 取值范围：1-10000 | 正整数 | 1 | 与 pageSize 配合做分页 |
| params.pageSize | Number | 否 | 20 | 取值范围：1-100 | 正整数 | 20 | 最大100 |
| params.category | Number | 否 | - | 取值范围：1-4 | 枚举整数 | 2 | 不传则返回全部分类 |

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

| 参数名称 | 参数类型 | 参数格式 | 参数说明 | 取值范围 | 示例值 |
|----------|----------|----------|----------|----------|--------|
| code | Number | - | - 状态码（0=成功） | - | 0 |
| message | String | - | - 提示信息 | - | "success" |
| data | Object | - | - 花卉列表数据 | - | - |
| data.list | Array | - | - 花卉列表 | - | - |
| data.total | Number | - | - 总数 | - | 120 |
| data.list[]._id | String | - | - 花卉 ID | - | "1" |
| data.list[].name | String | - | - 花卉名称 | - | "月季" |
| data.list[].alias | Array | - | - 别名数组 | - | ["玫瑰","刺玫"] |
| data.list[].category | Number | - | - 分类（1=观叶 2=观花 3=多肉 4=果蔬） | - | 2 |
| data.list[].difficulty | Number | - | - 养护难度（1-5） | - | 3 |
| data.list[].coverImage | String | - | - 封面图 URL | - | "" |
| data.list[].description | String | - | - 描述 | - | "喜阴耐旱" |

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
const res = await flowerService.getList({ page: 1, pageSize: 20 })
const res = await flowerService.getList({ category: 2 })
```

---

### getDetail

**功能**：获取花卉详情

**接口地址**：`/cloud/flower/detail`

**请求方法**：`GET`

> 实际调用：`wx.cloud.callFunction({ name: 'flower', data: { action: 'detail', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| id | String | 是 | - | - | - | "1" | 必填 |

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

| 参数名称 | 参数类型 | 参数格式 | 参数说明 | 取值范围 | 示例值 |
|----------|----------|----------|----------|----------|--------|
| code | Number | - | - 状态码（0=成功） | - | 0 |
| message | String | - | - 提示信息 | - | "success" |
| data | Object | - | - 花卉详情 | - | - |
| data._id | String | - | - 花卉 ID | - | "1" |
| data.name | String | - | - 花卉名称 | - | "月季" |
| data.alias | Array | - | - 别名数组 | - | ["玫瑰"] |
| data.category | Number | - | - 分类（1=观叶 2=观花 3=多肉 4=果蔬） | - | 2 |
| data.difficulty | Number | - | - 养护难度（1-5） | - | 3 |
| data.waterDays | Number | - | - 浇水间隔天数 | - | 7 |
| data.fertilizeDays | Number | - | - 施肥间隔天数 | - | 30 |
| data.light | String | - | - 光照需求 | - | "半阴" |
| data.soil | String | - | - 土壤要求 | - | "疏松透气" |
| data.temperature | String | - | - 温度范围 | - | "15-25℃" |
| data.coverImage | String | - | - 封面图 URL | - | "" |
| data.description | String | - | - 描述 | - | "喜阴耐旱" |
| data.tips | Array | - | - 养护技巧数组 | - | ["定期浇水","避免暴晒"] |

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 | 含义 |
|--------|----------|------|
| 1002 | 缺少必填参数 | |

**调用示例**：

```javascript
const res = await flowerService.getDetail('1')
```

---

### search

**功能**：搜索花卉（按名称或别名匹配）

**接口地址**：`/cloud/flower/search`

**请求方法**：`GET`

> 实际调用：`wx.cloud.callFunction({ name: 'flower', data: { action: 'search', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| keyword | String | 是 | - | - | - | "月季" | 为空则返回空数组 |

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

| 参数名称 | 参数类型 | 参数格式 | 参数说明 | 取值范围 | 示例值 |
|----------|----------|----------|----------|----------|--------|
| code | Number | - | - 状态码（0=成功） | - | 0 |
| message | String | - | - 提示信息 | - | "success" |
| data | Object | - | - 搜索结果 | - | - |
| data.list | Array | - | - 匹配的花卉列表 | - | - |
| data.total | Number | - | - 总数 | - | 5 |

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
const res = await flowerService.search('月季')
```

---

### getRecommend

**功能**：获取推荐花卉（随机 6 条）

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

| 参数名称 | 参数类型 | 参数格式 | 参数说明 | 取值范围 | 示例值 |
|----------|----------|----------|----------|----------|--------|
| code | Number | - | - 状态码（0=成功） | - | 0 |
| message | String | - | - 提示信息 | - | "success" |
| data | Object | - | - 推荐数据 | - | - |
| data.list | Array | - | - 推荐花卉列表 | - | - |
| data.total | Number | - | - 总数 | - | 6 |

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
const res = await flowerService.getRecommend()
```

---

## plantService

> 文件：`miniprogram/services/plant.js`

### add

**功能**：添加植物到我的花园

**接口地址**：`/cloud/plant/add`

**请求方法**：`POST`

> 实际调用：`wx.cloud.callFunction({ name: 'plant', data: { action: 'add', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| data.flowerId | String | 是 | - | - | - | "1" | 关联花卉表 |
| data.flowerName | String | 否 | - | - | - | "月季" | 可选，不传则使用花卉表名称 |
| data.nickname | String | 否 | - | - | - | "客厅的绿萝" | 方便用户自定义 |
| data.location | String | 否 | - | - | - | "客厅" | 可选 |
| data.imageUrl | String | 否 | - | - | - | "" | 可选，上传后获取 |

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

| 参数名称 | 参数类型 | 参数格式 | 参数说明 | 取值范围 | 示例值 |
|----------|----------|----------|----------|----------|--------|
| code | Number | - | - 状态码（0=成功） | - | 0 |
| message | String | - | - 提示信息 | - | "添加成功" |
| data | Object | - | - 创建结果 | - | - |
| data._id | String | - | - 新植物的 ID | - | "1" |

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 | 含义 |
|--------|----------|------|
| 1002 | 缺少必填参数 | |

**调用示例**：

```javascript
const res = await plantService.add({
flowerId: '1',
nickname: '客厅的绿萝',
location: '客厅'
})
```

---

### getList

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

| 参数名称 | 参数类型 | 参数格式 | 参数说明 | 取值范围 | 示例值 |
|----------|----------|----------|----------|----------|--------|
| code | Number | - | - 状态码（0=成功） | - | 0 |
| message | String | - | - 提示信息 | - | "success" |
| data | Object | - | - 植物列表数据 | - | - |
| data.list | Array | - | - 植物列表 | - | - |
| data.total | Number | - | - 总数 | - | 10 |
| data[]._id | String | - | - 植物 ID | - | "1" |
| data[].flowerId | String | - | - 关联花卉 ID | - | "1" |
| data[].flowerName | String | - | - 花卉名称 | - | "绿萝" |
| data[].nickname | String | - | - 昵称 | - | "客厅的绿萝" |
| data[].location | String | - | - 位置 | - | "客厅" |
| data[].imageUrl | String | - | - 照片 URL | - | "" |
| data[].status | String | - | - 状态（healthy=健康） | - | "healthy" |

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
const res = await plantService.getList()
```

---

### update

**功能**：更新植物信息

**接口地址**：`/cloud/plant/update`

**请求方法**：`PUT`

> 实际调用：`wx.cloud.callFunction({ name: 'plant', data: { action: 'update', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| id | String | 是 | - | - | - | "1" | 必填 |
| data.nickname | String | 否 | - | - | - | "阳台的月季" | 可选 |
| data.location | String | 否 | - | - | - | "阳台" | 可选 |
| data.imageUrl | String | 否 | - | - | - | "" | 可选 |
| data.status | String | 否 | - | - | - | "healthy" | 可选 |

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

| 参数名称 | 参数类型 | 参数格式 | 参数说明 | 取值范围 | 示例值 |
|----------|----------|----------|----------|----------|--------|
| code | Number | - | - 状态码（0=成功） | - | 0 |
| message | String | - | - 提示信息 | - | "更新成功" |

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 | 含义 |
|--------|----------|------|
| 1002 | 缺少必填参数 | |

**调用示例**：

```javascript
const res = await plantService.update('1', { nickname: '阳台的月季' })
```

---

### remove

**功能**：删除植物

**接口地址**：`/cloud/plant/remove`

**请求方法**：`DELETE`

> 实际调用：`wx.cloud.callFunction({ name: 'plant', data: { action: 'remove', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| id | String | 是 | - | - | - | "1" | 必填 |

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

| 参数名称 | 参数类型 | 参数格式 | 参数说明 | 取值范围 | 示例值 |
|----------|----------|----------|----------|----------|--------|
| code | Number | - | - 状态码（0=成功） | - | 0 |
| message | String | - | - 提示信息 | - | "删除成功" |

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 | 含义 |
|--------|----------|------|
| 1002 | 缺少必填参数 | |

**调用示例**：

```javascript
const res = await plantService.remove('1')
```

---

## reminderService

> 文件：`miniprogram/services/reminder.js`

### getList

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

| 参数名称 | 参数类型 | 参数格式 | 参数说明 | 取值范围 | 示例值 |
|----------|----------|----------|----------|----------|--------|
| code | Number | - | - 状态码（0=成功） | - | - |
| data | Array | - | - 提醒列表 | - | - |
| data[]._id | String | - | - 提醒 ID | - | - |
| data[].plantId | String | - | - 关联植物 ID | - | - |
| data[].type | String | - | - 提醒类型 | - | - |
| data[].remindAt | Date | - | - 提醒时间 | - | - |
| data[].status | String | - | - 状态（pending=待处理） | - | - |

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
const res = await reminderService.getList()
```

---

### complete

**功能**：完成提醒（标记为已完成）

**接口地址**：`/cloud/reminder/complete`

**请求方法**：`POST`

> 实际调用：`wx.cloud.callFunction({ name: 'reminder', data: { action: 'complete', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| id | String | 是 | - | - | - | - | - |

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

| 参数名称 | 参数类型 | 参数格式 | 参数说明 | 取值范围 | 示例值 |
|----------|----------|----------|----------|----------|--------|
| code | Number | - | - 状态码（0=成功） | - | - |
| message | String | - | - 提示信息 | - | - |

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 | 含义 |
|--------|----------|------|
| 1002 | 缺少必填参数 | |

**调用示例**：

```javascript
const res = await reminderService.complete('reminder-id-123')
```

---

## userService

> 文件：`miniprogram/services/user.js`

### login

**功能**：用户登录/注册（自动创建用户记录）

**接口地址**：`/cloud/user/login`

**请求方法**：`POST`

> 实际调用：`wx.cloud.callFunction({ name: 'user', data: { action: 'login', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| userInfo.nickName | String | 否 | - | - | - | - | - |
| userInfo.avatarUrl | String | 否 | - | - | - | - | - |

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

| 参数名称 | 参数类型 | 参数格式 | 参数说明 | 取值范围 | 示例值 |
|----------|----------|----------|----------|----------|--------|
| code | Number | - | - 状态码（0=成功） | - | - |
| data | Object | - | - 用户信息 | - | - |
| data._id | String | - | - 用户 ID | - | - |
| data._openid | String | - | - 微信 OpenID | - | - |
| data.nickName | String | - | - 昵称 | - | - |
| data.avatarUrl | String | - | - 头像 URL | - | - |
| data.favorites | Array | - | - 收藏的花卉 ID 数组 | - | - |
| data.createdAt | Date | - | - 创建时间 | - | - |
| data.lastLoginAt | Date | - | - 最后登录时间 | - | - |

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
const res = await userService.login()
const res = await userService.login({ nickName: '花友', avatarUrl: 'https://...' })
```

---

### updateInfo

**功能**：更新用户昵称和头像

**接口地址**：`/cloud/user/updateInfo`

**请求方法**：`PUT`

> 实际调用：`wx.cloud.callFunction({ name: 'user', data: { action: 'updateInfo', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| data.nickName | String | 否 | - | - | - | - | - |
| data.avatarUrl | String | 否 | - | - | - | - | - |

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

| 参数名称 | 参数类型 | 参数格式 | 参数说明 | 取值范围 | 示例值 |
|----------|----------|----------|----------|----------|--------|
| code | Number | - | - 状态码（0=成功） | - | - |
| message | String | - | - 提示信息 | - | - |

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
const res = await userService.updateInfo({ nickName: '新昵称' })
```

---

### toggleFavorite

**功能**：切换收藏状态（已收藏则取消，未收藏则添加）

**接口地址**：`/cloud/user/toggleFavorite`

**请求方法**：`POST`

> 实际调用：`wx.cloud.callFunction({ name: 'user', data: { action: 'toggleFavorite', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| flowerId | String | 是 | - | - | - | - | - |

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

| 参数名称 | 参数类型 | 参数格式 | 参数说明 | 取值范围 | 示例值 |
|----------|----------|----------|----------|----------|--------|
| code | Number | - | - 状态码（0=成功） | - | - |
| data | Object | - | - 收藏状态 | - | - |
| data.isFavorite | Boolean | - | - 当前是否已收藏 | - | - |

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 | 含义 |
|--------|----------|------|
| 2001 | 用户不存在 | |

**调用示例**：

```javascript
const res = await userService.toggleFavorite('flower-id-123')
console.log(res.data.isFavorite) // true/false
```

---

### getFavorites

**功能**：获取我的收藏列表（返回完整花卉对象）

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

| 参数名称 | 参数类型 | 参数格式 | 参数说明 | 取值范围 | 示例值 |
|----------|----------|----------|----------|----------|--------|
| code | Number | - | - 状态码（0=成功） | - | - |
| data | Object | - | - 收藏数据 | - | - |
| data.list | Array | - | - 收藏的花卉列表 | - | - |
| data.total | Number | - | - 收藏总数 | - | - |

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
const res = await userService.getFavorites()
console.log(res.data.list)
console.log(res.data.total)
```

---

### getStats

**功能**：获取用户统计（植物数、日记数、收藏数）

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

| 参数名称 | 参数类型 | 参数格式 | 参数说明 | 取值范围 | 示例值 |
|----------|----------|----------|----------|----------|--------|
| code | Number | - | - 状态码（0=成功） | - | - |
| data | Object | - | - 统计数据 | - | - |
| data.plantCount | Number | - | - 植物数量 | - | - |
| data.diaryCount | Number | - | - 日记数量 | - | - |
| data.favoriteCount | Number | - | - 收藏数量 | - | - |

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
const res = await userService.getStats()
```

---

## 错误码总表

| 错误码 | 错误信息 | 含义 |
|--------|----------|------|
| 1001 | 参数错误 | |
| 1002 | 缺少必填参数 | |
| 1003 | 参数格式不正确 | |
| 1004 | ID格式不正确 | |
| 2001 | 用户不存在 | |
| 2002 | 用户未登录 | |
| 3001 | 数据不存在 | |
| 3002 | 数据已存在 | |
| 3003 | 未找到符合条件的数据 | |
| 4001 | 数据库访问出错 | |
| 4002 | 数据写入失败 | |
| 5001 | 未知操作 | |
| 5002 | 未知错误 | |

