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
              hint="Отправьте свой e-mail и мы пришлем Вам письмо со ссылкой для входа"
              :rules="[validation.fieldIsRequired, validation.emailMustBeValid]"
              :error-messages="errors('email')"
              @keyup.enter="login"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn block color="primary" @click="login">Отправить</v-btn>
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
    name: 'LoginByEmail',
    data () {
      return {
        email: '',
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
          url: 'login-passwordless',
          data: {
            email: this.email
          }
        })
          .then((response) => {
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
