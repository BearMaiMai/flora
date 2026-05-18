# 养花呀 - API 接口文档

> **本文档由脚本自动生成，请勿手动修改**
>
> **生成时间**：2026/5/18 14:21:53
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

| 参数名称 | 参数类型 | 参数说明 | 示例值 | 备注 |
|----------|----------|----------|----------|--------|
| data.content | String | 贴士内容 | - | - |

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

| 参数名称 | 参数类型 | 参数说明 | 示例值 | 备注 |
|----------|----------|----------|----------|--------|
| data.dailyTip | String | 每日贴士内容 | - | - |
| data.recommendList | Array | 推荐花卉数组 | - | - |

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

---

## diaryService

> 文件：`cloudfunctions/diary/actions/*.js`

### add

**功能**：添加植物生长日记

**接口地址**：`/cloud/diary/add`

**请求方法**：`POST`

> 实际调用：`wx.cloud.callFunction({ name: 'diary', data: { action: 'add', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| plantId | String | 是 | - | - | String | plant-abc123 | 必填 |
| content | String | 是 | - | - | String | 今天给绿萝浇了水 | 必填 |
| images | Array | 否 | - | - | Array<String> | [] | 可选，默认[] |

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

| 参数名称 | 参数类型 | 参数说明 | 示例值 | 备注 |
|----------|----------|----------|----------|--------|
| data._id | String | 新日记ID | - | diary-abc123 |

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

---

### delete

**功能**：删除日记

**接口地址**：`/cloud/diary/delete`

**请求方法**：`DELETE`

> 实际调用：`wx.cloud.callFunction({ name: 'diary', data: { action: 'delete', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| id | String | 是 | - | - | String | diary-abc123 | 必填 |

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

---

### detail

**功能**：获取单条日记详情

**接口地址**：`/cloud/diary/detail`

**请求方法**：`GET`

> 实际调用：`wx.cloud.callFunction({ name: 'diary', data: { action: 'detail', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| id | String | 是 | - | - | String | diary-abc123 | 必填 |

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

| 参数名称 | 参数类型 | 参数说明 | 示例值 | 备注 |
|----------|----------|----------|----------|--------|
| data._id | String | 日记ID | - | diary-abc123 |
| data.plantId | String | 植物ID | - | plant-abc123 |
| data.content | String | 日记内容 | - | 今天给绿萝浇了水 |
| data.images | Array | 图片列表 | - | - |
| data.careActions | Array | 养护操作 | - | ["浇水"] |
| data.weather | String | 天气 | - | 晴 |
| data.createdAt | String | 创建时间 | - | 2026-04-20T10:30:00.000Z |

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

---

### list

**功能**：获取日记列表（可按植物筛选）

**接口地址**：`/cloud/diary/list`

**请求方法**：`GET`

> 实际调用：`wx.cloud.callFunction({ name: 'diary', data: { action: 'list', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| plantId | String | 否 | - | - | String | plant-abc123 | 可选，不传则返回全部 |

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

| 参数名称 | 参数类型 | 参数说明 | 示例值 | 备注 |
|----------|----------|----------|----------|--------|
| data | Array | 日记对象数组 | - | - |

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

---

### update

**功能**：编辑日记

**接口地址**：`/cloud/diary/update`

**请求方法**：`PUT`

> 实际调用：`wx.cloud.callFunction({ name: 'diary', data: { action: 'update', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| id | String | 是 | - | - | String | diary-abc123 | 必填 |
| content | String | 否 | - | - | String | 今天给绿萝浇了水 | 可选 |
| images | Array | 否 | - | - | Array<String> | [] | 可选 |

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

| 参数名称 | 参数类型 | 参数说明 | 示例值 | 备注 |
|----------|----------|----------|----------|--------|
| data.content | String | 日记内容 | - | 今天给绿萝浇了水 |
| data.images | Array | 图片列表 | - | - |

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

---

## flowerService

> 文件：`cloudfunctions/flower/actions/*.js`

### detail

**功能**：获取花卉详情

**接口地址**：`/cloud/flower/detail`

**请求方法**：`GET`

> 实际调用：`wx.cloud.callFunction({ name: 'flower', data: { action: 'detail', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| id | String | 是 | - | - | String | flower_001 | 必填 |

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

| 参数名称 | 参数类型 | 参数说明 | 示例值 | 备注 |
|----------|----------|----------|----------|--------|
| data._id | String | 花卉ID | - | flower_001 |
| data.name | String | 花卉名称 | - | 绿萝 |
| data.scientificName | String | 学名 | - | Epipremnum aureum |
| data.alias | Array | 别名列表 | - | ["魔鬼藤","黄金葛"] |
| data.family | String | 科属 | - | 天南星科 |
| data.coverImage | String | 封面图 | - | cloud://... |
| data.category | Number | 分类 | - | 1=观叶,2=观花,3=多肉,4=果蔬 |
| data.plantType | String | 植物类型 | - | 藤本 |
| data.difficulty | Number | 养护难度 | - | 1~5 |
| data.light | String | 光照需求 | - | 耐阴，散射光 |
| data.temperature | String | 适宜温度 | - | 15-30°C |
| data.waterDays | Number | 浇水间隔天数 | - | 5 |
| data.fertilizeDays | Number | 施肥间隔天数 | - | 20 |
| data.season | Array | 适宜季节 | - | ["春","夏","秋"] |
| data.isIndoor | Boolean | 是否室内 | - | true |
| data.description | String | 描述 | - | 绿萝属于麒麟叶属植物... |
| data.flowerLanguage | String | 花语 | - | 守望幸福 |
| data.tags | Array | 标签 | - | ["室内","耐阴","净化空气"] |
| data.isPublished | Boolean | 是否发布 | - | true |
| data.sortOrder | Number | 排序权重 | - | 1 |

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

| 参数名称 | 参数类型 | 参数说明 | 示例值 | 备注 |
|----------|----------|----------|----------|--------|
| data | Array | 分类数组 | - | 固定4个分类 |
| data[].id | Number | 分类ID | 1 | 1=观叶,2=观花,3=多肉,4=果蔬 |
| data[].name | String | 分类名称 | 观叶 | - |

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

---

### list

**功能**：获取花卉列表（支持分页和分类筛选）

**接口地址**：`/cloud/flower/list`

**请求方法**：`GET`

> 实际调用：`wx.cloud.callFunction({ name: 'flower', data: { action: 'list', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| page | Number | 是 | - | 1~100 | 整数 | 1 | 默认第1页 |
| pageSize | Number | 是 | - | 1~100 | 整数 | 20 | 默认20条 |
| category | Number | 否 | - | 1~4 | 整数 | 2 | 1=观叶植物,2=观花植物,3=多肉植物,4=果蔬；不传则返回全部分类 |

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

| 参数名称 | 参数类型 | 参数说明 | 示例值 | 备注 |
|----------|----------|----------|----------|--------|
| data.list | Array | 花卉对象数组 | - | 是 |
| data.total | Number | 符合条件的总数 | 整数 | 100 |

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

**响应参数（`data` 结构）**：

| 参数名称 | 参数类型 | 参数说明 | 示例值 | 备注 |
|----------|----------|----------|----------|--------|
| data | Array | 推荐花卉数组 | - | 6条随机花卉 |

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

---

### search

**功能**：搜索花卉（按名称或别名模糊匹配）

**接口地址**：`/cloud/flower/search`

**请求方法**：`GET`

> 实际调用：`wx.cloud.callFunction({ name: 'flower', data: { action: 'search', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| keyword | String | 是 | - | - | String | 绿萝 | 必填 |

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

| 参数名称 | 参数类型 | 参数说明 | 示例值 | 备注 |
|----------|----------|----------|----------|--------|
| data | Array | 匹配的花卉数组 | - | - |

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

---

## plantService

> 文件：`cloudfunctions/plant/actions/*.js`

### add

**功能**：添加我的植物

**接口地址**：`/cloud/plant/add`

**请求方法**：`POST`

> 实际调用：`wx.cloud.callFunction({ name: 'plant', data: { action: 'add', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| flowerId | String | 是 | - | - | String | flower_001 | 必填 |
| flowerName | String | 是 | - | - | String | 绿萝 | 必填 |
| nickname | String | 否 | - | - | String | 小绿 | 可选，默认同 flowerName |
| location | String | 否 | - | - | String | 客厅 | 可选 |
| imageUrl | String | 否 | - | - | URL | - | 可选 |

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

| 参数名称 | 参数类型 | 参数说明 | 示例值 | 备注 |
|----------|----------|----------|----------|--------|
| data._id | String | 新植物ID | - | plant-abc123 |

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

---

### detail

**功能**：获取我的单棵植物详情

**接口地址**：`/cloud/plant/detail`

**请求方法**：`GET`

> 实际调用：`wx.cloud.callFunction({ name: 'plant', data: { action: 'detail', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| id | String | 是 | - | - | String | plant-abc123 | 必填 |

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

| 参数名称 | 参数类型 | 参数说明 | 示例值 | 备注 |
|----------|----------|----------|----------|--------|
| data._id | String | 植物ID | - | plant-abc123 |
| data.flowerId | String | 花卉ID | - | flower_001 |
| data.nickName | String | 昵称 | - | 小绿 |
| data.status | String | 状态 | - | healthy |
| data.location | String | 放置位置 | - | 客厅窗台 |
| data.waterDays | Number | 浇水间隔天数 | - | 5 |
| data.fertilizeDays | Number | 施肥间隔天数 | - | 20 |
| data.lastWateredAt | String | 最后浇水时间 | - | 2026-04-28T08:00:00.000Z |
| data.lastFertilizedAt | String | 最后施肥时间 | - | 2026-04-10T08:00:00.000Z |
| data.createdAt | String | 创建时间 | - | 2026-03-01T10:00:00.000Z |
| data.updatedAt | String | 更新时间 | - | 2026-04-28T08:00:00.000Z |

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

| 参数名称 | 参数类型 | 参数说明 | 示例值 | 备注 |
|----------|----------|----------|----------|--------|
| data | Array | 植物对象数组 | - | 含所有植物字段 |

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

---

### remove

**功能**：删除我的植物

**接口地址**：`/cloud/plant/remove`

**请求方法**：`DELETE`

> 实际调用：`wx.cloud.callFunction({ name: 'plant', data: { action: 'remove', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| id | String | 是 | - | - | String | plant-abc123 | 必填 |

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

---

### update

**功能**：更新植物信息

**接口地址**：`/cloud/plant/update`

**请求方法**：`PUT`

> 实际调用：`wx.cloud.callFunction({ name: 'plant', data: { action: 'update', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| id | String | 是 | - | - | String | plant-abc123 | 必填 |
| ...updateData | Object | 否 | - | - | Object | - | 可选，含 nickname/location/imageUrl/status |

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

---

## reminderService

> 文件：`cloudfunctions/reminder/actions/*.js`

### add

**功能**：添加提醒

**接口地址**：`/cloud/reminder/add`

**请求方法**：`POST`

> 实际调用：`wx.cloud.callFunction({ name: 'reminder', data: { action: 'add', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| plantId | String | 是 | - | - | String | plant-abc123 | 必填 |
| type | String | 是 | - | water,fertilize | String | water | 必填 |
| title | String | 是 | - | - | String | 给小绿浇水 | 必填 |
| intervalDays | Number | 是 | - | 1~365 | Number | 5 | 必填 |
| remindAt | String | 否 | - | - | String | 2026-05-03T08:00:00.000Z | 可选，不传则自动计算 |

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

| 参数名称 | 参数类型 | 参数说明 | 示例值 | 备注 |
|----------|----------|----------|----------|--------|
| data._id | String | 新提醒ID | - | reminder-abc123 |

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

---

### complete

**功能**：完成提醒（标记为已完成）

**接口地址**：`/cloud/reminder/complete`

**请求方法**：`POST`

> 实际调用：`wx.cloud.callFunction({ name: 'reminder', data: { action: 'complete', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| id | String | 是 | - | - | String | reminder-abc123 | 必填 |

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

---

### delete

**功能**：删除提醒

**接口地址**：`/cloud/reminder/delete`

**请求方法**：`DELETE`

> 实际调用：`wx.cloud.callFunction({ name: 'reminder', data: { action: 'delete', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| id | String | 是 | - | - | String | reminder-abc123 | 必填 |

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

| 参数名称 | 参数类型 | 参数说明 | 示例值 | 备注 |
|----------|----------|----------|----------|--------|
| data | Null | 无返回数据 | - | - |

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

| 参数名称 | 参数类型 | 参数说明 | 示例值 | 备注 |
|----------|----------|----------|----------|--------|
| data | Array | 提醒对象数组 | - | 含_id,plantId,type,remindAt,status |

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

| 参数名称 | 参数类型 | 参数说明 | 示例值 | 备注 |
|----------|----------|----------|----------|--------|
| data | Array | 提醒对象数组（仅用于说明结构） | - | - |

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

---

### update

**功能**：修改提醒时间

**接口地址**：`/cloud/reminder/update`

**请求方法**：`PUT`

> 实际调用：`wx.cloud.callFunction({ name: 'reminder', data: { action: 'update', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| id | String | 是 | - | - | String | reminder-abc123 | 必填 |
| nextRemindAt | String | 是 | - | - | String | 2026-05-03T08:00:00.000Z | 必填 |

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

| 参数名称 | 参数类型 | 参数说明 | 示例值 | 备注 |
|----------|----------|----------|----------|--------|
| data.nextRemindAt | String | 更新后的提醒时间 | - | 2026-05-03T08:00:00.000Z |

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

| 参数名称 | 参数类型 | 参数说明 | 示例值 | 备注 |
|----------|----------|----------|----------|--------|
| data.list | Array | 收藏花卉数组 | - | - |
| data.total | Number | 收藏总数 | 整数 | - |

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

| 参数名称 | 参数类型 | 参数说明 | 示例值 | 备注 |
|----------|----------|----------|----------|--------|
| data._id | String | 用户记录ID | - | user-abc123 |
| data.nickName | String | 昵称 | - | 花卉达人 |
| data.avatarUrl | String | 头像URL | - | - |
| data.stats | Object | 统计数据 | - | {plantCount:3,diaryCount:5,reminderCount:5} |
| data.favoriteFlowerIds | Array | 收藏花卉ID列表 | - | ["flower_001"] |
| data.createdAt | String | 创建时间 | - | 2026-04-01T08:00:00.000Z |
| data.updatedAt | String | 更新时间 | - | 2026-04-30T10:00:00.000Z |

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

| 参数名称 | 参数类型 | 参数说明 | 示例值 | 备注 |
|----------|----------|----------|----------|--------|
| data.plantCount | Number | 植物数量 | 整数 | 5 |
| data.diaryCount | Number | 日记数量 | 整数 | 12 |
| data.favoriteCount | Number | 收藏数量 | 整数 | 3 |

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

---

### login

**功能**：用户登录/注册（自动获取微信open_id）

**接口地址**：`/cloud/user/login`

**请求方法**：`POST`

> 实际调用：`wx.cloud.callFunction({ name: 'user', data: { action: 'login', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| userInfo | Object | 否 | - | - | Object | {nickName:'花友',avatarUrl:'...'} | 可选 |
| userInfo.nickName | String | 否 | - | - | String | 花友 | 可选，默认'花友' |
| userInfo.avatarUrl | String | 否 | - | - | URL | - | 可选 |

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

| 参数名称 | 参数类型 | 参数说明 | 示例值 | 备注 |
|----------|----------|----------|----------|--------|
| data | Object | 用户对象 | - | 含所有用户字段 |

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

---

### toggleFavorite

**功能**：切换花卉收藏状态（收藏/取消收藏）

**接口地址**：`/cloud/user/toggleFavorite`

**请求方法**：`POST`

> 实际调用：`wx.cloud.callFunction({ name: 'user', data: { action: 'toggleFavorite', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| flowerId | String | 是 | - | - | String | flower_001 | 必填 |

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

| 参数名称 | 参数类型 | 参数说明 | 示例值 | 备注 |
|----------|----------|----------|----------|--------|
| data.isFavorite | Boolean | 当前是否已收藏 | true/false | 是 |

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

---

### updateInfo

**功能**：更新用户信息（昵称、头像）

**接口地址**：`/cloud/user/updateInfo`

**请求方法**：`PUT`

> 实际调用：`wx.cloud.callFunction({ name: 'user', data: { action: 'updateInfo', ...params })`

**请求参数**：

| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |
|--------|------|----------|--------|----------|----------|------------|------|
| nickName | String | 否 | - | - | String | 新昵称 | 可选 |
| avatarUrl | String | 否 | - | - | URL | - | 可选 |

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

