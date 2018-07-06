<template>
  <v-app>
    <main-menu :items="menuItems"></main-menu>
    <loading-spinner :loading="loading"></loading-spinner>
    <message/>
    <v-content class="mt-5">
      <router-view/>
    </v-content>
  </v-app>
</template>
<style>
  html {
    overflow-y: auto
  }
  a {
    text-decoration-skip-ink: none;
    text-underline-position: under;
  }
</style>

<script type="text/babel">
import LoadingSpinner from '@/components/app/loading-spinner.vue'
import Message from '@/components/app/message.vue'
import MainMenu from '@/components/app/main-menu.vue'
import Api from '@/api'
import {mapGetters, mapActions, mapMutations} from 'vuex'
export default {
  name: 'App',
  data () {
    return {
      loading: false
    }
  },
  computed: {
    menuItems () {
      let result = []
      if (this.isAuthenticated) {
        result.push({
          text: 'Zone 1',
          icon: 'mdi-file-image',
          to: {path: '/1'}
        })
        result.push({
          text: 'Zone 2',
          icon: 'mdi-file-image',
          to: {path: '/2'}
        })
      }
      return result
    },
    ...mapGetters('account', [
      'isAuthenticated',
      'token',
      'user'
    ])
  },
  created () {
    Api.onGetToken = () => this.token
    Api.onStartRequest = () => {
      this.loading = true
    }
    Api.onCompleteRequest = () => {
      this.loading = false
    }
    Api.onMessage = (message) => {
      this.setMessage(message)
    }
    Api.onError = (errorMessage, errorStatus, errorFields) => {
      this.loading = false
      let statusMessage = ''
      switch (errorStatus) {
        case 500:
          statusMessage = 'Внутренняя ошибка'
          break
        case 401:
          statusMessage = 'Отказ в авторизации'
          break
        case 404:
          statusMessage = 'Данные не найдены'
          break
        case 422:
          statusMessage = 'Ошибка в данных'
          let fieldsMessage = errorFields.map(e => e.message)
          if (fieldsMessage.length) {
            errorMessage += ': <ul><li>' + fieldsMessage.join('</li><li>') + '</li><ui>'
            statusMessage = null
          }
          break
      }
      this.setError(errorMessage + (statusMessage ? '<br>Cтатус: ' + statusMessage : ''))
      if (errorStatus === 401) {
        this.logout()
      }
    }
  },
  methods: {
    ...mapMutations([
      'setMessage',
      'setError'
    ]),
    ...mapActions([
    ])
  },
  components: {
    LoadingSpinner, Message, MainMenu
  }
}
</script>
