<template>
  <div>
    {{message}}
  </div>
</template>
<script type="text/babel">
  // import Api from '@/api'
  export default {
    name: 'IndexPage',
    data () {
      return {
        message: ''
      }
    },
    async mounted () {
      /*
      const x = await Api.rest({ url: 'user-profile' })
      this.message = x.message
      console.log(x)
      */
    }
  }
</script>
