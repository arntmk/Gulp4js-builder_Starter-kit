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
		filename: '[name]-bundle.min.js',
	},
	optimization: {
		minimizer: [
			new EsbuildPlugin({
				target: 'es2016',
				css: true, // Apply minification to CSS assets
			}),
		],
	},
	module: {
		rules: [
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
						minify: isProd,
					},
				},
			},
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
