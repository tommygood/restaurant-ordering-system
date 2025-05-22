const { defineConfig } = require('@vue/cli-service')
const path = require('path');
// module.exports = defineConfig({
//   transpileDependencies: true
// });

module.exports = {
	filenameHashing: true,
  outputDir: path.resolve(__dirname, '../backend/restaurant_management'),
  devServer: {
		allowedHosts: ['mixed-restaurant.bogay.me'],
    proxy: {
      '/': {
        target: 'http://localhost:8001'
      }
    }
  }
}
