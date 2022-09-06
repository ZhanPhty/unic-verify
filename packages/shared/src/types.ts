import Core from '@unic/core'
import { STATE } from './const'

export type KV = Record<string, any>

export type PluginOptions = { name?: string } & KV

/**
 * 验证码模式
 */
export type RECOGNIZER_STATE = STATE

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
export type Plugin = (context: Core, pluginOptions?: PluginOptions) => PluginContext

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
  // readonly preventDefault: () => void;
  // 新一轮手势识别的开始和结束
  readonly isStart: boolean
  readonly isEnd: boolean
  readonly pointLength: number
  // 发生改变的触点数据
  // readonly changedPointLength: number;
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
  // readonly vPointLengh?: number;
  readonly velocityX?: number
  readonly velocityY?: number
  readonly speedX?: number
  readonly speedY?: number
  readonly scale?: number
  readonly deltaScale?: number
  readonly angle?: number
  readonly deltaAngle?: number
  readonly deltaX?: number
  readonly deltaY?: number
  readonly deltaXYAngle?: number
  readonly displacementX?: number
  readonly displacementY?: number

  readonly distanceX?: number
  readonly distanceY?: number
  readonly distance?: number
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