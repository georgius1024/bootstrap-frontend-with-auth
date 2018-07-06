<template>
  <v-flex md6 offset-md3 xs12 class="mt-3">
    <v-card>
      <panel-title caption="Смена пароля"></panel-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-text-field
              label="Новый пароль"
              v-model="password"
              required
              type="password"
              :rules="validation.passwordRules"
              :error-messages="errors('password')"
          ></v-text-field>
          <v-text-field
              label="Повтор пароля"
              v-model="password_confirmation"
              password
              required
              type="password"
              :rules="validation.passwordConfirmationRules"
              :error-messages="errors('password_confirmation')"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-divider/>
      <v-card-actions>
        <v-btn block color="primary" @click="resetPassword">
          Сменить пароль
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>
<script type="text/babel">
  import { mapMutations } from 'vuex'
  import Api from '@/api'
  import validation from '@/lib/validation-rules.js'
  import PanelTitle from '@/components/panel-title.vue'

  export default {
    name: 'ResetPassword',
    data () {
      return {
        password: '',
        password_confirmation: '',
        valid: false,
        errorsData: [],
        validation: {
          passwordRules: [
            validation.fieldIsRequired,
            validation.minimumLength(6),
            validation.maximumLength(20)
          ],
          passwordConfirmationRules: [
            validation.confirmPasswordIsRequired,
            (value) => value === this.password || 'Пароль не совпал'
          ]
        }
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
                field: 'password',
                message: e.response.data.message
              }
            ]
          }
        } else {
          this.errorsData = [
            {
              field: 'password',
              message: e.message
            }
          ]
        }
      },
      resetPassword () {
        this.errorsData = []
        this.$refs.form.validate()
        if (!this.valid) {
          return
        }
        Api.rest({
          method: 'post',
          url: 'resetpass',
          data: {
            password: this.password,
            password_confirmation: this.password_confirmation
          }
        })
          .then((response) => {
            this.loginProcedure({user: response.data, token: response.auth.token})
            Api.token = response.auth
            this.$router.push({name: 'Index'})
          })
          .catch(error => {
            console.log(error)
            this.gatherErrors(error)
          })
      },
      ...mapMutations({
        loginProcedure: 'account/login'
      })
    },
    components: {
      PanelTitle
    }
  }
</script>
