import type { NativeEvent, SupportElement } from '@unic/shared'
import {
  TOUCH_START,
  TOUCH_MOVE,
  TOUCH_END,
  TOUCH_CANCEL,
  MOUSE_DOWN,
  MOUSE_MOVE,
  MOUSE_UP
} from '@unic/shared'

const ELEMENT_TYPES = [TOUCH_START, TOUCH_MOVE, TOUCH_END, TOUCH_CANCEL, MOUSE_DOWN] as const
const WINDOW_TYPES = [MOUSE_MOVE, MOUSE_UP] as const

/*
 * 根据输入设备绑定事件
 */
export default function (
  el: SupportElement,
  catchEvent: (e: NativeEvent) => void,
  options?: boolean | AddEventListenerOptions
): () => void {
  ELEMENT_TYPES.forEach((type) => {
    el.addEventListener(type, catchEvent as any)
  })

  WINDOW_TYPES.forEach((type) => {
    window.addEventListener(type, catchEvent, options)
  })

  return () => {
    ELEMENT_TYPES.forEach((types) => {
      el.removeEventListener(types, catchEvent as any, options)
    })

    WINDOW_TYPES.forEach((type) => {
      window.removeEventListener(type, catchEvent)
    })
  }
}
