/**
 * 滑动action
 */
import UnicEvent from '@unic/event'
import {
  createPluginContext,
  isDisabled,
  resetState,
  flow,
  getStatusName,
  isMoveOrEndOrCancel,
  TYPE_END,
  TYPE_CANCEL
} from '@unic/shared'
import type { PluginContext, AllEvent } from '@unic/shared'
import { ComputeVAndDir, ComputeDistance, ComputeDeltaXY } from '@unic/compute'

const DEFAULT_OPTIONS = {
  // action名称
  name: 'swipe',
  // 触发阈值
  threshold: 0,
  // 触发点数量
  pointLength: 1
}

/**
 * 实例
 */
export type SwipeContext = PluginContext & typeof DEFAULT_OPTIONS

/**
 * 扩展插件映射
 */
declare module '@unic/event' {
  interface PluginContextMap {
    swipe: SwipeContext
  }

  interface EventMap {
    swipe: AllEvent
    swipestart: AllEvent
    swipemove: AllEvent
    swipeend: AllEvent
  }
}

/**
 * swipe滑动类型
 * @param uv Event事件
 * @param options 配置
 * @return PluginContext 组件上下文
 */
export default function (uv: UnicEvent, options?: Partial<typeof DEFAULT_OPTIONS>): SwipeContext {
  // 整合组件上下文配置
  const ctx = createPluginContext(DEFAULT_OPTIONS, options)

  // 添加计算队列
  uv.compute([ComputeVAndDir, ComputeDistance, ComputeDeltaXY], (computed: AllEvent) => {
    // 重置status
    resetState(ctx)
    // 禁止
    // 可通过uv.get()直接设置disabled
    if (isDisabled(ctx)) return
    const isValid = test()
    ctx.state = flow(isValid, ctx.state, computed.phase)
    if (isValid || isMoveOrEndOrCancel(ctx.state)) {
      const { name } = ctx
      uv.emitDev(name, computed, ctx)
      uv.emitDev(name + getStatusName(ctx.state), computed, ctx)
      if (![TYPE_END, TYPE_CANCEL].includes(computed.phase) && computed.direction) {
        uv.emitDev(name + computed.direction, computed, ctx)
      }
    }

    // 是否满足条件
    function test() {
      const { pointLength, distance } = computed
      return ctx.pointLength === pointLength && ctx.threshold <= distance
    }
  })

  return ctx
}
