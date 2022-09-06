import Core, { Options as Op } from '@unic/core'
import { SupportElement as Se } from '@unic/shared'

// Style
import '@unic/style/index.less'

export type Option = Op
export type SupportElement = Se

const UnicVerify = class extends Core {
  constructor(el: Se, option?: Op) {
    super(el, option)
  }
}

export default function (el: Se, option: Op) {
  return new Promise((resolve, reject) => {
    const { key } = option
    if (!el) {
      reject('请绑定Dom')
      return
    }
    if (!key) {
      reject('请填写key')
      return
    }
    if (key !== 'test1234') {
      reject('key验证失败')
      return
    }

    resolve(new UnicVerify(el, option))
  })
}
