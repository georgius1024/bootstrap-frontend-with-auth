<template>
  <v-flex md6 offset-md3 xs12 class="mt-3">
    <v-card>
      <panel-title caption="Смена пароля" close></panel-title>
      <v-card-text>
        Для того, чтобы изменить свой пароль, щелкните по кнопке.
        На Ваш e-mail ({{email}}) будет отправлено сообщение со ссылкой для изменения пароля.
      </v-card-text>
      <v-card-actions>
        <v-btn block color="primary" @click="changePassword">
          Сменить пароль
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>
<script type="text/babel">
  import _ from 'lodash'
  import { mapGetters } from 'vuex'
  import Api from '@/api'
  import PanelTitle from '@/components/panel-title.vue'

  export default {
    name: 'ChangePassword',
    data () {
      return {
      }
    },
    computed: {
      email () {
        return _.get(this, 'user.email')
      },
      ...mapGetters('account', [
        'user'
      ])
    },
    mounted () {
    },
    methods: {
      changePassword () {
        Api.rest({
          url: 'forgot/' + this.email,
          method: 'post'
        })
      }
    },
    components: {
      PanelTitle
    }
  }
</script>
