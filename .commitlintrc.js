/**
 * rule由key和配置数组组成
 * 如：'key:[0, 'always', 72]'
 *
 * 数组中第一位为level，可选0,1,2，0为disable，1为warning，2为error
 * 第二位为是否应用，可选always|never
 * 第三位该rule的值
 */

module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\w*)(?:\((.*)\))?:[ ]?(.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject']
    }
  },
  rules: {
    'type-empty': [2, 'never'],
    'type-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'feat', // 增加新功能
        'fix', // 修复问题/BUG
        'perf', // 性能优化
        'wip', // 开发中
        'docs', // 文档修改补充
        'style', // 代码风格相关无影响运行结果的
        'refactor', // 重构
        'chore', // 依赖更新/脚手架配置修改等
        'revert', // 回滚
        'ci', // 持续集成
        'test', // 测试用例新增、修改
        'build', // 打包构建
        'release', // 版本发布
        'workflow', // 工作流改进
        'update' // 更新
      ]
    ]
  }
}
