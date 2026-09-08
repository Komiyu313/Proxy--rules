/**
 * B站 导航栏精简脚本（国际版适配）
 * - 顶栏：完全不做任何修改，保留「直播、推荐、热门、动画、影视」5个
 * - 底栏：仅过滤「发布(+)」和「会员购」，保留「首页、动态、消息、我的」4个
 */

let body = $response.body;

try {
  let obj = JSON.parse(body);
  if (obj && obj.data && Array.isArray(obj.data.bottom)) {
    // 仅精准剔除发布按钮(+)和会员购，其余底栏项（首页、动态、消息、我的）全部保留
    obj.data.bottom = obj.data.bottom.filter(item => {
      if (!item) return false;
      const name = item.name || item.title || "";
      const uri = item.uri || "";
      const tabId = item.tab_id || "";

      // 剔除中间的发布按钮 (+)
      if (name.includes("发布") || tabId.includes("publish") || uri.includes("publish")) {
        return false;
      }
      // 剔除会员购
      if (name.includes("会员购") || tabId.includes("mall") || uri.includes("mall") || uri.includes("shop")) {
        return false;
      }

      return true;
    });

    // 重新排序底栏索引
    obj.data.bottom.forEach((item, index) => {
      item.pos = index + 1;
    });

    body = JSON.stringify(obj);
  }
} catch (e) {
  // 解析异常时直接返回原内容
}

$done({ body });
