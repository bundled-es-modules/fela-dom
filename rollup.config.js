import virtual from 'rollup-plugin-virtual';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const entry = `
  export {
    render, rehydrate, renderToMarkup, renderToSheetList
  } from './node_modules/fela-dom/es/index.js';
`;

export default [
  {
    input: 'entry.js',
    output: {
      file: './fela-dom.js',
      format: 'es',
    },
    plugins: [
      virtual ({ 'entry.js': entry }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
      resolve(),
      commonjs(),
    ],
  },
];
