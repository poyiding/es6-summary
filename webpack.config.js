var webpack = require("webpack");
var path = require('path');
var ROOT_PATH = path.resolve(__dirname);
var BUILD_PATH = path.resolve(ROOT_PATH, 'dist');
module.exports = {
	entry: './es6Test/main.js',
	output: {
		path: BUILD_PATH,
		filename: 'bundle.js'
	},
	// 模块加载器
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        test: path.join(__dirname, 'es6Test'),
        query: {
          presets: 'es2015',
        }
      }
    ]
  },
  plugins: [
   
  ]
};
