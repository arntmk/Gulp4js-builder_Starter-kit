import pxtorem from 'postcss-pxtorem';
import autoprefixer from 'autoprefixer';
import mergerules from 'postcss-merge-rules';
import mergelonghand from 'postcss-merge-longhand';
import mergeidents from 'postcss-merge-idents';

const postcssConfig = [
	mergerules(),
	mergelonghand(),
	mergeidents(),
	autoprefixer({ cascade: false, grid: true }),
	pxtorem({ rootValue: 16, propWhiteList: ['*'] }),
];

export default postcssConfig;
