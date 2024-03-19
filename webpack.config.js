/* ____________________________________________ */
// Load plugins

// import path from 'path';
// import devServer from 'webpack-dev-server';
// import HtmlWebpackPlugin from 'html-webpack-plugin';

/* ____________________________________________ */
// Production mode | Build

const isProd = process.argv.includes('--production');
const isDev = !process.argv.includes('--production');

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
				exclude: /(node_modules|bower_components|src_components)/,
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
				exclude: /(node_modules|bower_components|src_components)/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
	plugins: [
		// new HtmlWebpackPlugin(),
	],
};

export default webpackConfig;
