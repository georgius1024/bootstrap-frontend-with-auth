<template>
  <v-toolbar class="primary" dark dense>
    <v-toolbar-title v-text="caption"></v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn v-if="hasClose" icon class="primary" to="/">
      <v-icon >
        clear
      </v-icon>
    </v-btn>
  </v-toolbar>
</template>
<script type="text/babel">
  export default {
    name: 'PanelTitle',
    computed: {
      hasClose () {
        if (typeof this.close === 'boolean') {
          return this.close
        } else {
          return true
        }
      }
    },
    props: {
      caption: {
        type: String,
        required: true
      },
      close: {
        default: false
      }
    }
  }
</script>
