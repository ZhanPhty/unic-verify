const chalk = require('chalk')
const { terser } = require('rollup-plugin-terser')
const { build, walkPackageDirs } = require('./build')

console.log(chalk.blue('π ζ­£ε¨ηζesζ¨‘ε!'))

walkPackageDirs((dirName) => {
  build({
    input: `./packages/${dirName}/src/index.ts`,
    output: {
      sourcemap: true,
      file: `./packages/${dirName}/dist/index.es.js`,
      format: 'esm'
    },
    external: (id) => ['tslib'].includes(id) || /^@/.test(id),
    tsConfig: {
      target: 'ES5',
      module: 'ESNEXT'
    },
    terser: terser({
      output: {
        comments: false
      }
    })
  })
})
