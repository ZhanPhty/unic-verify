// import Core from '@unic/core'
// import {
//   PluginContext,
//   createPluginContext,
//   isDisabled,
//   resetState,
//   flow,
//   getStatusName,
//   isMoveOrEndOrCancel,
//   TYPE_END,
//   TYPE_CANCEL
// } from '@unic/shared'
// import { ComputeVAndDir, ComputeDistance, ComputeDeltaXY } from '@unic/compute'

// const DEFAULT_OPTIONS = {
//   name: 'tap',
//   text: '请滑动至最右侧!',
//   threshold: 10,
//   pointLength: 1
// }

// /**
//  * 实例
//  */
// export type TapContext = PluginContext & typeof DEFAULT_OPTIONS

// /**
//  * tap类型的验证码
//  * @param wrapRef
//  */
// export default function (uv: Core, options?: Partial<typeof DEFAULT_OPTIONS>): TapContext {
//   const ctx = createPluginContext(DEFAULT_OPTIONS, options)

//   // uv.compute([ComputeVAndDir, ComputeDistance, ComputeDeltaXY], (computed) => {
//   //   // 重置status
//   //   resetState(ctx)
//   //   // 禁止
//   //   if (isDisabled(ctx)) return
//   //   const isValid = test()
//   //   ctx.state = flow(isValid, ctx.state, computed.phase)
//   //   if (isValid || isMoveOrEndOrCancel(ctx.state)) {
//   //     const { name } = ctx
//   //     uv.emitDev(name, computed, ctx)
//   //     uv.emitDev(name + getStatusName(ctx.state), computed, ctx)
//   //     if (![TYPE_END, TYPE_CANCEL].includes(computed.phase) && computed.direction) {
//   //       uv.emitDev(name + computed.direction, computed, ctx)
//   //     }
//   //   }

//   //   // 是否满足条件
//   //   function test() {
//   //     const { pointLength, distance } = computed
//   //     return ctx.pointLength === pointLength && ctx.threshold <= distance
//   //   }
//   // })

//   return ctx
// }

// // /**
// //  * 创建指定轴的滚动条DOM
// //  * @param el view元素
// //  * @param axis 轴
// //  * @returns [滚动条轨道,把手]
// //  */

// // function createDOM(el: HTMLElement, option: Options) {
// //   const preEl = createDOMDiv([TAP_PREFIX_NAME])
// //   const boxEl = createDOMDiv([`${TAP_PREFIX_NAME}--box`])
// //   const trackEl = createDOMDiv([`${TAP_PREFIX_NAME}--track`])
// //   const barEl = createDOMDiv([`${TAP_PREFIX_NAME}--bar`])

// //   trackEl.innerHTML = option.text || ''
// //   boxEl.appendChild(trackEl)
// //   boxEl.appendChild(barEl)
// //   preEl.appendChild(boxEl)
// //   el.appendChild(preEl)
// //   return preEl
// // }
export default function () {}
