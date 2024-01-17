addEventListener('fetch', (event) => {
    event.respondWith(handleRequest(event.request));
});

const targetURLs = TARGET_URL.split(',');
const maxRetries = 5;

async function handleRequest(originalRequest) {
    let response;

    for (let retry = 0; retry < maxRetries; retry++) {
        const randomIndex = Math.floor(Math.random() * targetURLs.length);
        const targetURL = targetURLs[randomIndex];
        const userURI = new URL(originalRequest.url).pathname;
        const proxyURL = targetURL + userURI;
        const headers = new Headers(originalRequest.headers);
        headers.set('Content-Type', 'application/json');
        headers.set('cf-ip-override', 'v4');
        // 添加伪装的 header
        headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');
        headers.set('Accept-Language', 'en-US,en;q=0.9');
        headers.set('Accept-Encoding', 'gzip, deflate, br');
        headers.set('Referer', proxyURL);
        headers.set('Origin', proxyURL);

        const requestBody = await originalRequest.clone().text();

        console.log('Request URL:', proxyURL);

        try {
            response = await fetch(proxyURL, {
                method: originalRequest.method,
                headers: headers,
                body: requestBody,
            });

            // 如果得到响应，打印相关信息
            if (response) {
                console.log('Server Response Status:', response.status);
                console.log('Server Response Headers:', JSON.stringify(Object.fromEntries(response.headers.entries())));

                const responseBody = await response.text();
                // 创建新的响应头部对象
                const modifiedHeaders = new Headers(response.headers);

                // 修改或添加头部信息
                modifiedHeaders.set('Access-Control-Allow-Origin', '*');
                modifiedHeaders.set('Access-Control-Allow-Headers', '*');
                modifiedHeaders.set('Content-Type', 'application/json');
                modifiedHeaders.set('cf-ip-override', 'v4');
                // 添加伪装的 header
                modifiedHeaders.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');
                modifiedHeaders.set('Accept-Language', 'en-US,en;q=0.9');
                modifiedHeaders.set('Accept-Encoding', 'gzip, deflate, br');
                modifiedHeaders.set('Referer', proxyURL);
                modifiedHeaders.set('Origin', proxyURL);
                modifiedHeaders.delete('cf-ray');

                console.log('Response Body:', responseBody);

                // 如果响应状态为 200 并且需要根据 JSON 中的 code 做进一步处理
                if (response.status === 200) {
                    try {
                        // 重新解析响应体为 JSON，因为 response.text() 已经消耗了响应流
                        const jsonResponse = JSON.parse(responseBody);

                        if (jsonResponse.code === 200) {
                            return new Response(JSON.stringify(jsonResponse), {
                                status: response.status,
                                statusText: response.statusText,
                                headers: modifiedHeaders
                            });
                        }
                    } catch (jsonError) {
                        console.error('Error parsing JSON:', jsonError);
                    }
                }
            }
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    }

    // 如果循环结束后没有有效响应
    if (!response) {
        console.error('No valid response received after retries');
        return new Response('无法获取有效响应', { status: 500 });
    }

    // 如果有有效响应但不是我们特定处理的情况
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
    });
}
