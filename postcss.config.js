// Plugins

// https://www.postcss.parts/
// https://www.npmjs.com/search?q=keywords%3Apostcss-plugin
/* ____________________________________________ */
import pxtorem from 'postcss-pxtorem';
import autoprefixer from 'autoprefixer';
import mergerules from 'postcss-merge-rules';
import mergelonghand from 'postcss-merge-longhand';
import mergeidents from 'postcss-merge-idents';
import purgecss from '@fullhuman/postcss-purgecss';
import sortCSSmq from 'postcss-sort-media-queries';
import optsvgo from 'postcss-svgo';

/* ____________________________________________ */
const srcFolder = './src';
const postcssConfig = [
	sortCSSmq({ sort: 'desktop-first' }),
	mergerules(),
	mergelonghand(),
	mergeidents(),
	autoprefixer({ cascade: false, grid: true }),
	pxtorem({ rootValue: 16, propWhiteList: ['*'] }),
	purgecss({
		content: [`${srcFolder}/**/*.{html,twig,js,ts,jsx,tsx,vue}`],
		skippedContentGlobs: ['node_modules/**', 'bower_components/**'],
		safelist: [':where', ':is', ':has', 'hidden', 'active', 'open', 'lock-fixed', 'lock'],
		keyframes: true,
		variables: false,
		fontFace: false,
	}),
	optsvgo({
		encode: true,
		plugins: [
			{ removeDoctype: true },
			{ removeComments: true },
			{ cleanupNumericValues: { floatPrecision: 2 } },
			{ convertColors: { names2hex: true, rgb2hex: true } },
		],
	}),
];

export default postcssConfig;
