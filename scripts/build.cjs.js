const fs = require('fs')
const chalk = require('chalk')
const { terser } = require('rollup-plugin-terser')
const { build, walkPackageDirs } = require('./build')

console.log(chalk.blue(`🧲 正在生成cjs模块!`))

const genRollupConfig = (dirName) => ({
  input: `./packages/${dirName}/src/index.ts`,
  output: {
    sourcemap: true,
    file: `./packages/${dirName}/dist/index.js`,
    exports: 'named',
    format: 'cjs'
  },
  external: (id) => ['tslib'].includes(id) || /^@/.test(id),
  tsConfig: {
    target: 'ES5'
  },
  terser: terser({
    // include: [/^.+\.prod\.js$/],
    output: {
      comments: false
    }
  })
})

walkPackageDirs((dirName) => {
  fs.mkdirSync(`./packages/${dirName}/dist`, { recursive: true })
  build(genRollupConfig(dirName))
  // build(genRollupConfig(dirName, 'prod'));
})
