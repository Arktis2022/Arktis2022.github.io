# Activities 地图 · 本地实验

本地分支：`codex/activities-map-preview`。本次未推送、未修改线上主页。

## 查看

在本仓库启动本地 HTTP 预览，访问 `http://127.0.0.1:8000/#activities`。地图位于 Activities 标题下，完整原始列表放在可展开的 Activity archive 中。

支持年份筛选、时间线播放与拖动、地点点击、键盘选点、照片查看、世界 / 东亚视图、地图缩放。手机端也可从地点下拉框选择地点。年份刻度按该年首条活动在时间线中的实际位置排列。连接线仅表示记录的时间先后，不能解释为实际航班或完整旅行路线。

## 信息维护

日期、活动描述、照片全部在页面加载时读取 `contents/activities.md`，不用维护第二份行程表。地图从原文中的明确地点识别城市；同一天的两条记录保留为独立活动。

未出现城市的活动保留在原始列表和地图的待补充区。现有数据共有 34 条，其中 23 条有明确地点，11 条待补城市。

如不想修改活动正文，可在该行末尾添加隐形注释：

```md
- *2026.01.09*, Attended an event. [Photo](contents/image/example.jpg) <!-- place:beijing -->
```

首次出现的新地点，可在 `static/js/journey.js` 开头的 `PLACES` 中增加城市 ID、国家、坐标和识别规则。坐标精确到城市中心即可。地点数量按独立地点计，怀柔与北京市中心分开显示；国家口径将香港计入中国。

## 结构与性能

- `static/js/journey.js`：信息解析、地图交互和播放。
- `static/css/journey.css`：组件样式，沿用主页酒红色与浅色底。
- `index.html`：Activities 栏目插入组件；保留完整列表。
- `static/js/scripts.js`：把已读取的 Activities 文本交给地图，避免重复请求。
- `static/vendor/`、`static/data/`：D3、TopoJSON 与 Natural Earth 地图数据及许可。

图库与地图依赖均在本地。接近 Activities 区域才加载约 334 KB 的库与地理数据；不依赖地图瓦片服务或 API key。外链照片沿用原活动链接。

## 已验证

桌面及手机预览、年份筛选、前后步进、自动播放、选点与视野恢复、手机地点选择、年份刻度、同日独立记录、新增 Activities 自动同步、无地点年份、空文件和读取失败状态均已检查。
