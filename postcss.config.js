// Load plugins

// https://www.postcss.parts/
// https://www.npmjs.com/search?q=keywords%3Apostcss-plugin
// https://github.com/postcss/postcss
// "selector-nested-pattern": "^&",
// https://goalsmashers.github.io/css-minification-benchmark/
/* ____________________________________________ */

import presetEnv from 'postcss-preset-env'; // Included: autoprefixer
import purgecss from '@fullhuman/postcss-purgecss';
import sortCSSmq from 'postcss-sort-media-queries';
import pxtorem from 'postcss-pxtorem';
import mergeLonghand from 'postcss-merge-longhand';
import mergeRules from 'postcss-merge-rules';
import mergeIdents from 'postcss-merge-idents';
import optSvgo from 'postcss-svgo';

/* ____________________________________________ */
const srcFolder = './src';
const postcssConfig = [
	presetEnv({
		stage: 2,
		autoprefixer: { cascade: false, grid: true },
	}),
	purgecss({
		content: [`${srcFolder}/**/*.{html,htm,php,twig,hbs,njk,js,ts}`], // jsx,tsx,vue
		skippedContentGlobs: ['node_modules/**', 'bower_components/**', 'src_components/**'],
		safelist: [':where', ':is', ':has', 'hidden', 'active', 'open', 'lock-fixed', 'lock'],
		keyframes: true,
		variables: false,
		fontFace: false,
	}),
	sortCSSmq({ sort: 'desktop-first' }),
	pxtorem({ rootValue: 16, propWhiteList: ['*'] }),
	mergeRules(),
	mergeLonghand(),
	mergeIdents(),
	optSvgo({ encode: true }),
];

export default postcssConfig;
