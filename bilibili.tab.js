/**
 * B站 国际版/官方版 底部导航栏与顶栏精简脚本
 * 功能：底栏保留「首页、动态、消息、我的」，去除发布按钮(+)、会员购等冗余项
 */

let body = $response.body;

try {
  let obj = JSON.parse(body);
  if (obj && obj.data) {
    // 1. 处理底部导航栏 (bottom)
    if (Array.isArray(obj.data.bottom)) {
      // 白名单：首页、动态、消息、我的（兼容中英文与国际版命名）
      const allowNames = ["首页", "动态", "消息", "我的", "Home", "Dynamic", "Messages", "Mine", "Me"];
      const allowTabIds = ["homeTab", "dynamicTab", "messageTab", "imTab", "mineTab"];

      obj.data.bottom = obj.data.bottom.filter(item => {
        if (!item) return false;
        // 1) 匹配名称
        if (allowNames.includes(item.name)) return true;
        // 2) 匹配 tab_id
        if (item.tab_id && allowTabIds.includes(item.tab_id)) return true;
        // 3) 匹配 URI（国际版消息页面一般包含 im、message 或 chat）
        if (item.uri && (item.uri.includes("message") || item.uri.includes("im") || item.uri.includes("chat"))) {
          return true;
        }
        return false;
      });

      // 重新排序与修正位置索引
      obj.data.bottom.forEach((item, index) => {
        item.pos = index + 1;
      });
    }

    // 2. 清理顶栏营销活动标签 (top)
    if (Array.isArray(obj.data.top)) {
      obj.data.top = obj.data.top.filter(item => {
        if (!item) return false;
        // 剔除活动、游戏、商城相关的推广
        if (item.uri && (item.uri.includes("blackboard") || item.uri.includes("mall") || item.uri.includes("game"))) {
          return false;
        }
        return true;
      });
    }

    // 3. 清理顶部频道分类标签 (tab)
    if (Array.isArray(obj.data.tab)) {
      obj.data.tab = obj.data.tab.filter(item => {
        if (!item) return false;
        if (["游戏", "会员购", "活动", "Game", "Mall"].includes(item.name)) return false;
        return true;
      });
    }
  }
  body = JSON.stringify(obj);
} catch (e) {
  // 出现异常时返回原内容，保证客户端正常加载
}

$done({ body });
