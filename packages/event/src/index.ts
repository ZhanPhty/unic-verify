import MittEvent from './mitt'
export type UEvent = MittEvent

import type {
  PluginContext,
  Plugin,
  InputCreatorFunction,
  InputCreatorFunctionMap,
  NativeEvent,
  Computed,
  ComputeFunction,
  ComputeFunctionCreator,
  AllEvent,
  Input,
  SupportElement
} from '@unic/shared'
import {
  TOUCH_START,
  TOUCH_MOVE,
  TOUCH_END,
  TOUCH_CANCEL,
  MOUSE_DOWN,
  MOUSE_MOVE,
  MOUSE_UP
} from '@unic/shared'

import { mouse, touch } from './createInput'
import bindElement from './bindElement'
import dispatchDomEvent from './dispatchDomEvent'

/**
 * 默认的事件名和事件对象映射
 */
export interface EventMap {
  input: Input
  computed: Record<string, any>
  u: undefined
  'uv:after': Computed
  'uv:start': Input
  'uv:move': Input
  'uv:cancel': Input
  'uv:end': Input
}

export interface Options {
  // 是否触发DOM事件
  domEvents?: false | EventInit
  preventDefault?: boolean | ((e: NativeEvent) => boolean)
}

/**
 * 默认设置
 */
const DEFAULT_OPTIONS: Options = {
  domEvents: { bubbles: true, cancelable: true },
  preventDefault: (event) => {
    if (event.target && 'tagName' in event.target) {
      const { tagName } = event.target
      return !/^(?:INPUT|TEXTAREA|BUTTON|SELECT)$/.test(tagName)
    }
    /* istanbul ignore next */
    return false
  }
}

const TYPE_UNBIND = 'u'
const TYPE_INPUT = 'input'
const TYPE_COMPUTED = 'computed'
const TYPE_AFTER = 'uv:after'

export default class UnicEvent extends MittEvent {
  /**
   * 绑定的元素
   */
  el?: SupportElement
  /**
   * 当前插件(仅供插件开发者使用)
   */
  c?: PluginContext
  // 选项
  private __options: Options
  // 计算函数队列
  private __computeFunctionList: ComputeFunction[] = []
  // 计算函数生成器仓库
  private __computeFunctionCreatorList: ComputeFunctionCreator[] = []
  // 事件类型和输入函数的映射
  private __inputCreatorMap: InputCreatorFunctionMap
  // 是否忽略mouse事件
  private __isIgnoreMouse = false
  // 插件
  private __pluginContexts: PluginContext[] = []

  constructor(el?: SupportElement, option?: Options) {
    super()
    this.el = el
    this.c = {} as PluginContext
    this.__options = { ...DEFAULT_OPTIONS, ...option }

    // 固定为(touch&mouse)事件绑定，不接受其他事件
    const createInputFromTouch = touch(this.el) as InputCreatorFunction<NativeEvent>
    const createInputFromMouse = mouse() as InputCreatorFunction<NativeEvent>
    this.__inputCreatorMap = {
      [TOUCH_START]: createInputFromTouch,
      [TOUCH_MOVE]: createInputFromTouch,
      [TOUCH_END]: createInputFromTouch,
      [TOUCH_CANCEL]: createInputFromTouch,
      [MOUSE_DOWN]: createInputFromMouse,
      [MOUSE_MOVE]: createInputFromMouse,
      [MOUSE_UP]: createInputFromMouse
    }

    // 触发DOM事件
    this.on(TYPE_AFTER, (payload) => {
      const { target, __type } = payload
      const { domEvents } = this.__options
      if (!!domEvents && void 0 !== this.el && !!target) {
        // 所以此处的target会自动冒泡到目标元素
        dispatchDomEvent(__type, target, payload, domEvents)
        dispatchDomEvent(TYPE_AFTER, target, payload, domEvents)
      }
    })

    // 绑定事件
    if (void 0 !== el) {
      // 校验是否支持passive
      let supportsPassive = false
      try {
        const opts = {}
        Object.defineProperty(opts, 'passive', {
          get() {
            // 不想为测试暴露, 会增加体积, 暂时忽略
            /* istanbul ignore next */
            supportsPassive = true
          }
        })
        window.addEventListener('_', () => void 0, opts)
      } catch {
        console.error('不支持passive')
      }

      this.on(
        TYPE_UNBIND,
        bindElement(
          el,
          this.catchEvent.bind(this),
          false === this.__options.preventDefault && supportsPassive ? { passive: true } : { passive: false }
        )
      )
    }
  }

  /**
   * 监听input变化
   * @param event Mouse事件对象
   */
  catchEvent(event: NativeEvent): void {
    const input = this.__inputCreatorMap[event.type](event)

    // 跳过无效输入
    if (void 0 !== input) {
      const stopPropagation = () => event.stopPropagation()
      const stopImmediatePropagation = () => event.stopImmediatePropagation()
      const preventDefault = () => event.preventDefault()

      if ('touchstart' === event.type) {
        this.__isIgnoreMouse = true
      } else if ('touchmove' === event.type) {
        // 不会再触发mouse, 重置开关
        this.__isIgnoreMouse = false
      }

      if (this.__isIgnoreMouse && event.type.startsWith('mouse')) {
        if ('mouseup' === event.type) {
          this.__isIgnoreMouse = false
        }
        return
      }

      this.emit(TYPE_INPUT, input)
      this.emitDev(`uv:${input.phase}`, input as AllEvent, {} as PluginContext)

      // ====== 计算结果 ======
      const computed: Computed = {}
      this.__computeFunctionList.forEach((compute) => {
        // disabled
        const result = compute(input, computed)
        if (void 0 !== result) {
          for (const key in result) {
            computed[key] = result[key]
          }
        }
      })

      // computed
      this.emit(TYPE_COMPUTED, {
        ...input,
        ...computed,
        stopPropagation,
        stopImmediatePropagation,
        preventDefault
      })
    }
  }

  /**
   * 缓存计算函数生成器到队列
   * @param computeFunctionCreatorList 一组计算函数生成器
   */
  compute<CList extends ComputeFunctionCreator[] = ComputeFunctionCreator[]>(
    computeFunctionCreatorList: CList,
    callback: (computed: any) => void
  ) {
    // 注册到队列
    for (const computeFunctionCreator of computeFunctionCreatorList) {
      if (!this.__computeFunctionCreatorList.includes(computeFunctionCreator)) {
        // 计算函数生成器队列
        this.__computeFunctionCreatorList.push(computeFunctionCreator)
        // 计算函数队列
        this.__computeFunctionList.push(computeFunctionCreator())
      }
    }
    // computed
    this.on(TYPE_COMPUTED, callback as (computed: Computed) => void)
  }

  /**
   * 加载并初始化插件
   * @param plugin 插件
   * @param pluginOptions 插件选项
   */
  use<P extends Plugin>(plugin: P, pluginOptions?: Parameters<P>[1]): void {
    this.__pluginContexts.push(plugin(this, pluginOptions))
  }

  /**
   * 获取识别器通过名字
   * @param name 识别器的名字
   * @return 返回识别器
   */
  get(name: string) {
    return this.__pluginContexts.find((pluginContext) => name === pluginContext.name)
  }

  /**
   * 设置选项
   * @param newOptions 选项
   */
  set(newOptions: Options) {
    this.__options = { ...this.__options, ...newOptions }
  }

  /**
   * 带DOM事件的emit(开发模式)
   * @param type 事件类型
   * @param payload 数据
   * @param pluginContext 插件实例
   */
  emitDev(type: string, payload: Computed, pluginContext: PluginContext) {
    this.c = pluginContext
    this.emit(type, { ...payload, type }, () => {
      this.emit(TYPE_AFTER as keyof EventMap, { ...payload, name: type, __type: type })
    })
  }

  /**
   * 销毁
   */
  destroy() {
    // 解绑事件
    this.emit(TYPE_UNBIND)
    super.destroy()
  }
}
