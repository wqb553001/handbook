export function getUsers() {
    return uni.request({
        url: 'http://localhost:18281/api/users', // 替换为实际的接口地址
        method: 'GET'
    });
}

