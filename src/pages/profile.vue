<template>
  <v-flex md6 offset-md3 xs12 class="mt-3">
    <v-card>
      <panel-title caption="Профайл" close></panel-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-text-field
              label="Email"
              v-model="profile.email"
              required
              :rules="[validation.emailMustBeValid]"
              :error-messages="errors('email')"
          ></v-text-field>
          <v-text-field
              label="Имя, фамилия, отчество"
              v-model="profile.username"
              required
              counter="80"
              :rules="[validation.fieldIsRequired, validation.maximumLength(250)]"
              :error-messages="errors('username')"
          ></v-text-field>
          <v-textarea
              label="О себе"
              v-model="profile.about"
              counter="250"
              multi-line
              :rules="[validation.maximumLength(250)]"
              :error-messages="errors('about')"
          ></v-textarea>
        </v-form>
      </v-card-text>
      <v-divider/>
      <v-card-actions>
        <v-btn block color="primary" @click="updateProfile">
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>
<script type="text/babel">
  import _ from 'lodash'
  import { mapMutations } from 'vuex'
  import Api from '@/api'
  import validation from '@/lib/validation-rules.js'
  import PanelTitle from '@/components/panel-title.vue'

  export default {
    name: 'Profile',
    data () {
      return {
        profile: {
          email: '',
          username: '',
          about: ''
        },
        valid: false,
        errorsData: [],
        validation
      }
    },
    mounted () {
      this.getProfile()
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
      gatherErrors (error) {
        if (_.has(error, 'response.data.errors', [])) {
          this.errorsData = _.get(error, 'response.data.errors', [])
        } else {
          this.errorsData = [
            {
              field: 'email',
              message: this.message.text
            }
          ]
        }
      },
      getProfile () {
        Api.rest({
          url: 'user-profile',
          method: 'get'
        })
          .then(response => {
            this.profile = response.data
          })
      },
      updateProfile () {
        this.errorsData = []
        this.$refs.form.validate()
        if (!this.valid) {
          return
        }
        Api.rest({
          url: 'user-profile',
          method: 'post',
          data: this.profile
        })
          .then(response => {
            this.setUser(response.data)
            this.$router.push({name: 'Index'})
          })
          .catch(error => this.gatherErrors(error))
      },
      ...mapMutations('account', [
        'setUser'
      ])
    },
    components: {
      PanelTitle
    }
  }
</script>
