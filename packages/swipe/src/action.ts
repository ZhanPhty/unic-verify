/**
 * 滑动验证码的动作事件
 */
import UnicEvent from '@unic/event'
import {
  PluginContext,
  createPluginContext,
  isDisabled,
  resetState,
  flow,
  getStatusName,
  isMoveOrEndOrCancel,
  TYPE_END,
  TYPE_CANCEL
} from '@unic/shared'
import { ComputeVAndDir, ComputeDistance } from '@unic/compute'

const DEFAULT_OPTIONS = {
  name: 'swipeAction',
  threshold: 10,
  pointLength: 1
}

/**
 * 实例
 */
export type pContext = PluginContext & typeof DEFAULT_OPTIONS

/**
 * tap类型的验证码
 * @param wrapRef
 */
export default function (uv: UnicEvent, options?: Partial<typeof DEFAULT_OPTIONS>): pContext {
  const ctx = createPluginContext(DEFAULT_OPTIONS, options)

  uv.compute([ComputeVAndDir, ComputeDistance], (computed) => {
    // 重置status
    resetState(ctx)
    // 禁止
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
