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
 *   保留服务器原有项目
 *   删除「发布」和「会员购」
 */
let body = $response.body;
try {
  let obj = JSON.parse(body);
  if (obj && obj.data) {
    /*
     * ============================================================
     * 1. 首页顶部五个频道
     * ============================================================
     */
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
    /*
     * ============================================================
     * 2. 右上角功能
     * ============================================================
     *
     * 原 Sparkle 模块这里直接只返回「消息」。
     *
     * 因此国内版 B站服务器下发的：
     *   游戏
     *   活动
     *   其他右上角入口
     *
     * 都会被覆盖掉。
     */
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
    /*
     * ============================================================
     * 3. 底部 Dock
     * ============================================================
     *
     * 保留服务器返回的其他字段和图标。
     *
     * 删除：
     *   发布
     *   会员购
     */
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
        /*
         * 删除「发布」
         */
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
        /*
         * 删除「会员购」
         */
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
      /*
       * 重新编号
       */
      obj.data.bottom.forEach((item, index) => {
        item.pos = index + 1;
      });
    }
    /*
     * ============================================================
     * 4. 输出
     * ============================================================
     */
    body = JSON.stringify(obj);
  }
} catch (e) {
  /*
   * 如果解析失败，则保持原始响应，
   * 避免把 B站接口搞坏。
   */
}
$done({ body });
