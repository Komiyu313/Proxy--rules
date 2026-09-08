/**
 * 基于 Sparkle 原版模板 1:1 定制
 * - 顶栏：保留「直播、推荐、热门、动画、影视」5项
 * - 底栏：在「首页、动态、我的」基础上恢复「消息」项
 */

let body = $response.body;

try {
  let obj = JSON.parse(body);
  if (obj && obj.data) {
    // 1. 完全对齐原作者定义的 5 个顶栏标签
    obj.data.tab = [
      { pos: 1, id: 731, name: "直播", tab_id: "直播Tab", uri: "bilibili://live/home" },
      { pos: 2, id: 477, name: "推荐", tab_id: "推荐tab", uri: "bilibili://pegasus/promo", default_selected: 1 },
      { pos: 3, id: 478, name: "热门", tab_id: "热门tab", uri: "bilibili://pegasus/hottopic" },
      { pos: 4, id: 3502, name: "动画", tab_id: "bangumi", uri: "bilibili://pgc/bangumi_v2" },
      { pos: 5, id: 3503, name: "影视", tab_id: "film", uri: "bilibili://pgc/cinema_v2" }
    ];

    // 2. 顶栏消息入口保留（保持原版结构一致）
    obj.data.top =
