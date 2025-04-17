// module.exports = {
//   devServer: {
//     proxy: {
//       '/dev': {
//         target: 'https://www.baidu.com/api/',
//         changeOrigin: true,
//         pathRewrite: {
//           '^/dev': ''
//         }
//       }
//     },
//   }}
console.log('Base URL:', process.env.UNI_BASE_URL)
module.exports = {
	baseUrl: process.env.UNI_BASE_URL,
	qiniupUrl: process.env.QINIUP_URL,
}

<style lang="scss">
@import '@/common/css/theme.scss';
</style>

