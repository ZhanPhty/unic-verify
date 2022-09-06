# @unic/event
🌛事件处理

## 分为两部分
- 原始事件处理（mitt）
- 封装的事件组件（event）

## Mitt

#### 示例
```javascript
import { MittEvent } from '@unic/event'

const Mitt = new UEvent()

// 拦截器
Mitt.beforeEach(type, next) {
  console.log(type)
  next()
}

// 监控
Mitt.on('update', (ev) => {
  console.log(ev)
})

// 绑定
Mitt.emit('update', 'test')

// 解绑
Mitt.off('update')
// 解绑全部
Mitt.off()

// 销毁
Mitt.destroy()
```
#### 方法

##### on(eventName, callback)

| 名称 | 类型 | 数据类型 | 说明
|---|---|---|---|
|eventName | 参数 | String/Symbol | 事件名称
|listener | 参数 | Function | 回调函数


## Event
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

#### 方法

##### use(action, option)

| 名称 | 类型 | 数据类型 | 说明
|---|---|---|---|
|action | 参数 | Action | 需要注册的action
|option | 参数 | Object | 插件配置

#### on(eventName, callback)

| 名称 | 类型 | 数据类型 | 说明
|---|---|---|---|
|eventName | 参数 | String | 事件名称
|callback | 参数 | Funtion | 回调函数

#### get(eventName)

| 名称 | 类型 | 数据类型 | 说明
|---|---|---|---|
|eventName | 参数 | String | 事件名称
