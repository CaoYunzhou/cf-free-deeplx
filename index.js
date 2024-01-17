addEventListener('fetch', (event) => {
    event.respondWith(handleRequest(event.request));
});

// 定义目标地址列表
// 定义目标地址列表
const targetURLs = [
    'https://dx.ift.lat',
    'https://deepl.coloo.org',
    'https://api.deeplx.org',
    'https://dx.ift.lat',
    'https://deeplx.keyrotate.com',
    'https://deepl.tr1ck.cn',
    'https://translate.dftianyi.com',
    'https://deepl.dlwlrma.xyz',
    // 添加更多的目标地址
];

async function handleRequest(request) {
    // 随机选择一个目标地址
    const randomIndex = Math.floor(Math.random() * targetURLs.length);
    const targetURL = targetURLs[randomIndex];

    // 获取用户请求的 URI 地址
    const userURI = new URL(request.url).pathname;

    // 构建代理请求的完整目标地址
    const proxyURL = targetURL + userURI;

    // 复制用户请求的头部信息
    const headers = new Headers(request.headers);

    // 设置 Content-Type 为 application/json
    headers.set('Content-Type', 'application/json');

    // 打印请求地址
    console.log('Request Headers:', targetURL + userURI);

    // 克隆请求，以确保可以多次读取正文
    const clonedRequest = new Request(request);

    // 发起代理请求
    const response = await fetch(proxyURL, {
        method: request.method,
        headers: headers,
        body: clonedRequest.body,
    });

    // 复制代理响应的头部信息
    const responseHeaders = new Headers(response.headers);

    // 获取代理响应的正文
    const responseBody = await response.text();

    // 打印代理响应体
    console.log('Response Body:', responseBody);

    // 创建包含代理响应体的新响应对象
    const newResponse = new Response(responseBody, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
    });

    // 返回新的响应对象
    return newResponse;
}
