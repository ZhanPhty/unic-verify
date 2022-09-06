// mouse事件
export const MOUSE_UP = 'mouseup'
export const MOUSE_MOVE = 'mousemove'
export const MOUSE_DOWN = 'mousedown'

// touch事件
export const TOUCH_START = 'touchstart'
export const TOUCH_MOVE = 'touchmove'
export const TOUCH_END = 'touchend'
export const TOUCH_CANCEL = 'touchcancel'

/**
 * 方向
 */
export const DIRECTION_LEFT = 'left'
export const DIRECTION_RIGHT = 'right'
export const DIRECTION_UP = 'up'
export const DIRECTION_DOWN = 'down'

// 事件类型
export const TOUCH = 'touch'
export const MOUSE = 'mouse'

export const CLIENT_X = 'clientX'
export const CLIENT_Y = 'clientY'

// 计算方向/速度的时间间隔
export const COMPUTE_INTERVAL = 16

// 输入阶段
export const TYPE_START = 'start'
export const TYPE_MOVE = 'move'
export const TYPE_CANCEL = 'cancel'
export const TYPE_END = 'end'

// 验证模式
export const FLOAT_MODE = 'float'
export const EMBED_MODE = 'embed'
export const POPUP_MODE = 'popup'

// 识别器状态码
export const enum STATE {
  POSSIBLE,
  RECOGNIZED,
  FAILED,
  CANCELLED,
  START,
  MOVE,
  END = RECOGNIZED
}
