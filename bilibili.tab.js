/**
 * B站导航栏精简脚本
 *
 * 顶栏：
 *   完全交给原版 Sparkle 脚本处理
 *   保留原版多语言适配
 *
 * 右上角：
 *   完全交给原版 Sparkle 脚本处理
 *
 * 底栏：
 *   只保留：
 *     177 首页
 *     179 关注
 *     181 我的
 *
 *   删除：
 *     消息
 *     发布
 *     会员购
 *     其他底栏项目
 */

let body = $response.body;

try {
  let obj = JSON.parse(body);

  if (obj && obj.data && Array.isArray(obj.data.bottom)) {

    // 只保留原版定义中的：
    // 177 = 首页
    // 179 = 关注
    // 181 = 我的

    const keepIds = [177, 179, 181];

    obj.data.bottom = obj.data.bottom.filter(item => {
      return item && keepIds.includes(Number(item.id));
    });

    // 重新排列位置
    obj.data.bottom.forEach((item, index) => {
      item.pos = index + 1;
    });

    body = JSON.stringify(obj);
  }

} catch (e) {
  // 如果解析失败，则保持原始响应
}

$done({ body });
