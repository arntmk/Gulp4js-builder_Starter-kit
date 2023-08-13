/* ____________________________________________ */
// Load plugins

import { EsbuildPlugin } from 'esbuild-loader';
import path from 'path';

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
		sw: './src/scripts/serviceWorker/sw.js',
		// vendor: './src/vendor.js',
	},

	output: {
		filename: '[name].min.js',
	},

	optimization: {
		minimize: isProd, // default terser
	},

	plugins: [],

	module: {
		rules: [
			/* ____________________________________________ */
			// JS/JSX|TS/TSX
			{
				test: /\.m?(js|jsx|ts|tsx|css|json)$/,
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
};

export default webpackConfig;
