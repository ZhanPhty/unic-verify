import UnicEvent from '@unic/event'
import { Swipe } from '@unic/action'
import {
  createDOMDiv,
  setStyle,
  changeClass,
  removeClass,
  render,
  VERIFYSTATE,
  createVerifyContext
} from '@unic/shared'
import type { SupportElement, VerifyContext } from '@unic/shared'
import Core, { Options } from '@unic/core'
import { TAP_PREFIX_NAME } from './const'

const DEFAULT_OPTIONS = {
  name: 'swipe',
  text: '请滑动至最右侧'
}

/**
 * swpie类型的验证码
 * @param wrapRef
 */
export default function (ref: Core, callback: (ev: VerifyContext) => void) {
  const options = { ...DEFAULT_OPTIONS, ...ref.options }

  // 生成Dom视图
  const mainRefs = createDOM(ref.el, options)
  const { boxEl, trackEl, barEl } = mainRefs

  // 获取最大的可滑动距离，track宽度 - bar宽度
  // 最小则为0
  const maxDistance = trackEl.clientWidth - barEl.offsetWidth
  const minDistance = 0

  // ========================
  // 设置event的plugin
  // 注册swipeAction事件
  // ========================
  const uv = new UnicEvent(mainRefs.barEl)
  uv.use(Swipe, { name: 'swipe' })

  // 获取Swipe配置
  const sOption = uv.get('swipe')

  uv.on('swipe', (ev) => {
    if (!ev.displacementX) return

    let xDis = ev.displacementX
    // 判断划动过界逻辑
    if (ev.displacementX <= minDistance) {
      // 最小值
      xDis = minDistance
    } else if (ev.displacementX >= maxDistance) {
      // 最大值
      // 且最大值需要触发，验证-通过
      xDis = maxDistance

      callback(createVerifyContext(verify(), ev))
      // 更新状态
      updateBar(boxEl, verify())
    }

    render(barEl, [xDis, 0])
  })

  // 划动结束 - 处理验证
  uv.on('swipeend', (ev) => {
    console.log('触发end')
    // 拖动结束，同样需要更新状态
    // 且一律判断为不成功，重置位置（成功的话，move状态已经禁用了后续事件）
    updateBar(boxEl, VERIFYSTATE.FAILED)
    callback(createVerifyContext(verify(), ev))

    // 失败后，一秒后回复默认状态
    setTimeout(() => {
      updateBar(boxEl, VERIFYSTATE.POSSIBLE)
      render(ev.target, [0, 0])
    }, 800)
  })

  function updateBar(boxEl: HTMLElement, state: VERIFYSTATE) {
    // 成功状态
    // 禁用事件，不在触发
    if (VERIFYSTATE.RECOGNIZED === state) {
      sOption.disabled = true
      removeClass(boxEl, [
        `${TAP_PREFIX_NAME}--${VERIFYSTATE.FAILED}`,
        `${TAP_PREFIX_NAME}--${VERIFYSTATE.POSSIBLE}`
      ])
    } else {
      sOption.disabled = false
      removeClass(boxEl, [
        `${TAP_PREFIX_NAME}--${VERIFYSTATE.RECOGNIZED}`,
        `${TAP_PREFIX_NAME}--${VERIFYSTATE.POSSIBLE}`
      ])
    }
    changeClass(boxEl, [`${TAP_PREFIX_NAME}--${state}`])
  }
}

/**
 * 触发验证函数
 * @unic/secret
 */
function verify(): VERIFYSTATE {
  // 注：此处调用验证逻辑
  // ！！假设逻辑返回成功
  return VERIFYSTATE.RECOGNIZED
}

/**
 * 创建指定轴的滚动条DOM
 * @param el view元素
 * @param option 配置
 * @returns [滚动条轨道,把手]
 */

function createDOM(el: SupportElement, option: Options) {
  const parentEl = createDOMDiv([TAP_PREFIX_NAME])
  const boxEl = createDOMDiv([`${TAP_PREFIX_NAME}--box`])
  const trackEl = createDOMDiv([`${TAP_PREFIX_NAME}--track`])
  const barEl = createDOMDiv([`${TAP_PREFIX_NAME}--bar`])

  setStyle(parentEl, { position: 'relative', width: option.width })
  trackEl.innerHTML = option.text || ''
  boxEl.appendChild(trackEl)
  boxEl.appendChild(barEl)
  parentEl.appendChild(boxEl)
  el.appendChild(parentEl)
  return {
    parentEl,
    boxEl,
    trackEl,
    barEl
  }
}
