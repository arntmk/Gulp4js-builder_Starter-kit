/* ____________________________________________ */
// Production mode | Build

const isProd = process.argv.includes('--production');
const isDev = !isProd;

/* ____________________________________________ */
// WebPack Config

const webpackConfig = {
	mode: isProd ? 'production' : 'development',
	entry: {
		script: './src/script.js',
		// vendor: './src/vendor.js',
	},
	output: {
		filename: '[name]-bundle.min.js',
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
	devtool: isDev ? 'inline-source-map' : false,
};

export default webpackConfig;
