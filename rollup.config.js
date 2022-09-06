const typescript = require('@rollup/plugin-typescript')
const json = require('@rollup/plugin-json')
const replace = require('@rollup/plugin-replace')
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { version } from './packages/unic-verify/package.json'
import { babel } from '@rollup/plugin-babel'
import postcss from 'rollup-plugin-postcss'

export default {
  input: './packages/unic-verify/src/index.ts',

  plugins: [
    typescript({
      sourceMap: false,
      exclude: 'node_modules/**',
      typescript: require('typescript')
    }),
    nodeResolve(),
    commonjs(),
    json(),
    postcss({
      extract: 'unic-verify.css'
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
    replace({
      __VERSION__: version,
      preventAssignment: true
    })
  ],
  output: [
    {
      format: 'umd',
      name: 'UnicVerify',
      file: `./packages/unic-verify/dist/unic-verify.umd.js`,
      sourceMap: false
    }
  ]
}
