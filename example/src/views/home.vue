<template>
  <div>
    <h1>@unic/verofy - demo</h1>
    <div class="about" id="unicVerify"></div>
  </div>
</template>

<script>
import UnicVerify from '../../../packages/unic-verify/dist/unic-verify.umd'

export default {
  mounted() {
    const el = document.getElementById('unicVerify')
    UnicVerify(el, {
      key: 'test1234',
      width: '300px',
      version: '1',
      onVerify(ev) {
        console.log(ev, '验证状态')
      }
    })
      .then(() => {
        // const UVTest = new UV()
        console.log('Demo加载成功')
      })
      .catch((err) => {
        console.log(err, '组件加载失败')
      })
  }
}
</script>

<style lang="less">
@import '../../../packages/unic-verify/dist/unic-verify.css';
</style>

<style lang="less" scoped>
.about {
  padding: 20px;
  width: 400px;
  min-height: 400px;
  margin: auto;
  border: 1px solid #f0f0f0;
}
</style>
