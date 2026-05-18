# 养花呀 - API 接口文档

> **本文档由脚本自动生成，请勿手动修改**
>
> **生成时间**：2026/5/18 10:44:05
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
  - [list](#list)
- [flowerService](#flowerservice)
  - [detail](#detail)
  - [list](#list)
  - [recommend](#recommend)
  - [search](#search)
- [plantService](#plantservice)
  - [add](#add)
  - [list](#list)
  - [remove](#remove)
  - [update](#update)
- [reminderService](#reminderservice)
  - [complete](#complete)
  - [list](#list)
  - [push](#push)
- [userService](#userservice)
  - [getFavorites](#getfavorites)
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

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'common',
data: { action: 'getDailyTip' }
})
```

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

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'common',
data: { action: 'getHomeData' }
})
```

---

## diaryService

> 文件：`cloudfunctions/diary/actions/*.js`

### add

**功能**：add

**接口地址**：`/cloud/diary/add`

**请求方法**：`POST`

> 实际调用：`wx.cloud.callFunction({ name: 'diary', data: { action: 'add', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| plantId | String | 是 | - | - | - | - | - |
| content | String | 是 | - | - | - | - | - |
| images | Array | 否 | [] | - | - | - | - |

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

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 | 含义 |
|--------|----------|------|
| 1002 | 缺少必填参数 | |

---

### delete

**功能**：delete

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

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 | 含义 |
|--------|----------|------|
| 1002 | 缺少必填参数 | |

---

### list

**功能**：获取日记列表（可按植物筛选）

**接口地址**：`/cloud/diary/list`

**请求方法**：`GET`

> 实际调用：`wx.cloud.callFunction({ name: 'diary', data: { action: 'list', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| plantId | String | 是 | - | - | - | - | - |

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

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'diary',
data: { action: 'list', plantId: 'plant-abc123' }
})
```

---

## flowerService

> 文件：`cloudfunctions/flower/actions/*.js`

### detail

**功能**：detail

**接口地址**：`/cloud/flower/detail`

**请求方法**：`GET`

> 实际调用：`wx.cloud.callFunction({ name: 'flower', data: { action: 'detail', ...params })`

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

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 | 含义 |
|--------|----------|------|
| 1002 | 缺少必填参数 | |

---

### list

**功能**：获取花卉列表（支持分页和分类筛选）

**接口地址**：`/cloud/flower/list`

**请求方法**：`GET`

> 实际调用：`wx.cloud.callFunction({ name: 'flower', data: { action: 'list', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| page | Number | 否 | 1 | - | - | - | - |
| pageSize | Number | 否 | 20 | - | - | - | - |
| category | String | 是 | - | - | - | - | - |

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

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'flower',
data: { action: 'list', page: 1, pageSize: 20, category: 2 }
})
```

---

### recommend

**功能**：获取推荐花卉（随机返回6条）

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

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'flower',
data: { action: 'recommend' }
})
```

---

### search

**功能**：搜索花卉（按名称或别名模糊匹配）

**接口地址**：`/cloud/flower/search`

**请求方法**：`GET`

> 实际调用：`wx.cloud.callFunction({ name: 'flower', data: { action: 'search', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| keyword | String | 否 | '' | - | - | - | - |

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

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'flower',
data: { action: 'search', keyword: '绿萝' }
})
```

---

## plantService

> 文件：`cloudfunctions/plant/actions/*.js`

### add

**功能**：add

**接口地址**：`/cloud/plant/add`

**请求方法**：`POST`

> 实际调用：`wx.cloud.callFunction({ name: 'plant', data: { action: 'add', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| flowerId | String | 是 | - | - | - | - | - |
| flowerName | String | 是 | - | - | - | - | - |
| nickname | String | 是 | - | - | - | - | - |
| location | String | 是 | - | - | - | - | - |
| imageUrl | String | 是 | - | - | - | - | - |

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

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 | 含义 |
|--------|----------|------|
| 1002 | 缺少必填参数 | |

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

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'plant',
data: { action: 'list' }
})
```

---

### remove

**功能**：remove

**接口地址**：`/cloud/plant/remove`

**请求方法**：`DELETE`

> 实际调用：`wx.cloud.callFunction({ name: 'plant', data: { action: 'remove', ...params })`

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

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 | 含义 |
|--------|----------|------|
| 1002 | 缺少必填参数 | |

---

### update

**功能**：update

**接口地址**：`/cloud/plant/update`

**请求方法**：`PUT`

> 实际调用：`wx.cloud.callFunction({ name: 'plant', data: { action: 'update', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| id | String | 是 | - | - | - | - | - |
| updateData | Object | 否 | - | - | - | - | - |

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

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 | 含义 |
|--------|----------|------|
| 1002 | 缺少必填参数 | |

---

## reminderService

> 文件：`cloudfunctions/reminder/actions/*.js`

### complete

**功能**：complete

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

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 | 含义 |
|--------|----------|------|
| 1002 | 缺少必填参数 | |

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

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'reminder',
data: { action: 'list' }
})
```

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

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'reminder',
data: { action: 'push' }
})
```

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

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'user',
data: { action: 'getFavorites' }
})
```

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

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'user',
data: { action: 'getStats' }
})
```

---

### login

**功能**：用户登录/注册（自动获取微信openid）

**接口地址**：`/cloud/user/login`

**请求方法**：`POST`

> 实际调用：`wx.cloud.callFunction({ name: 'user', data: { action: 'login' })`

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

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'user',
data: { action: 'login', userInfo: { nickName: '花友', avatarUrl: 'https://...' } }
})
```

---

### toggleFavorite

**功能**：toggleFavorite

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

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

**可能返回的错误码**：

| 错误码 | 错误信息 | 含义 |
|--------|----------|------|
| 2001 | 用户不存在 | |

---

### updateInfo

**功能**：更新用户信息（昵称、头像）

**接口地址**：`/cloud/user/updateInfo`

**请求方法**：`PUT`

> 实际调用：`wx.cloud.callFunction({ name: 'user', data: { action: 'updateInfo', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| nickName | String | 是 | - | - | - | - | - |
| avatarUrl | String | 是 | - | - | - | - | - |

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

**正确返回示例**：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

**调用示例**：

```javascript
const res = await wx.cloud.callFunction({
name: 'user',
data: { action: 'updateInfo', nickName: '新昵称', avatarUrl: 'https://...' }
})
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

