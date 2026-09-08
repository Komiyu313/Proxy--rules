/**
 * B站 导航栏精简脚本
 *
 * 顶栏：
 *   直播 / 推荐 / 热门 / 动画 / 影视
 *
 * 右上角：
 *   仅保留「消息」
 *   屏蔽「游戏」等其他按钮
 *
 * 底栏：
 *   保留「首页 / 关注 / 我的」
 *   删除「消息 / 发布 / 会员购」
 */

let body = $response.body;

try {
  let obj = JSON.parse(body);

  if (obj && obj.data) {

    // ============================================================
    // 1. 首页顶部五个频道
    // ============================================================

    obj.data.tab = [
      {
        pos: 1,
        id: 731,
        name: "直播",
        tab_id: "直播tab",
        uri: "bilibili://live/home"
      },
      {
        pos: 2,
        id: 477,
        name: "推荐",
        tab_id: "推荐tab",
        uri: "bilibili://pegasus/promo",
        default_selected: 1
      },
      {
        pos: 3,
        id: 478,
        name: "热门",
        tab_id: "热门tab",
        uri: "bilibili://pegasus/hottopic"
      },
      {
        pos: 4,
        id: 3502,
        name: "动画",
        tab_id: "bangumi",
        uri: "bilibili://pgc/bangumi_v2"
      },
      {
        pos: 5,
        id: 3503,
        name: "影视",
        tab_id: "film",
        uri: "bilibili://pgc/cinema_v2"
      }
    ];

    // ============================================================
    // 2. 右上角功能
    //    只保留「消息」
    // ============================================================

    obj.data.top = [
      {
        pos: 1,
        id: 176,
        name: "消息",
        tab_id: "消息Top",
        uri: "bilibili://link/im_home",
        icon: "http://i0.hdslb.com/bfs/archive/d43047538e72c9ed8fd8e4e34415fbe3a4f632cb.png"
      }
    ];

    // ============================================================
    // 3. 底部 Dock
    //    只保留：
    //      首页
    //      关注
    //      我的
    //
    //    删除：
    //      消息
    //      发布
    //      会员购
    // ============================================================

    if (Array.isArray(obj.data.bottom)) {

      obj.data.bottom = obj.data.bottom.filter(item => {

        if (!item) {
          return false;
        }

        const name = String(
          item.name ||
          item.title ||
          ""
        );

        const tabId = String(
          item.tab_id ||
          ""
        ).toLowerCase();

        const uri = String(
          item.uri ||
          ""
        ).toLowerCase();

        // --------------------------------------------------------
        // 删除底栏「消息」
        // --------------------------------------------------------

        if (
          name.includes("消息") ||
          name.includes("私信") ||
          tabId.includes("message") ||
          tabId.includes("msg") ||
          uri.includes("im_home") ||
          uri.includes("message")
        ) {
          return false;
        }

        // --------------------------------------------------------
        // 删除「发布 / 投稿」
        // --------------------------------------------------------

        if (
          name.includes("发布") ||
          name.includes("投稿") ||
          tabId.includes("publish") ||
          tabId.includes("upload") ||
          uri.includes("publish") ||
          uri.includes("upload") ||
          uri.includes("archive_selection")
        ) {
          return false;
        }

        // --------------------------------------------------------
        // 删除「会员购 / 商城」
        // --------------------------------------------------------

        if (
          name.includes("会员购") ||
          name.includes("商城") ||
          tabId.includes("mall") ||
          tabId.includes("shop") ||
          uri.includes("mall") ||
          uri.includes("shop")
        ) {
          return false;
        }

        return true;
      });

      // 重新编号
      obj.data.bottom.forEach((item, index) => {
        item.pos = index + 1;
      });
    }

    // ============================================================
    // 4. 输出
    // ============================================================

    body = JSON.stringify(obj);
  }

} catch (e) {
  // 解析失败时保持原始响应，避免影响 B站
}

$done({ body });
