const chalk = require('chalk')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const { terser } = require('rollup-plugin-terser')
const { build } = require('./build')
const { compress } = require('minimist')(process.argv.slice(2))

console.log(chalk.blue(`🤖 正在${compress ? '压缩' : '生成'}umd模块!`))

const options = {
  input: `./packages/unic-verify/src/index.ts`,
  output: {
    file: `./packages/unic-verify/dist/unic-verify.umd.js`,
    format: 'umd',
    sourcemap: true,
    name: 'UnicVerify'
  },
  tsConfig: {
    target: 'ES5'
  },

  prependPlugins: [nodeResolve(), commonjs()]
}
if (compress) {
  options.output.file = options.output.file.replace('.js', '.min.js')
  options.terser = terser({
    output: {
      comments: false
    }
  })
}
build(options)
