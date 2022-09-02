<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div></div>
  </div>
</template>

<script>
import UnicVerify from '../../../packages/unic-verify/dist/unic-verify.umd'

export default {
  mounted() {
    console.log(UnicVerify)
  }
}
</script>
