import UnicEvent from '@unic/event'
import { STATE, VERIFYSTATE } from './const'

export type KV = Record<string, any>

export type PluginOptions = { name?: string } & KV

/**
 * 事件状态
 */
export type RECOGNIZER_STATE = STATE

/**
 * 验证回调事件上下文内容
 */
export type VerifyContext = {
  state: VERIFYSTATE
  event: AllEvent
}

/**
 * 插件上下文内容
 */
export type PluginContext<D extends Required<PluginOptions> = Required<PluginOptions>> = {
  state: RECOGNIZER_STATE
  disabled: boolean
} & D

/**
 * 插件
 */
export type Plugin = (context: UnicEvent, pluginOptions?: PluginOptions) => PluginContext

export type SupportElement = HTMLElement | SVGElement

/**
 * 适配器支持的事件类型
 */
export type NativeEvent = MouseEvent | TouchEvent

export interface PointClientXY {
  target: EventTarget | null
  clientX: number
  clientY: number
}

/**
 * 输入阶段
 */
export type phase = 'start' | 'move' | 'end' | 'cancel'

/**
 * 原生事件上选取的共有字段
 */
export interface PubicEvent {
  readonly phase: phase
  readonly changedPoints: PointClientXY[]
  readonly points: PointClientXY[]
  readonly target: EventTarget | null
  readonly targets: (EventTarget | null)[]
  readonly nativeEvent: Event
}

/**
 * 不包含prevInput/startInput/startMultiInput的Input
 */
export interface InputOnlyHasCurrent extends PubicEvent {
  readonly id: number
  // 新一轮手势识别的开始和结束
  readonly isStart: boolean
  readonly isEnd: boolean
  readonly pointLength: number
  // 当前时间
  readonly timestamp: number
  readonly target: EventTarget | null
  readonly currentTarget: EventTarget | null
  readonly center?: Point
  // 同centerX/Y
  readonly x: number
  readonly y: number
  readonly getOffset: (el: HTMLElement) => { x: number; y: number }
}

/**
 * 提供给插件(compute函数)之前的统一化数据
 */
export interface Input extends InputOnlyHasCurrent {
  readonly startInput: InputOnlyHasCurrent
  readonly startMultiInput?: InputOnlyHasCurrent
  readonly prevInput?: InputOnlyHasCurrent
}

/**
 * 方向
 */
export type directionString = 'up' | 'right' | 'down' | 'left' | 'none'

/**
 * 点
 */
export interface Point {
  x: number
  y: number
}

export type Vector = Point

/**
 * Input转换器
 */
export interface InputCreatorFunction<T> {
  (event: T): void | Input
}

/**
 * Input转换器外壳函数映射
 */
export interface InputCreatorFunctionMap {
  [k: string]: InputCreatorFunction<NativeEvent>
}

/**
 * Input执行计算后的数据格式
 */
export interface Computed extends KV {
  // 一次识别周期中出现的最大触点数
  readonly maxPointLength?: number
  // 参与速度计算的触点数量
  readonly vPointLengh?: number
  // 当前 x 轴速度
  readonly velocityX?: number
  // 当前 y 轴速度
  readonly velocityY?: number
  readonly speedX?: number
  readonly speedY?: number
  // 当前触点和前触点的 x 轴偏移距离
  readonly deltaX?: number
  // 当前触点和前触点的 y 轴偏移距离
  readonly deltaY?: number
  readonly deltaXYAngle?: number
  // 当前触点与起始触点的 x 位移(矢量)
  readonly displacementX?: number
  // 当前触点与起始触点的 y 位移(矢量)
  readonly displacementY?: number
  // displacementX 的绝对值
  readonly distanceX?: number
  // displacementY 的绝对值
  readonly distanceY?: number
  // 当前触点与起始触点的距离(标量)
  readonly distance?: number
  // 当前时间与起始触碰时间的差值
  readonly deltaTime?: number
  // 与起始点的偏移方向
  readonly overallDirection?: directionString
  // 瞬时方向
  readonly direction?: directionString
  // 多值形成的向量
  readonly startVecotr?: Vector
  readonly prevVecotr?: Vector
  readonly activeVecotr?: Vector
}

export interface AllEvent extends Input, Required<Computed> {
  readonly type: string
  readonly stopPropagation: () => void
  readonly stopImmediatePropagation: () => void
  readonly preventDefault: () => void
}

/**
 * 计算函数
 */
export type ComputeFunction = (input: Input, computed: Partial<Computed>) => Computed | void

/**
 * 计算函数生成器
 */
export type ComputeFunctionCreator = () => ComputeFunction
