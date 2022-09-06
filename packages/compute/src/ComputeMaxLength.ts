import { Input, TYPE_START } from '@unic/shared'

function ComputeMaxLength() {
  let maxPointLength = 0
  return function (input: Input) {
    const { phase } = input
    if (TYPE_START === phase) {
      maxPointLength = input.pointLength
    }
    return { maxPointLength }
  }
}
export default ComputeMaxLength
