const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');
const path = require('path');
const devConfig = {
	mode: 'development',
	output: {
		publicPath: 'http://localhost:3000/',
	},
	devServer: {
		port: 3000,
		historyApiFallback: true,
		contentBase: [path.join(__dirname, '../public')],
	},
	plugins: [],
};

module.exports = merge(commonConfig, devConfig);

// common configurations between dev and prod config could be moved to single file
