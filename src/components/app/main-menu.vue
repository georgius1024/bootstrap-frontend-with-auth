<template>
  <v-toolbar app color="primary" class="main-menu" dark prominent :extended="Boolean(hasMenu)">
    <v-toolbar-title>
      <router-link :to="{name: 'Index'}">
        <img src="@/assets/logo.png" class="logo">
      </router-link>
    </v-toolbar-title>

    <v-toolbar-title>{{config.APP_NAME}}</v-toolbar-title>

    <v-toolbar dark color="primary" class="main-menu" flat slot="extension" v-if="hasMenu">
      <v-toolbar-items>
        <template v-for="item in menuItems">
          <v-btn
              v-if="!item.children"
              flat
              :key="item.text"
              :to="item.to"
              :exact="item.exact"
          >
            <v-icon v-if="item.icon" class="mr-1">
              {{item.icon}}
            </v-icon>
            {{item.text}}
          </v-btn>
          <v-menu
              v-else
              :key="item.text"
              open-on-hover
              offset-y
          >
            <v-btn
                slot="activator"
                flat
                :to="item.to"
                :exact="item.exact"
            >
              <v-icon v-if="item.icon" class="menu-icon mr-1">
                {{item.icon}}
              </v-icon>
              <span v-html="item.text" />
            </v-btn>
            <v-list>
              <template v-for="child in item.children">
                <v-divider v-if="child.text==='-'" />
                <v-list-tile
                    v-else
                    :key="child.text"
                    :to="child.to ? child.to : null"
                    @click="child.handler ? child.handler() : ''"
                >
                  <v-list-tile-content>
                    <v-list-tile-title>
                      <span v-html="child.text" />
                    </v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action v-if="child.icon" >
                    <v-icon :color="child.icon_color">{{child.icon}}</v-icon>
                  </v-list-tile-action>
                </v-list-tile>
              </template>
            </v-list>
          </v-menu>
        </template>
      </v-toolbar-items>
    </v-toolbar>
    <v-spacer/>
    <v-toolbar-items class="ml-4">
      <v-menu offset-y v-if="isAuthenticated">
        <v-btn
          flat
          small
          slot="activator"
        >
          <span>
            {{user.username}}
          </span>
          <v-icon>arrow_drop_down</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile :to="{name: 'Profile'}">
            <v-list-tile-title>Профайл</v-list-tile-title>
          </v-list-tile>
          <v-list-tile :to="{name: 'ChangePassword'}">
            <v-list-tile-title>Сменить пароль</v-list-tile-title>
          </v-list-tile>
          <!--
          <v-list-tile v-bind:to="{name: 'ChangePassword'}">
            <v-list-tile-title>Сменить пароль</v-list-tile-title>
          </v-list-tile>
          -->
          <v-list-tile :to="{name: 'Logout'}">
            <v-list-tile-title>Выйти</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-btn
        flat
        :to="{name: 'Login'}"
        v-else
      >
        <span>
          Войти
        </span>
      </v-btn>
    </v-toolbar-items>

  </v-toolbar>
</template>
<style>
  .main-menu {
    padding-bottom: 1px
  }
  .main-menu .v-toolbar__title {
    min-width: 64px !important;
  }
  .main-menu .logo {
    margin-top: 8px;
    max-height: 50px !important;
    max-width: 50px !important;
    width: auto;
    filter: grayscale(100%) contrast(0%) brightness(200%);
  }

</style>
<script type="text/babel">
  import config from '@/config'
  import {mapGetters} from 'vuex'
  export default {
    name: 'MainMenu',
    props: {
      items: {
        type: Array,
        required: true
      }
    },
    computed: {
      config () {
        return config
      },
      hasMenu () {
        return Array.isArray(this.items) && this.items.length
      },
      menuItems () {
        return this.items
      },
      ...mapGetters('account', [
        'user',
        'isAuthenticated'
      ]),
      ...mapGetters([
      ])
    }
  }
</script>
