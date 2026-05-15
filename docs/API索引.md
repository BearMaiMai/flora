# API 索引（超简洁版）

> 完整文档：`docs/API接口与复用清单.md`  
> 代码真相：`miniprogram/services/*.js`

---

## flowerService (`services/flower.js`)

- `getList(params = {})` → 花卉列表
- `getDetail(id)` → 花卉详情
- `search(keyword)` → 搜索花卉
- `getRecommend()` → 推荐花卉

---

## plantService (`services/plant.js`)

- `add(data)` → 添加植物
- `getList()` → 我的植物列表
- `update(id, data)` → 更新植物
- `remove(id)` → 删除植物

---

## diaryService (`services/diary.js`)

- `add(data)` → 添加日记
- `getList(plantId?)` → 日记列表
- `remove(id)` → 删除日记

---

## reminderService (`services/reminder.js`)

- `getList()` → 提醒列表
- `complete(id)` → 完成提醒

---

## userService (`services/user.js`)

- `login(userInfo?)` → 登录/注册
- `updateInfo(data)` → 更新用户信息
- `toggleFavorite(flowerId)` → 切换收藏
- `getFavorites()` → 收藏列表
- `getStats()` → 用户统计

---

## commonService (`services/common.js`)

- `getHomeData()` → 首页数据
- `getDailyTip()` → 每日贴士

---

## 云函数 Action 映射

| 云函数 | Action | 对应 Service 方法 |
|--------|--------|-------------------|
| `flower` | `list` | flowerService.getList() |
| `flower` | `detail` | flowerService.getDetail() |
| `flower` | `search` | flowerService.search() |
| `flower` | `recommend` | flowerService.getRecommend() |
| `plant` | `add` | plantService.add() |
| `plant` | `list` | plantService.getList() |
| `plant` | `update` | plantService.update() |
| `plant` | `delete` | plantService.remove() |
| `diary` | `add` | diaryService.add() |
| `diary` | `list` | diaryService.getList() |
| `diary` | `delete` | diaryService.remove() |
| `reminder` | `list` | reminderService.getList() |
| `reminder` | `complete` | reminderService.complete() |
| `user` | `login` | userService.login() |
| `user` | `updateInfo` | userService.updateInfo() |
| `user` | `toggleFavorite` | userService.toggleFavorite() |
| `user` | `getFavorites` | userService.getFavorites() |
| `user` | `getStats` | userService.getStats() |
| `common` | `getHomeData` | commonService.getHomeData() |
| `common` | `getDailyTip` | commonService.getDailyTip() |

---

**使用建议**：
- 需要完整参数/返回值 → 读 `miniprogram/services/xxx.js`
- 需要云函数实现 → 读 `cloudfunctions/xxx/actions/yyy.js`
