const typescript = require('@rollup/plugin-typescript')
const json = require('@rollup/plugin-json')
const replace = require('@rollup/plugin-replace')
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { version } from './packages/unic-verify/package.json'
import eslint from '@rollup/plugin-eslint'
import { babel } from '@rollup/plugin-babel'

export default {
  input: './packages/unic-verify/src/index.ts',

  plugins: [
    typescript({
      sourceMap: false,
      exclude: 'node_modules/**',
      typescript: require('typescript')
    }),
    eslint(),
    nodeResolve(),
    commonjs(),
    json(),
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
