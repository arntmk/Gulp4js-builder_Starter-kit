// Plugins

// https://www.postcss.parts/
// https://www.npmjs.com/search?q=keywords%3Apostcss-plugin
// https://github.com/postcss/postcss
// "selector-nested-pattern": "^&",
/* ____________________________________________ */

import presetEnv from 'postcss-preset-env'; // Include: autoprefixer
import pxtorem from 'postcss-pxtorem';
import sortCSSmq from 'postcss-sort-media-queries';
import purgecss from '@fullhuman/postcss-purgecss';
import optSvgo from 'postcss-svgo';
import mergeLonghand from 'postcss-merge-longhand';
import mergeRules from 'postcss-merge-rules';
import mergeIdents from 'postcss-merge-idents';

/* ____________________________________________ */
const srcFolder = './src';
const postcssConfig = [
	presetEnv({
		stage: 2,
		autoprefixer: { cascade: false, grid: true },
	}),
	sortCSSmq({ sort: 'desktop-first' }),
	mergeRules(),
	mergeLonghand(),
	mergeIdents(),
	pxtorem({ rootValue: 16, propWhiteList: ['*'] }),
	purgecss({
		content: [`${srcFolder}/**/*.{html,twig,js,ts,jsx,tsx,vue}`],
		skippedContentGlobs: ['node_modules/**', 'bower_components/**'],
		safelist: [':where', ':is', ':has', 'hidden', 'active', 'open', 'lock-fixed', 'lock'],
		keyframes: true,
		variables: false,
		fontFace: false,
	}),
	optSvgo({ encode: true }),
];

export default postcssConfig;
