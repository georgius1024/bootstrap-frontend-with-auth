<template>
</template>
<script type="text/babel">
  import { mapGetters, mapMutations } from 'vuex'
  import config from '@/config'
  import Api from '@/api'

  export default {
    name: 'Footer',
    data () {
      return {
        config,
        Api
      }
    },
    mounted () {
      if (this.$route.query.error) {
        this.setError(this.$route.query.error)
      } else if (this.$route.query.once) {
        this.loginOnce(this.$route.query.once)
      } else {
        this.$router.push({name: 'Index'})
      }
    },
    computed: {
      ...mapGetters([
        'user',
        'isAuthenticated'
      ])
    },
    methods: {
      loginOnce (code) {
        Api.rest({
          method: 'post',
          url: 'once/' + code
        })
          .then((response) => {
            this.loginProcedure({user: response.data, token: response.auth.token})
            Api.token = response.auth
            if (response.data.status === 'reset') {
              this.$router.push({name: 'ResetPassword'})
            } else {
              this.$router.push({name: 'Index'})
            }
          })
      },
      ...mapMutations([
        'setError'
      ]),
      ...mapMutations({
        loginProcedure: 'account/login'
      })
    }
  }
</script>