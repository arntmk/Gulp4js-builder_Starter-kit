/* ____________________________________________ */
// Load plugins

// import webpack from 'webpack';
// import path from 'path';
// import { EsbuildPlugin } from 'esbuild-loader';
// import HtmlWebpackPlugin from 'html-webpack-plugin';
// import miniCSS from 'mini-css-extract-plugin';
// import devServer from 'webpack-dev-server';

/* ____________________________________________ */
// Production mode | Build

const isProd = process.argv.includes('--production');
const isDev = !isProd;

/* ____________________________________________ */
// WebPack Config

const webpackConfig = {
	mode: isProd ? 'production' : 'development',
	devtool: isDev ? 'inline-source-map' : false,

	entry: {
		script: './src/script.js',
		sw: { import: './src/scripts/sw/sw.js', filename: '[name].js' },
		// vendor: './src/vendor.js',
	},

	output: {
		filename: '[name].min.js',
	},

	optimization: {
		minimize: isProd, // default terser
	},

	module: {
		rules: [
			/* ____________________________________________ */
			// m?/JS/JSX|TS/TSX
			{
				test: /\.(js|jsx|ts|tsx|css|json)$/,
				resolve: {
					fullySpecified: false,
					extensions: ['.js', '.jsx', '.ts', '.tsx', 'css', 'scss', '.json'],
				},
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'esbuild-loader',
					options: {
						target: 'es2016',
					},
				},
			},
			/* ____________________________________________ */
			// CSS/SCSS
			{
				test: /\.(css|scss)$/,
				resolve: {
					fullySpecified: false,
					extensions: ['css', 'scss'],
				},
				exclude: /(node_modules|bower_components)/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
	plugins: [
		// new HtmlWebpackPlugin(),
	],
};

export default webpackConfig;
