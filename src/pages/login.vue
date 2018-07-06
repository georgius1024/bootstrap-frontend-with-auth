<template>
  <v-flex md6 offset-md3 xs12 class="mt-3">
    <v-card>
      <panel-title :caption="'Вход в ' + appName" ></panel-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-text-field
              autofocus
              label="Email"
              v-model="email"
              required
              :rules="[validation.fieldIsRequired, validation.emailMustBeValid]"
              :error-messages="errors('email')"
              @keyup.enter="focusPassword"
          ></v-text-field>
          <v-text-field
              label="Пароль"
              v-model="password"
              ref="password"
              required
              type="password"
              :error-messages="errors('password')"
              @keyup.enter="login"
          ></v-text-field>
        </v-form>
        <v-divider class="my-4"></v-divider>
        <v-layout class="mt-4">
          <v-flex>
            <router-link :to="{ name: 'LoginByEmail'}">
              Забыли пароль?
            </router-link>
          </v-flex>
          <v-flex class="text-xs-right">
            <router-link :to="{ name: 'Register'}">
              Регистрация
            </router-link>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-btn block color="primary" @click="login" :disabled="!valid">Войти</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>
<script type="text/babel">
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  import Api from '@/api'
  import config from '@/config'
  import validation from '@/lib/validation-rules.js'
  import PanelTitle from '@/components/panel-title.vue'

  export default {
    name: 'Login',
    data () {
      return {
        email: '',
        password: '',
        valid: false,
        validation,
        errorsData: [],
        appName: config.APP_NAME
      }
    },
    computed: {
      ...mapGetters([
      ])
    },
    methods: {
      errors (field) {
        if (Array.isArray(this.errorsData)) {
          return this.errorsData
            .filter(e => {
              return e.field === field
            })
            .map(e => {
              return e.message
            })
        }
      },
      clearErrors () {
        this.errorsData = []
      },
      gatherErrors (e) {
        if (e.response && e.response.data) {
          if (Array.isArray(e.response.data.errors) && e.response.data.errors.length) {
            this.errorsData = e.response.data.errors
          } else {
            this.errorsData = [
              {
                field: 'email',
                message: e.response.data.message
              }
            ]
          }
        } else {
          this.errorsData = [
            {
              field: 'email',
              message: e.message
            }
          ]
        }
      },
      focusPassword () {
        this.$refs.password.focus()
      },
      login () {
        this.errorsData = []
        this.$refs.form.validate()
        if (!this.valid) {
          return
        }
        Api.rest({
          method: 'post',
          url: 'login-traditional',
          data: {
            email: this.email,
            password: this.password
          }
        })
          .then((response) => {
            this.loginProcedure({user: response.data, token: response.auth.token})
            Api.token = response.auth
            this.$router.push({name: 'Index'})
          })
          .catch(error => {
            this.gatherErrors(error)
          })
      },
      ...mapMutations({
        loginProcedure: 'account/login'
      }),
      ...mapActions({

      })
    },
    components: {
      PanelTitle
    }
  }
</script>
