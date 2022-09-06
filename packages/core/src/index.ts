import UnicEvent from '@unic/event'
import type { SupportElement } from '@unic/shared'
import swipe from '@unic/swipe'
// import tap from '@unic/tap'

export interface Options {
  // 申请的keyId
  key: string
  // 验证码模式，"float"（触发式）、"embed"（嵌入式）、"popup"（弹出式）
  mode: 'float' | 'embed' | 'popup'
  // 验证码类型 "tap" (点击式)、"swipe" (滑动式)、"tap-image" (点击图片元素)
  type: 'tap' | 'swipe' | 'tap-image'
  // 宽度
  text?: string
  width: string | undefined
  // 验证结束时回调函数
  onVerify: () => void
}

const DEFAULT_OPTIONS: Options = {
  key: '',
  mode: 'float',
  type: 'tap',
  width: 'auto',
  onVerify: () => {}
}

export default class Core {
  /**
   * 版本
   */
  v = '__VERSION__'
  /**
   * 绑定的元素
   */
  el: SupportElement
  /**
   * 鼠标事件实例
   */
  uvEvent?: UnicEvent
  /**
   * 选项
   */
  options: Options

  constructor(el: SupportElement, options?: Options) {
    this.el = el
    this.options = { ...DEFAULT_OPTIONS, ...options }
    // 初始化event实例
    const uv = new UnicEvent(el)
    this.uvEvent = uv

    swipe(this, this.options.onVerify)
  }
}
