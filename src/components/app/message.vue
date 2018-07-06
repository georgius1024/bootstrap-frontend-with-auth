<template>
  <v-snackbar
    top
    right
    multi-line
    :color="message.level || 'success'"
    v-model="gotMessage"
  >
    <span v-html="message.text"></span>
    <v-btn dark icon flat @click.native="gotMessage = false">
      <v-icon>
        clear
      </v-icon>
    </v-btn>
  </v-snackbar>
</template>
<script type="text/babel">
  import {mapGetters, mapMutations} from 'vuex'
  export default {
    data () {
      return {
        gotMessage: false
      }
    },
    props: {
      messageText: {
        type: String,
        required: false
      },
      messageLevel: {
        type: String,
        required: false
      }
    },
    computed: {
      ...mapGetters([
        'error',
        'message'
      ])
    },
    mounted () {
      this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'setError' && mutation.payload) {
          this.gotMessage = true
          this.setLoading(false)
        }
        if (mutation.type === 'setMessage' && mutation.payload) {
          this.gotMessage = true
          this.setLoading(false)
        }
      })
    },
    methods: {
      ...mapMutations([
        'setLoading'
      ])
    }
  }
</script>

