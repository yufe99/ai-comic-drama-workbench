# AI短剧工作台后端接入

## 1. Cloudflare Pages 环境变量

在 Cloudflare Pages 项目 `ai-comic-drama-workbench` 中配置：

- `APP_SECRET`
- `RECHARGE_CODES`
- `GEEKNOW_API_BASE_URL`
- `GEEKNOW_API_KEY`
- `GEEKNOW_DEEPSEEK_MODEL`
- `GEEKNOW_ZHIPU_MODEL`
- `GEEKNOW_GPT_IMAGE2_MODEL`
- `GEEKNOW_NANA_BANANA_2_MODEL`
- `GEEKNOW_NANA_BANANA_PRO_MODEL`
- `GEEKNOW_SORA2_MODEL`
- `GEEKNOW_SEEDANCE_MODEL`

`RECHARGE_CODES` 示例：

```json
{"TEST100":"10000","VIP500":"50000"}
```

## 2. KV

建议创建一个 Cloudflare KV，用于保存钱包和任务：

- Binding: `AI_DRAMA_KV`

然后把 `wrangler.toml` 里的 `id` 和 `preview_id` 换成真实值。

## 3. 接口

- `GET /api/health`
- `GET /api/config`
- `POST /api/recharge`
- `POST /api/generate`

## 3.1 Geeknow 中转

所有模型统一走 Geeknow：

- 控制台：`https://www.geeknow.top/console`
- Base URL：`https://www.geeknow.top`
- 文本：`POST /v1/chat/completions`
- 图片：`POST /v1/images/generations`
- 视频：`POST /v1/videos`
- 鉴权：`Authorization: Bearer $GEEKNOW_API_KEY`

## 4. 当前逻辑

- 未充值只能查看展示页
- 充值码兑换后发放钱包 token
- 提交生成时由 Pages Functions 读取环境变量调用模型 API
- 若绑定 KV，会持久化钱包余额和任务记录

## 5. 生产建议

- 接入真实用户登录
- 钱包与用户 ID 绑定
- 充值码改为后台订单审核或支付回调
- 为每个模型做独立响应解析器
- 增加任务轮询、失败重试、Webhook 回调
