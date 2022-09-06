import { RECOGNIZER_STATE } from './index'
import { STATE, TYPE_START, TYPE_CANCEL, TYPE_END, TYPE_MOVE } from './const'
import { PluginContext } from './types'

const STATUS_CODE_AND_NAME_MAP: { [k: number]: 'start' | 'move' | 'end' | 'cancel' | undefined } = {
  [STATE.START]: TYPE_START,
  [STATE.MOVE]: TYPE_MOVE,
  [STATE.END]: TYPE_END,
  [STATE.CANCELLED]: TYPE_CANCEL
}

/**
 * 获取状态字符串
 * @param code 状态代码
 * @returns
 */
export function getStatusName(code: RECOGNIZER_STATE) {
  return STATUS_CODE_AND_NAME_MAP[code]
}

/**
 * 如果当前识别成功,
 * 那么计算当前识别器状态.
 * 逻辑: 是否test通过 + 上一轮识别器状态 + 输入阶段 => 当前识别器状态
 * @param isVaild 是否通过test
 * @param lastStatus 上一轮识别器状态
 * @param phase 输入阶段
 * @returns 识别器状态
 */
export function flow(isVaild: boolean, lastStatus: RECOGNIZER_STATE, phase: string): RECOGNIZER_STATE {
  /*
   * {
   *  isValid {
   *    lastStatus {
   *      phase: currentStatus
   *    }
   *  }
   * }
   * Number(true) === 1
   * 这个分支不会出现STATUS_FAILED
   * STATUS_END在上面的代码中也会被重置为STATUS_POSSIBLE, 从而进行重新识别
   */
  const STATE_MAP: { [k: number]: any } = {
    1: {
      [STATE.POSSIBLE]: {
        [TYPE_MOVE]: STATE.START
      },

      [STATE.START]: {
        [TYPE_MOVE]: STATE.MOVE,
        [TYPE_END]: STATE.END,
        [TYPE_CANCEL]: STATE.CANCELLED
      },

      [STATE.MOVE]: {
        [TYPE_MOVE]: STATE.MOVE,
        [TYPE_END]: STATE.END,
        [TYPE_CANCEL]: STATE.CANCELLED
      }
    },
    // isVaild === false
    // 这个分支有STATUS_FAILED
    0: {
      [STATE.START]: {
        [TYPE_MOVE]: STATE.FAILED,
        [TYPE_END]: STATE.END,
        [TYPE_CANCEL]: STATE.CANCELLED
      },

      [STATE.MOVE]: {
        [TYPE_START]: STATE.FAILED,
        [TYPE_MOVE]: STATE.FAILED,
        [TYPE_END]: STATE.END,
        [TYPE_CANCEL]: STATE.CANCELLED
      }
    }
  }
  const map = STATE_MAP[Number(isVaild)][lastStatus]
  return (void 0 !== map && map[phase]) || STATE.POSSIBLE
}

/**
 * 重置状态到possible
 * @param context 识别器实例
 */
export function resetState(context: PluginContext) {
  if ([STATE.RECOGNIZED, STATE.CANCELLED, STATE.FAILED].includes(context.state)) {
    context.state = STATE.POSSIBLE
  }
}

/**
 * 是否事件的结束
 * @param state
 * @returns 是否
 */
export function isMoveOrEndOrCancel(state: RECOGNIZER_STATE): boolean {
  return [STATE.MOVE, STATE.END, STATE.CANCELLED].includes(state)
}

/**
 * 判断是否禁止识别
 * @param context 识别器实例
 * @returns 是否禁止识别
 */
export function isDisabled(context: PluginContext) {
  if (context.disabled) {
    context.state = STATE.POSSIBLE
    return true
  }
}
