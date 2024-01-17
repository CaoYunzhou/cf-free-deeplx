# cf-free-deeplx-translate

- 一个简便的负载均衡的方式来使用翻译服务

## 部署方式

- **建议自己部署CF-Work，这个只是Demo**
- 配置cloudflare的Work
- 设置 > 变量 > 添加环境变量
- 环境变量名称：TARGET_URL，值为：`https://dx.ift.lat,https://deepl.coloo.org,https://api.deeplx.org`
- 把index.js的内容粘贴到cloudflare的work中
- 在cloudflare > work > 触发器,配置自定义域名就可以愉快的翻译了


## 参考deeplx使用方式或者沉浸式翻译

```Shell
curl --location 'https://freedeepl.aivvm.com/translate' \
--header 'Content-Type: application/json' \
--data '{
    "text": "hello world",
    "source_lang": "EN",
    "target_lang": "ZH"
}'
```

### 响应

```Body
{
    "alternatives": [
        "你好世界",
        "哈喽世界",
        "哈啰世界"
    ],
    "code": 200,
    "data": "哈罗世界",
    "id": 8345422279,
    "method": "Free",
    "source_lang": "EN",
    "target_lang": "ZH"
}```

