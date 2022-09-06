/**
 * 点击action
 */
import UnicEvent from '@unic/event'
import type { Point, PluginContext, AllEvent } from '@unic/shared'
import { STATE, TYPE_END, createPluginContext, isDisabled } from '@unic/shared'
import { ComputeDistance, ComputeMaxLength, getVLength } from '@unic/compute'

const DEFAULT_OPTIONS = {
  name: 'tap',
  // 触点数
  pointLength: 1,
  // 点击次数
  tapTimes: 1,
  // 等待下一次tap的时间,
  // 超过该事件就立即判断当前点击数量
  waitNextTapTime: 300,

  // 从接触到离开允许产生的最大距离
  maxDistance: 2,
  // 2次tap之间允许的最大位移
  maxDistanceFromPrevTap: 9,
  // 从接触到离开屏幕的最大时间
  maxPressTime: 250
}

/**
 * 实例
 */
export type TapContext = PluginContext & typeof DEFAULT_OPTIONS

/**
 * 扩展插件映射
 */
declare module '@unic/event' {
  interface PluginContextMap {
    tap: TapContext
  }

  interface EventMap {
    tap: AllEvent
  }
}

/**
 * tap点击类型
 * @param uv Event事件
 * @param options 配置
 * @return PluginContext 组件上下文
 */
export default function (uv: UnicEvent, options?: Partial<typeof DEFAULT_OPTIONS>): TapContext {
  const ctx = createPluginContext(DEFAULT_OPTIONS, options)

  let tapCount = 0
  // 记录每次单击完成时的坐标
  let prevTapPoint: Point | undefined
  let prevTapTime: number | undefined
  let countDownToFailTimer: number
  /**
   * 重置
   */
  function reset() {
    tapCount = 0
    prevTapPoint = void 0
    prevTapTime = void 0
  }

  /**
   * 指定时间后, 状态变为"失败"
   */
  function countDownToFail() {
    countDownToFailTimer = (setTimeout as Window['setTimeout'])(() => {
      ctx.state = STATE.FAILED
      reset()
    }, ctx.waitNextTapTime)
  }

  /**
   * 判断前后2次点击的距离是否超过阈值
   * @param center 当前触点中心坐标
   * @param options 选项
   * @param prevTapPoint 上一个点击的坐标
   * @return 前后2次点击的距离是否超过阈值
   */
  function isValidDistanceFromPrevTap(center: Point, options: typeof DEFAULT_OPTIONS) {
    // 判断2次点击的距离
    if (void 0 !== prevTapPoint) {
      const distanceFromPreviousTap = getVLength({
        x: center.x - prevTapPoint.x,
        y: center.y - prevTapPoint.y
      })
      // 缓存当前点, 作为下次点击的上一点
      prevTapPoint = center
      return options.maxDistanceFromPrevTap >= distanceFromPreviousTap
    } else {
      prevTapPoint = center
      return true
    }
  }

  /**
   * 校验2次tap的时间间隔是否满足条件
   * @param waitNextTapTime 最大允许的间隔时间
   * @param prevTapTime 上一次点击的时间
   * @returns 2次tap的时间间隔是否满足条件
   */
  function isValidInterval(waitNextTapTime: number) {
    const now = performance.now()
    if (void 0 === prevTapTime) {
      prevTapTime = now
      return true
    } else {
      const interval = now - prevTapTime
      prevTapTime = now
      return interval < waitNextTapTime
    }
  }
  uv.compute([ComputeDistance, ComputeMaxLength], (computed: AllEvent) => {
    // 禁止
    if (isDisabled(ctx)) return
    const { phase, x, y } = computed

    // 只在end阶段去识别
    if (TYPE_END !== phase) return
    ctx.state = STATE.POSSIBLE
    // 每一次点击是否符合要求

    if (test()) {
      clearTimeout(countDownToFailTimer)
      // 判断2次点击之间的距离是否过大
      // 对符合要求的点击进行累加
      if (isValidDistanceFromPrevTap({ x, y }, ctx) && isValidInterval(ctx.waitNextTapTime)) {
        tapCount++
      } else {
        tapCount = 1
      }
      // 是否满足点击次数要求
      if (0 === tapCount % ctx.tapTimes) {
        ctx.state = STATE.RECOGNIZED
        // 触发事件
        uv.emitDev(ctx.name, computed, ctx)
        reset()
      } else {
        countDownToFail()
      }
    } else {
      reset()
      ctx.state = STATE.FAILED
    }

    // 是否满足条件
    function test() {
      const { startInput, pointLength, timestamp } = computed
      const deltaTime = timestamp - startInput.timestamp
      // 1. 触点数
      // 2. 当前点击数为0, 也就是当所有触点离开才通过
      // 3. 移动距离
      // 4. start至end的事件
      const { distance, maxPointLength } = computed
      return (
        maxPointLength === ctx.pointLength &&
        0 === pointLength &&
        ctx.maxDistance >= distance &&
        ctx.maxPressTime > deltaTime
      )
    }
  })

  return ctx
}
