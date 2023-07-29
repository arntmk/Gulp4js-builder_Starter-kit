/* ____________________________________________ */
// Load plugins

import { EsbuildPlugin } from 'esbuild-loader';

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
			// JS/TS/JSX/TSX
			{
				test: /\.m?(js|ts|jsx|tsx|css|json)$/,
				resolve: {
					fullySpecified: false,
					extensions: ['.js', '.ts', '.jsx', '.tsx', 'css', '.json'],
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
				test: /\.css$/,
				resolve: {
					fullySpecified: false,
					extensions: ['css'],
				},
				use: ['style-loader', 'css-loader'],
			},
		],
	},
};

export default webpackConfig;
