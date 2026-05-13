# 养花呀 - API 接口文档

> **本文档由脚本自动生成，请勿手动修改**
>
> **生成时间**：2026/5/14 00:10:06
>
> **版本**：1.0.0
>
> **云环境 ID**：cloud1-d1gjubt747d28d4ac

---

## 目录

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

## commonService

> 文件：`miniprogram/services/common.js`

### getHomeData

**功能**：获取首页聚合数据（每日贴士 + 推荐花卉）

**调用方式**：`wx.cloud.callFunction({ name: 'common', data: { action: 'getHomeData' } })`

**请求参数**：无

**正确返回 JSON**：

```json
{
  "code": 0,
  "data": { ... }
}
```

**响应参数**：

| 参数名 | 类型 | 参数格式 | 说明 |
|--------|------|----------|------|
| code | Number | - | 状态码（0=成功） |
| data | Object | - | 首页数据 |
| data.dailyTip | String | - | 每日养护贴士 |
| data.recommendList | Array | - | 推荐花卉列表 |

**调用示例**：

```javascript
const res = await commonService.getHomeData()
```

---

### getDailyTip

**功能**：获取每日养花小贴士

**调用方式**：`wx.cloud.callFunction({ name: 'common', data: { action: 'getDailyTip' } })`

**请求参数**：无

**正确返回 JSON**：

```json
{
  "code": 0,
  "data": { ... }
}
```

**响应参数**：

| 参数名 | 类型 | 参数格式 | 说明 |
|--------|------|----------|------|
| code | Number | - | 状态码（0=成功） |
| data | Object | - | 贴士数据 |
| data.content | String | - | 贴士内容 |

**调用示例**：

```javascript
const res = await commonService.getDailyTip()
```

---

## diaryService

> 文件：`miniprogram/services/diary.js`

### add

**功能**：添加植物生长日记

**调用方式**：`wx.cloud.callFunction({ name: 'diary', data: { action: 'add', ...params } })`

**请求参数**：

| 参数名 | 类型 | 必填 | 默认值 | 取值范围 | 参数格式 | 示例值 | 说明 |
|--------|------|------|--------|----------|----------|--------|------|
| data.plantId | String | 是 | - | - | - | - | 植物 ID（必填） |
| data.content | String | 是 | - | - | - | - | 日记内容（必填） |
| data.images | Array | 否 | [] | - | - | - | 图片 URL 数组 |

**正确返回 JSON**：

```json
{
  "code": 0,
  "data": { ... }
}
```

**响应参数**：

| 参数名 | 类型 | 参数格式 | 说明 |
|--------|------|----------|------|
| code | Number | - | 状态码（0=成功） |
| data | Object | - | 创建结果 |
| data._id | String | - | 新日记的 ID |

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

**调用方式**：`wx.cloud.callFunction({ name: 'diary', data: { action: 'list', ...params } })`

**请求参数**：

| 参数名 | 类型 | 必填 | 默认值 | 取值范围 | 参数格式 | 示例值 | 说明 |
|--------|------|------|--------|----------|----------|--------|------|
| plantId | String | 否 | - | - | - | - | 植物 ID（可选，不传则返回全部日记） |

**正确返回 JSON**：

```json
{
  "code": 0,
  "data": { ... }
}
```

**响应参数**：

| 参数名 | 类型 | 参数格式 | 说明 |
|--------|------|----------|------|
| code | Number | - | 状态码（0=成功） |
| data | Array | - | 日记列表 |
| data[]._id | String | - | 日记 ID |
| data[].plantId | String | - | 关联植物 ID |
| data[].content | String | - | 日记内容 |
| data[].images | Array | - | 图片 URL 数组 |
| data[].createdAt | Date | - | 创建时间 |

**调用示例**：

```javascript
const res = await diaryService.getList('plant-id-123')
const res = await diaryService.getList()
```

---

### remove

**功能**：删除日记

**调用方式**：`wx.cloud.callFunction({ name: 'diary', data: { action: 'delete', ...params } })`

**请求参数**：

| 参数名 | 类型 | 必填 | 默认值 | 取值范围 | 参数格式 | 示例值 | 说明 |
|--------|------|------|--------|----------|----------|--------|------|
| id | String | 是 | - | - | - | - | 日记 ID |

**正确返回 JSON**：

```json
{
  "code": 0,
  "data": { ... }
}
```

**响应参数**：

| 参数名 | 类型 | 参数格式 | 说明 |
|--------|------|----------|------|
| code | Number | - | 状态码（0=成功） |
| message | String | - | 提示信息 |

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

**调用方式**：`wx.cloud.callFunction({ name: 'flower', data: { action: 'list', ...params } })`

**请求参数**：

| 参数名 | 类型 | 必填 | 默认值 | 取值范围 | 参数格式 | 示例值 | 说明 |
|--------|------|------|--------|----------|----------|--------|------|
| params.page | Number | 否 | 1 | - | - | - | 页码，默认 1 |
| params.pageSize | Number | 否 | 20 | - | - | - | 每页数量，默认 20 |
| params.category | Number | 否 | - | - | - | - | 分类筛选（1=观叶 2=观花 3=多肉 4=果蔬） |

**正确返回 JSON**：

```json
{
  "code": 0,
  "data": { ... }
}
```

**响应参数**：

| 参数名 | 类型 | 参数格式 | 说明 |
|--------|------|----------|------|
| code | Number | - | 状态码（0=成功） |
| data | Array | - | 花卉列表 |
| data[]._id | String | - | 花卉 ID |
| data[].name | String | - | 花卉名称 |
| data[].alias | Array | - | 别名数组 |
| data[].category | Number | - | 分类（1=观叶 2=观花 3=多肉 4=果蔬） |
| data[].difficulty | Number | - | 养护难度（1-5） |
| data[].coverImage | String | - | 封面图 URL |
| data[].description | String | - | 描述 |

**调用示例**：

```javascript
const res = await flowerService.getList({ page: 1, pageSize: 20 })
const res = await flowerService.getList({ category: 2 })
```

---

### getDetail

**功能**：获取花卉详情

**调用方式**：`wx.cloud.callFunction({ name: 'flower', data: { action: 'detail', ...params } })`

**请求参数**：

| 参数名 | 类型 | 必填 | 默认值 | 取值范围 | 参数格式 | 示例值 | 说明 |
|--------|------|------|--------|----------|----------|--------|------|
| id | String | 是 | - | - | - | - | 花卉 ID |

**正确返回 JSON**：

```json
{
  "code": 0,
  "data": { ... }
}
```

**响应参数**：

| 参数名 | 类型 | 参数格式 | 说明 |
|--------|------|----------|------|
| code | Number | - | 状态码（0=成功） |
| data | Object | - | 花卉详情 |
| data._id | String | - | 花卉 ID |
| data.name | String | - | 花卉名称 |
| data.alias | Array | - | 别名数组 |
| data.category | Number | - | 分类（1=观叶 2=观花 3=多肉 4=果蔬） |
| data.difficulty | Number | - | 养护难度（1-5） |
| data.waterDays | Number | - | 浇水间隔天数 |
| data.fertilizeDays | Number | - | 施肥间隔天数 |
| data.light | String | - | 光照需求 |
| data.soil | String | - | 土壤要求 |
| data.temperature | String | - | 温度范围 |
| data.coverImage | String | - | 封面图 URL |
| data.description | String | - | 描述 |
| data.tips | Array | - | 养护技巧数组 |

**可能返回的错误码**：

| 错误码 | 错误信息 | 含义 |
|--------|----------|------|
| 1002 | 缺少必填参数 | |

**调用示例**：

```javascript
const res = await flowerService.getDetail('flower-id-123')
```

---

### search

**功能**：搜索花卉（按名称或别名匹配）

**调用方式**：`wx.cloud.callFunction({ name: 'flower', data: { action: 'search', ...params } })`

**请求参数**：

| 参数名 | 类型 | 必填 | 默认值 | 取值范围 | 参数格式 | 示例值 | 说明 |
|--------|------|------|--------|----------|----------|--------|------|
| keyword | String | 是 | - | - | - | - | 搜索关键词 |

**正确返回 JSON**：

```json
{
  "code": 0,
  "data": { ... }
}
```

**响应参数**：

| 参数名 | 类型 | 参数格式 | 说明 |
|--------|------|----------|------|
| code | Number | - | 状态码（0=成功） |
| data | Array | - | 匹配的花卉列表，空关键词返回空数组 |

**调用示例**：

```javascript
const res = await flowerService.search('月季')
```

---

### getRecommend

**功能**：获取推荐花卉（随机 6 条）

**调用方式**：`wx.cloud.callFunction({ name: 'flower', data: { action: 'recommend' } })`

**请求参数**：无

**正确返回 JSON**：

```json
{
  "code": 0,
  "data": { ... }
}
```

**响应参数**：

| 参数名 | 类型 | 参数格式 | 说明 |
|--------|------|----------|------|
| code | Number | - | 状态码（0=成功） |
| data | Array | - | 推荐花卉列表 |

**调用示例**：

```javascript
const res = await flowerService.getRecommend()
```

---

## plantService

> 文件：`miniprogram/services/plant.js`

### add

**功能**：添加植物到我的花园

**调用方式**：`wx.cloud.callFunction({ name: 'plant', data: { action: 'add', ...params } })`

**请求参数**：

| 参数名 | 类型 | 必填 | 默认值 | 取值范围 | 参数格式 | 示例值 | 说明 |
|--------|------|------|--------|----------|----------|--------|------|
| data.flowerId | String | 是 | - | - | - | - | 花卉 ID（必填） |
| data.flowerName | String | 否 | - | - | - | - | 花卉名称 |
| data.nickname | String | 否 | - | - | - | - | 昵称，默认使用花卉名称 |
| data.location | String | 否 | - | - | - | - | 位置（如"客厅"） |
| data.imageUrl | String | 否 | - | - | - | - | 照片 URL |

**正确返回 JSON**：

```json
{
  "code": 0,
  "data": { ... }
}
```

**响应参数**：

| 参数名 | 类型 | 参数格式 | 说明 |
|--------|------|----------|------|
| code | Number | - | 状态码（0=成功） |
| data | Object | - | 创建结果 |
| data._id | String | - | 新植物的 ID |

**可能返回的错误码**：

| 错误码 | 错误信息 | 含义 |
|--------|----------|------|
| 1002 | 缺少必填参数 | |

**调用示例**：

```javascript
const res = await plantService.add({
flowerId: 'flower-id-123',
nickname: '客厅的绿萝',
location: '客厅'
})
```

---

### getList

**功能**：获取我的植物列表

**调用方式**：`wx.cloud.callFunction({ name: 'plant', data: { action: 'list' } })`

**请求参数**：无

**正确返回 JSON**：

```json
{
  "code": 0,
  "data": { ... }
}
```

**响应参数**：

| 参数名 | 类型 | 参数格式 | 说明 |
|--------|------|----------|------|
| code | Number | - | 状态码（0=成功） |
| data | Array | - | 植物列表 |
| data[]._id | String | - | 植物 ID |
| data[].flowerId | String | - | 关联花卉 ID |
| data[].flowerName | String | - | 花卉名称 |
| data[].nickname | String | - | 昵称 |
| data[].location | String | - | 位置 |
| data[].imageUrl | String | - | 照片 URL |
| data[].status | String | - | 状态（healthy=健康） |
| data[].createdAt | Date | - | 创建时间 |
| data[].updatedAt | Date | - | 更新时间 |

**调用示例**：

```javascript
const res = await plantService.getList()
```

---

### update

**功能**：更新植物信息

**调用方式**：`wx.cloud.callFunction({ name: 'plant', data: { action: 'update', ...params } })`

**请求参数**：

| 参数名 | 类型 | 必填 | 默认值 | 取值范围 | 参数格式 | 示例值 | 说明 |
|--------|------|------|--------|----------|----------|--------|------|
| id | String | 是 | - | - | - | - | 植物 ID |
| data.nickname | String | 否 | - | - | - | - | 昵称 |
| data.location | String | 否 | - | - | - | - | 位置 |
| data.imageUrl | String | 否 | - | - | - | - | 照片 URL |
| data.status | String | 否 | - | - | - | - | 状态 |

**正确返回 JSON**：

```json
{
  "code": 0,
  "data": { ... }
}
```

**响应参数**：

| 参数名 | 类型 | 参数格式 | 说明 |
|--------|------|----------|------|
| code | Number | - | 状态码（0=成功） |
| message | String | - | 提示信息 |

**可能返回的错误码**：

| 错误码 | 错误信息 | 含义 |
|--------|----------|------|
| 1002 | 缺少必填参数 | |

**调用示例**：

```javascript
const res = await plantService.update('plant-id-123', { nickname: '阳台的月季' })
```

---

### remove

**功能**：删除植物

**调用方式**：`wx.cloud.callFunction({ name: 'plant', data: { action: 'remove', ...params } })`

**请求参数**：

| 参数名 | 类型 | 必填 | 默认值 | 取值范围 | 参数格式 | 示例值 | 说明 |
|--------|------|------|--------|----------|----------|--------|------|
| id | String | 是 | - | - | - | - | 植物 ID |

**正确返回 JSON**：

```json
{
  "code": 0,
  "data": { ... }
}
```

**响应参数**：

| 参数名 | 类型 | 参数格式 | 说明 |
|--------|------|----------|------|
| code | Number | - | 状态码（0=成功） |
| message | String | - | 提示信息 |

**可能返回的错误码**：

| 错误码 | 错误信息 | 含义 |
|--------|----------|------|
| 1002 | 缺少必填参数 | |

**调用示例**：

```javascript
const res = await plantService.remove('plant-id-123')
```

---

## reminderService

> 文件：`miniprogram/services/reminder.js`

### getList

**功能**：获取提醒列表（待处理的提醒）

**调用方式**：`wx.cloud.callFunction({ name: 'reminder', data: { action: 'list' } })`

**请求参数**：无

**正确返回 JSON**：

```json
{
  "code": 0,
  "data": { ... }
}
```

**响应参数**：

| 参数名 | 类型 | 参数格式 | 说明 |
|--------|------|----------|------|
| code | Number | - | 状态码（0=成功） |
| data | Array | - | 提醒列表 |
| data[]._id | String | - | 提醒 ID |
| data[].plantId | String | - | 关联植物 ID |
| data[].type | String | - | 提醒类型 |
| data[].remindAt | Date | - | 提醒时间 |
| data[].status | String | - | 状态（pending=待处理） |

**调用示例**：

```javascript
const res = await reminderService.getList()
```

---

### complete

**功能**：完成提醒（标记为已完成）

**调用方式**：`wx.cloud.callFunction({ name: 'reminder', data: { action: 'complete', ...params } })`

**请求参数**：

| 参数名 | 类型 | 必填 | 默认值 | 取值范围 | 参数格式 | 示例值 | 说明 |
|--------|------|------|--------|----------|----------|--------|------|
| id | String | 是 | - | - | - | - | 提醒 ID |

**正确返回 JSON**：

```json
{
  "code": 0,
  "data": { ... }
}
```

**响应参数**：

| 参数名 | 类型 | 参数格式 | 说明 |
|--------|------|----------|------|
| code | Number | - | 状态码（0=成功） |
| message | String | - | 提示信息 |

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

**调用方式**：`wx.cloud.callFunction({ name: 'user', data: { action: 'login', ...params } })`

**请求参数**：

| 参数名 | 类型 | 必填 | 默认值 | 取值范围 | 参数格式 | 示例值 | 说明 |
|--------|------|------|--------|----------|----------|--------|------|
| userInfo.nickName | String | 否 | - | - | - | - | 昵称 |
| userInfo.avatarUrl | String | 否 | - | - | - | - | 头像 URL |

**正确返回 JSON**：

```json
{
  "code": 0,
  "data": { ... }
}
```

**响应参数**：

| 参数名 | 类型 | 参数格式 | 说明 |
|--------|------|----------|------|
| code | Number | - | 状态码（0=成功） |
| data | Object | - | 用户信息 |
| data._id | String | - | 用户 ID |
| data._openid | String | - | 微信 OpenID |
| data.nickName | String | - | 昵称 |
| data.avatarUrl | String | - | 头像 URL |
| data.favorites | Array | - | 收藏的花卉 ID 数组 |
| data.createdAt | Date | - | 创建时间 |
| data.lastLoginAt | Date | - | 最后登录时间 |

**调用示例**：

```javascript
const res = await userService.login()
const res = await userService.login({ nickName: '花友', avatarUrl: 'https://...' })
```

---

### updateInfo

**功能**：更新用户昵称和头像

**调用方式**：`wx.cloud.callFunction({ name: 'user', data: { action: 'updateInfo', ...params } })`

**请求参数**：

| 参数名 | 类型 | 必填 | 默认值 | 取值范围 | 参数格式 | 示例值 | 说明 |
|--------|------|------|--------|----------|----------|--------|------|
| data.nickName | String | 否 | - | - | - | - | 昵称 |
| data.avatarUrl | String | 否 | - | - | - | - | 头像 URL |

**正确返回 JSON**：

```json
{
  "code": 0,
  "data": { ... }
}
```

**响应参数**：

| 参数名 | 类型 | 参数格式 | 说明 |
|--------|------|----------|------|
| code | Number | - | 状态码（0=成功） |
| message | String | - | 提示信息 |

**调用示例**：

```javascript
const res = await userService.updateInfo({ nickName: '新昵称' })
```

---

### toggleFavorite

**功能**：切换收藏状态（已收藏则取消，未收藏则添加）

**调用方式**：`wx.cloud.callFunction({ name: 'user', data: { action: 'toggleFavorite', ...params } })`

**请求参数**：

| 参数名 | 类型 | 必填 | 默认值 | 取值范围 | 参数格式 | 示例值 | 说明 |
|--------|------|------|--------|----------|----------|--------|------|
| flowerId | String | 是 | - | - | - | - | 花卉 ID |

**正确返回 JSON**：

```json
{
  "code": 0,
  "data": { ... }
}
```

**响应参数**：

| 参数名 | 类型 | 参数格式 | 说明 |
|--------|------|----------|------|
| code | Number | - | 状态码（0=成功） |
| data | Object | - | 收藏状态 |
| data.isFavorite | Boolean | - | 当前是否已收藏 |

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

**调用方式**：`wx.cloud.callFunction({ name: 'user', data: { action: 'getFavorites' } })`

**请求参数**：无

**正确返回 JSON**：

```json
{
  "code": 0,
  "data": { ... }
}
```

**响应参数**：

| 参数名 | 类型 | 参数格式 | 说明 |
|--------|------|----------|------|
| code | Number | - | 状态码（0=成功） |
| data | Object | - | 收藏数据 |
| data.list | Array | - | 收藏的花卉列表 |
| data.total | Number | - | 收藏总数 |

**调用示例**：

```javascript
const res = await userService.getFavorites()
console.log(res.data.list)
console.log(res.data.total)
```

---

### getStats

**功能**：获取用户统计（植物数、日记数、收藏数）

**调用方式**：`wx.cloud.callFunction({ name: 'user', data: { action: 'getStats' } })`

**请求参数**：无

**正确返回 JSON**：

```json
{
  "code": 0,
  "data": { ... }
}
```

**响应参数**：

| 参数名 | 类型 | 参数格式 | 说明 |
|--------|------|----------|------|
| code | Number | - | 状态码（0=成功） |
| data | Object | - | 统计数据 |
| data.plantCount | Number | - | 植物数量 |
| data.diaryCount | Number | - | 日记数量 |
| data.favoriteCount | Number | - | 收藏数量 |

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
