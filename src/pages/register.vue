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
              counter="80"
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
              counter="20"
              :rules="passwordRules"
              :error-messages="errors('password')"
              @keyup.enter="login"
          ></v-text-field>
          <v-text-field
              label="Повтор пароля"
              v-model="password_confirmation"
              password
              required
              type="password"
              counter="20"
              :rules="passwordConfirmationRules"
              :error-messages="errors('password_confirmation')"
          ></v-text-field>
          <v-text-field
              label="Имя, фамилия, отчество"
              v-model="username"
              required
              counter="80"
              :rules="[validation.fieldIsRequired, validation.maximumLength(250)]"
              :error-messages="errors('username')"
          ></v-text-field>
          <v-textarea
              label="О себе"
              v-model="about"
              counter="250"
              multi-line
              :rules="[validation.maximumLength(250)]"
              :error-messages="errors('about')"
          ></v-textarea>

        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn block color="primary" @click="register" :disabled="registered">Регистрация</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>
<script type="text/babel">
  import Api from '@/api'
  import config from '@/config'
  import validation from '@/lib/validation-rules.js'
  import PanelTitle from '@/components/panel-title.vue'

  export default {
    name: 'Register',
    data () {
      return {
        email: '',
        password: '',
        password_confirmation: '',
        username: '',
        about: '',
        valid: false,
        registered: false,
        validation,
        passwordRules: [
          validation.fieldIsRequired,
          validation.minimumLength(6),
          validation.maximumLength(20)
        ],
        passwordConfirmationRules: [
          validation.confirmPasswordIsRequired,
          (value) => value === this.password || 'Пароль не совпал'
        ],
        errorsData: [],
        appName: config.APP_NAME
      }
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
      clearErrors (e) {
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
      register () {
        this.errorsData = []
        this.$refs.form.validate()
        if (!this.valid) {
          return
        }
        Api.rest({
          method: 'post',
          url: 'register',
          data: {
            email: this.email,
            password: this.password,
            password_confirmation: this.password_confirmation,
            username: this.username,
            about: this.about
          }
        })
          .then((response) => {
            this.registered = true
          })
          .catch(error => {
            this.gatherErrors(error)
          })
      }
    },
    components: {
      PanelTitle
    }
  }
</script>
