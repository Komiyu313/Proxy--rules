/**
 * B站首页导航栏自定义
 *
 * 顶栏：
 *   直播 / 推荐 / 热门 / 动画 / 影视
 *
 * 右上角：
 *   保留消息
 *
 * 底栏：
 *   保留服务器返回的底栏项目
 *   删除发布 / 会员购
 *
 * 注意：
 *   右上角游戏入口不是这里处理。
 *   它来自 /x/resource/top/activity
 *   由 Surge [Map Local] 单独屏蔽。
 */

let body = $response.body;

try {
  const obj = JSON.parse(body);

  if (obj && obj.data && typeof obj.data === "object") {

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
     * 2. 右上角
     * ============================================================
     *
     * 这里只保留「消息」。
     *
     * 注意：
     * 右边的游戏手柄并不是这里产生的，
     * 它由 /x/resource/top/activity 接口产生，
     * 所以需要在 Surge 的 [Map Local] 中屏蔽。
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
     * 不重新制造底栏。
     *
     * 直接使用 B站服务器原本返回的数据，
     * 这样原来的图标、URI、状态等字段都不会丢。
     *
     * 只删除：
     *
     *   发布
     *   投稿
     *   会员购
     *   商城
     */

    if (Array.isArray(obj.data.bottom)) {

      obj.data.bottom = obj.data.bottom.filter(item => {

        if (!item || typeof item !== "object") {
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
         * ----------------------------
         * 删除「发布 / 投稿」
         * ----------------------------
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
         * ----------------------------
         * 删除「会员购 / 商城」
         * ----------------------------
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
       * 重新排列位置编号
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

} catch (error) {

  /*
   * 如果 B站响应格式发生变化，
   * 不要把整个接口搞死。
   *
   * 直接返回原始响应。
   */
}

$done({
  body: body
});
