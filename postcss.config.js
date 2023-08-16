import pxtorem from 'postcss-pxtorem';
import autoprefixer from 'autoprefixer'; // css префікси для сумісності.
import mergerules from 'postcss-merge-rules';

const postcssConfig = [
	mergerules(),
	autoprefixer({ cascade: false, grid: true }),
	pxtorem({ rootValue: 16, propWhiteList: ['*'] }),
];

export default postcssConfig;
