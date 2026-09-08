/**
 * B站 导航栏精简脚本（国际版适配）
 * - 顶栏：对齐原版模块，补全「直播、推荐、热门、动画、影视」5个频道
 * - 底栏：保持已生效的「首页、关注、消息、我的」4项，过滤「发布」和「会员购」
 */

let body = $response.body;

try {
  let obj = JSON.parse(body);
  if (obj && obj.data) {
    // 1. 顶栏：直接使用原版模块的 5 个频道数据（补全 热门、影视）
    obj.data.tab = [
      { pos: 1, id: 731, name: "直播", tab_id: "直播Tab", uri: "bilibili://live/home" },
      { pos: 2, id: 477, name: "推荐", tab_id: "推荐tab", uri: "bilibili://pegasus/promo", default_selected: 1 },
      { pos: 3, id: 478, name: "热门", tab_id: "热门tab", uri: "bilibili://pegasus/hottopic" },
      { pos: 4, id: 3502, name: "动画", tab_id: "bangumi", uri: "bilibili://pgc/bangumi_v2" },
      { pos: 5, id: 3503, name: "影视", tab_id: "film", uri: "bilibili://pgc/cinema_v2" }
    ];

    // 2. 底栏：保持当前已经成功的过滤逻辑不变
    if (Array.isArray(obj.data.bottom)) {
      obj.data.bottom = obj.data.bottom.filter(item => {
        if (!item) return false;
        const name = item.name || item.title || "";
        const uri = item.uri || "";
        const tabId = item.tab_id || "";

        // 剔除发布按钮 (+)
        if (name.includes("发布") || tabId.includes("publish") || uri.includes("publish")) {
          return false;
        }
        // 剔除会员购
        if (name.includes("会员购") || tabId.includes("mall") || uri.includes("mall") || uri.includes("shop")) {
          return false;
        }

        return true;
      });

      // 重新对底栏排序
      obj.data.bottom.forEach((item, index) => {
        item.pos = index + 1;
      });
    }

    body = JSON.stringify(obj);
  }
} catch (e) {
  // 解析异常时直接返回原内容
}

$done({ body });
