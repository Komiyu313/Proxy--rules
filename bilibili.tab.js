/**
 * B站首页导航栏自定义
 *
 * 顶栏：
 *   直播 / 推荐 / 热门 / 动画 / 影视
 *
 * 底栏：
 *   首页 / 关注(动态) / 消息 / 我的
 *
 * 删除：
 *   发布(+)
 *   会员购
 *
 * 基于 Sparkle Bilibili.json.js 当前版本的 Tab 数据结构。
 */
(() => {
  const body = $response.body;
  if (!body) {
    $done({});
    return;
  }
  try {
    const obj = JSON.parse(body);
    if (!obj || !obj.data || typeof obj.data !== "object") {
      $done({ body });
      return;
    }
    const data = obj.data;
    /*
     * ============================================================
     * 1. 顶栏 / 首页频道
     * ============================================================
     *
     * 这里使用 Sparkle 原模块当前版本的完整数据。
     *
     * 不要只写 name。
     * B站客户端实际还会依赖：
     *   id
     *   tab_id
     *   uri
     *   default_selected
     *
     * 其中推荐必须保持 default_selected: 1。
     */
    data.tab = [
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
     * 2. 顶部右侧功能
     * ============================================================
     *
     * 原模块这里使用「消息」。
     *
     * 如果服务器已经返回了 top，就保留服务器其他字段；
     * 只确保消息入口存在。
     */
    if (Array.isArray(data.top)) {
      const messageTop = data.top.find(item => {
        if (!item) return false;
        const name = String(item.name || "");
        const tabId = String(item.tab_id || "");
        const uri = String(item.uri || "");
        return (
          name.includes("消息") ||
          tabId === "消息Top" ||
          uri.includes("im_home")
        );
      });
      if (messageTop) {
        messageTop.pos = 1;
      }
    }
    /*
     * ============================================================
     * 3. 底部 Dock
     * ============================================================
     *
     * 只删除：
     *   - 发布
     *   - 会员购
     *
     * 其余项目全部保留。
     *
     * 这样不会像 Gemini 那版一样把 bottom 对象全部重建，
     * 可以继续保留 B站服务器返回的 icon、icon_selected 等字段。
     */
    if (Array.isArray(data.bottom)) {
      data.bottom = data.bottom.filter(item => {
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
       * 重新整理 position。
       *
       * B站有些版本的 bottom.pos 并不连续，
       * 过滤之后重新编号可以避免出现：
       *
       * 1 / 2 / 4 / 5
       *
       * 这种情况。
       */
      data.bottom.forEach((item, index) => {
        item.pos = index + 1;
      });
    }
    /*
     * ============================================================
     * 4. 最终输出
     * ============================================================
     */
    $done({
      body: JSON.stringify(obj)
    });
  } catch (error) {
    /*
     * JSON 解析失败时不要破坏 B站响应，
     * 直接返回原始内容。
     */
    $done({
      body
    });
  }
})();
