# @unic/action
⭐️预设的手势action

## Action使用说明

```javascript
import UEvent from '@unic/event'
import { Swipe } from '@unic/action' //  预设的手势action

const el = document.getElementById('ID')
const UV = new UEvent(el)
UV.use(Swipe, {name: 'swipe'})

// 监控
UV.on('swipe', (ev) => {
  console.log(ev)
})
UV.on('updateend', (ev) => {
})

// 获取事件信息
const uOption = UV.get('swipe')

// 修改事件状态
uOption.disabled = true // 禁用事件
```

## 预设
- tap :点击
- swipe :滑动
