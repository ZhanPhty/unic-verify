import UnicEvent from '@unic/event'
import action from './action'
import { createDOMDiv, setStyle, render } from '@unic/shared'
import { Options } from '@unic/core'
import { TAP_PREFIX_NAME } from './const'

const DEFAULT_OPTIONS = {
  name: 'swipe',
  text: '请滑动至最右侧'
}

/**
 * swpie类型的验证码
 * @param wrapRef
 */
export default function (ref: any) {
  const options = { ...DEFAULT_OPTIONS, ...ref.options }
  console.log(ref, 'ref')
  // 生成Dom视图
  const mainRefs = createDOM(ref.el, options)
  // 设置event的plugin
  // 注册swipeAction事件
  // ref.uvEvent.use(action)

  const uv = new UnicEvent(mainRefs.barEl)
  uv.use(action as any)
  uv.on('uv:after', (ev) => {
    console.log(ev)
    ev.distanceX && render(ev.target, [ev.distanceX, 0])
  })

  // console.log(uv)

  // console.log(ref.uvEvent)
  console.log(uv)

  // 设置event的plugin
  // ref.uvEvent.use(action)
  // ref.uvEvent.on('uv:start', () => {
  //   console.log(1)
  // })

  // ref.uvEvent.on('uv:move', (ex) => {
  //   console.log(ex, 2)
  // })

  // ref.uvEvent.on('uv:end', (ex) => {
  //   console.log(ex, 3)
  // })
}

/**
 * 创建指定轴的滚动条DOM
 * @param el view元素
 * @param option 配置
 * @returns [滚动条轨道,把手]
 */

function createDOM(el: HTMLElement, option: Options) {
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
