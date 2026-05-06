# 🎨 养花呀 — UI 设计稿提示词（GPT-Image2 用）

> 统一配色：主绿 `#4CAF50`，暖白背景 `#F8FBF5`，点缀珊瑚色 `#FF7043`  
> 设备框架：iPhone 14 Pro，390×844px viewport  
> 建议导出 2x（780×1688px）以便看清细节

---

## 1️⃣ 首页 — Home

```
Design a modern WeChat Mini Program home screen for a plant care app called "养花呀" (Flora). The screen should include:

1. Top: A rounded search bar with placeholder "搜索花卉..."
2. A "Daily Plant Tip" card with soft green gradient background, a small leaf icon, and one line of care advice text
3. A horizontal scrollable "Seasonal Care" section with 4 circular icon cards (watering, sunlight, pruning, fertilizing) in pastel green/yellow/blue tones
4. A "Recommended Plants" section with vertical cards showing: a beautiful flower photo on the left (30%), plant name, category tag pill, short description, and difficulty stars on the right

Style: Clean, fresh, nature-inspired. Color palette: primary #4CAF50 green, accent soft coral, background #F8FBF5 warm white-green. Rounded corners (16px), subtle shadows, plenty of white space. iOS-style design language. Bottom tab bar with 4 items: Home (active, green), Encyclopedia, Garden, Profile.

Device frame: iPhone 14 Pro, status bar visible, 390x844px viewport.
```

---

## 2️⃣ 百科列表 — Encyclopedia List

```
Design a WeChat Mini Program plant encyclopedia list screen for "养花呀" (Flora) app.

Layout from top to bottom:
1. Search input bar with magnifying glass icon
2. Horizontal scrollable category filter chips: "全部", "观花", "观叶", "多肉", "水培", with active chip in solid green
3. Result count text "共 28 种花卉"
4. Vertical list of plant cards, each card containing:
   - Left: square thumbnail with rounded corners showing a real flower photo
   - Right area: plant name (bold), difficulty shown as colored dots, category tag pill, one-line description

Style: Bright, botanical feel. Cards have 12px rounded corners with very subtle shadows. White card background on #F5F7F3 page background. Green primary color #4CAF50. Clean typography with good hierarchy. Cards have 16px padding and 12px gap between them.

Device frame: iPhone 14 Pro, 390x844px. Show 3-4 cards visible.
```

---

## 3️⃣ 百科详情 — Encyclopedia Detail

```
Design a WeChat Mini Program plant detail page for "养花呀" (Flora) app showing a flower species detail.

Layout:
1. Hero section: full-width beautiful photo of a rose (top 40% of screen) with gradient overlay at bottom fading to white
2. Floating back button (top-left) and share button (top-right) over the image
3. Below image: Plant name "月季" in large bold text, aliases in gray, category + difficulty tag pills
4. A "花语" (flower language) quote in italic with a subtle floral divider
5. Care guide section: 2x3 grid of care info cards, each with a colored icon circle (water=blue, sun=yellow, soil=brown, temperature=red, fertilizer=green, humidity=cyan), label, and value text
6. Tips section: numbered list with green bullet points
7. Fixed bottom bar: outline heart button (favorite) and solid green "添加到花园" (Add to Garden) CTA button

Style: Editorial, magazine-quality layout. Generous spacing. Elegant serif font for flower name. Soft nature colors. Hero image takes center stage. Cards have soft colored backgrounds matching their icon theme.

Device frame: iPhone 14 Pro, 390x844px.
```

---

## 4️⃣ 花园首页 — My Garden

```
Design a WeChat Mini Program "My Garden" page for "养花呀" (Flora) plant care app.

Layout:
1. Top section: "Today's Tasks" card with warm amber/orange gradient header accent. Contains 2-3 task items, each showing: a small circular plant avatar, plant name, task type (watering/fertilizing), time, and a circular green checkmark button on the right
2. Main section: "My Plants" header with count badge and a "+ Add" button in green
3. Plant cards in a vertical list. Each card shows:
   - Left: circular plant photo with a colored ring border (green=healthy, orange=needs attention)
   - Center: nickname (bold), flower species name + location in gray, "养了 XX 天" days counter
   - Right: health status pill badge (绿色"健康" or 橙色"需关注"), last watered time
4. Cards have slight left green border accent for healthy plants, orange for attention-needed

Style: Warm, nurturing feel. Mix of greens and warm amber for urgency. Card-based layout with 14px rounded corners. Subtle plant leaf watermark in background. Clean and organized.

Device frame: iPhone 14 Pro, 390x844px. Bottom tab bar with "花园" tab active.
```

---

## 5️⃣ 植物详情 — Plant Detail

```
Design a WeChat Mini Program plant detail/diary page for "养花呀" (Flora) app.

Layout:
1. Top: Large circular plant photo (centered, 120px) with a soft green halo glow effect
2. Below photo: Plant nickname "小绿" in bold, species "绿萝" in gray subtitle
3. Info pills row: 📍阳台, 🗓️养了62天, 🌱状态良好 — in horizontal scrollable tag pills
4. Statistics mini cards row: 3 small cards showing watering count, diary entries, health score
5. "Growth Diary" section with timeline design:
   - Vertical green dotted line on the left
   - Each diary entry as a card branching from the timeline
   - Entry shows: date bubble, photo thumbnail (if any), text content, mood tag
   - Most recent on top
6. Floating action button (bottom-right): "+" to add new diary entry, circular green with white plus icon

Style: Personal, journal-like feel. Soft paper texture suggestion. Timeline design adds visual interest. Warm lighting feel on plant photo. Mix of greens with cream/beige accents. Handwriting-style date labels.

Device frame: iPhone 14 Pro, 390x844px.
```

---

## 6️⃣ 个人中心 — Profile

```
Design a WeChat Mini Program profile/settings page for "养花呀" (Flora) plant care app.

Layout:
1. Top: User profile card with large circular avatar (with green leaf-shaped frame decoration), username "花友小熊" below, and a motivational tagline "用心养花，静待花开 🌸" in light gray
2. Background: subtle botanical illustration watermark (very light opacity) behind the profile area
3. Statistics row: 3 columns with large bold numbers and labels below — "12 我的植物", "28 成长日记", "8 我的收藏" — with subtle dividers between
4. Menu section: rounded card containing menu items with icons:
   - 🔔 养护提醒 (with notification count badge "3" in red)
   - ❤️ 我的收藏
   - 📖 种植指南
   - ⚙️ 设置
   - ℹ️ 关于养花呀
   Each item has left icon, text, and right chevron arrow
5. Small "退出登录" text button at very bottom

Style: Clean, personal, cozy. Soft gradient green at top fading to white. Card elements with generous padding. Profile area feels premium and polished. Icons could be in matching green/coral tones rather than raw emoji.

Device frame: iPhone 14 Pro, 390x844px. Bottom tab bar with "我的" tab active.
```

---

## 7️⃣ 养护提醒 — Care Reminders

```
Design a WeChat Mini Program care reminder/task list page for "养花呀" (Flora) app.

Layout:
1. Page header: "养护提醒" title with a small bell icon, and subtitle "共 6 条提醒"
2. Filter tabs: "全部 | 今日 | 待完成 | 已完成" horizontal tabs
3. Reminder cards in timeline style:
   - Left: time indicator with colored dot (green=upcoming, orange=overdue, gray=done)
   - Card content: plant avatar circle, plant name, task type tag pill (浇水=blue, 施肥=green, 换盆=brown), scheduled time
   - Right: circular checkbox (unchecked=hollow circle, checked=green filled checkmark)
   - Completed items have lower opacity and strikethrough text
4. Visual variety: group reminders by time period (上午/下午/晚上) with subtle time dividers

Style: Task-manager inspired but nature-themed. Time-based visual hierarchy. Blue/green for water tasks, amber for fertilizer, brown for repotting. Cards stack vertically with 10px gap. Satisfying completion state design with smooth green checkmarks.

Device frame: iPhone 14 Pro, 390x844px.
```

---

## 8️⃣ 种植指南 — Planting Guide

```
Design a WeChat Mini Program planting guide list page for "养花呀" (Flora) app.

Layout:
1. Page header: "种植指南" with a book icon
2. Featured guide: top large card with hero image (hands planting a seedling), overlay title "新手入门：如何开始你的第一盆花", reading time "5 min read" badge
3. Category section: horizontal icon circles — "入门基础", "浇水技巧", "光照指南", "施肥方案", "病虫防治", "换盆教程"
4. Guide list: vertical cards, each containing:
   - Left: square thumbnail with rounded corners (showing related plant care photo)
   - Right: guide title (bold), 2-line description excerpt, difficulty tag + reading time at bottom
   - Subtle right arrow indicator

Style: Educational, magazine/blog-like feel. Rich imagery. Cards feel like articles you want to tap into. Clean typography with clear hierarchy. Warm botanical photography. White cards on very light sage green background (#F7FAF5).

Device frame: iPhone 14 Pro, 390x844px.
```

---

## 📌 使用建议

1. **按顺序生成**：建议先生成首页和百科详情（视觉冲击力最强），确定整体风格基调后再生成其余页面
2. **统一风格**：每次生成时可以在提示词末尾追加 `"Maintain consistent style with previous screens"` 保证系列感
3. **导出尺寸**：建议导出 2x（780×1688px）以便看清细节
4. **配色锁定**：所有页面统一使用 `#4CAF50` 主绿 + `#F8FBF5` 暖白背景 + `#FF7043` 点缀珊瑚色
